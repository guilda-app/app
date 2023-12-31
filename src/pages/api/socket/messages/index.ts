
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

        let embeds = await getEmbeds(content);
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
                    create: embeds
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

        return res.status(200).json(message);
    } catch (e) {
        console.error("[MESSAGE_POST]", e);
        return res.status(500).end();
    }
}