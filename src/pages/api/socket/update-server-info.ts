
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types";
import getCurrentProfilePages from "@/lib/get-current-profile.pages";
import { getChannelFromServer, getServerFromIdWithVerification } from "@/lib/servers";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/members";
import { FULL_SERVER_INCLUDES } from "@/lib/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method != 'PATCH') return res.status(405).end();

    try {
        const user = await getCurrentProfilePages(req, true);
        const { serverId } = req.body;

        if (!user) return res.status(401).end();
        if (!serverId) return res.status(400).end();

        const server = await getServerFromIdWithVerification(serverId as string, user.profile.id, FULL_SERVER_INCLUDES);
        if (!server) return res.status(403).end();

        const member = server.members.find(m => m.profileId == user.profile.id);
        if (!member) return res.status(403).end();

        if (member.role < MemberRole.admin) return res.status(403).end();

        const channelKey = `server:${serverId}:update`;
        res?.socket?.server?.io?.emit(channelKey, server);

        return res.status(200).json({ message: "ok, boss!" });
    } catch (e) {
        console.error("[MESSAGE_POST]", e);
        return res.status(500).end();
    }
}