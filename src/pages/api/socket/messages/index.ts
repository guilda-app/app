
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types";
import getCurrentProfilePages from "@/lib/get-current-profile.pages";
import { getChannelFromServer, getServerFromIdWithVerification } from "@/lib/servers";
import { db } from "@/lib/db";
import getEmbeds from "@/lib/get-embeds";
import { Attachment } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method != 'POST' && req.method != 'DELETE') return res.status(405).end();

    try {
        const user = await getCurrentProfilePages(req, true);
        if (req.method == 'DELETE') {
            const { message } = req.body;
            if (!user) return res.status(401).end();
            if (!message) return res.status(400).end();
            const dbMessage = await db.message.findFirst({
                where: {
                    id: message.id
                }
            });
            if (!dbMessage) return res.status(404).end();
            if (message.member.profileId != user.profile.id) return res.status(403).end();
            await db.message.delete({
                where: {
                    id: message.id
                }
            });
            res?.socket?.server?.io?.emit(`chat:${dbMessage.channelId}:message:update`, message);
            res.status(200).end();
            return;
        }

        const { content, attachments } = req.body;
        const { serverId, channelId } = req.query;

        if (!user) return res.status(401).end();
        if (!serverId || !channelId) return res.status(400).end();
        if (!content && !attachments) return res.status(400).end();

        const server = await getServerFromIdWithVerification(serverId as string, user.profile.id);
        if (!server) return res.status(403).end();

        const channel = await getChannelFromServer(serverId as string, channelId as string);
        if (!channel) return res.status(404).end();

        const member = server.members.find(m => m.profileId == user.profile.id);
        if (!member) return res.status(403).end();

        let messageAttachments: {url:string}[] = [];
        for (let i = 0; i < attachments.length; i++) {
            const url = attachments[i];
            messageAttachments.push({url});
        }

        const message = await db.message.create({
            data: {
                content,
                attachments: {
                    create: messageAttachments
                },
                memberId: member.id,
                channelId: channel.id,
                embeds: {
                    create: []
                }
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                },
                embeds: true,
                attachments: true
            }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        getEmbeds(content).then(embeds => {
            if (embeds.length) {
                db.message.update({
                    where: { id: message.id },
                    data: {
                        embeds: {
                            create: embeds
                        }
                    }
                }).then(() => {
                    res?.socket?.server?.io?.emit(`chat:${channelId}:message:update`, message);
                });
            }
        });

        return res.status(200).json(message);
    } catch (e) {
        console.error("[MESSAGE_POST]", e);
        return res.status(500).end();
    }
}