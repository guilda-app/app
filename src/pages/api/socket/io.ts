
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, Socket } from "socket.io";

import { FullUser, NextApiResponseServerIO } from "@/lib/types";
import getCurrentProfilePages from "@/lib/get-current-profile.pages";
import { disconnectProfile, getProfileFromUser } from "@/lib/profiles";
import { PROFILE_UPDATE } from "@/lib/socket";

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {

    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path,
            // @ts-ignore
            addTrailingSlash: false
        });
        io.sockets.on("connection", (socket: Socket) => {
            socket.on("disconnect", async () => {
                let user = await getCurrentProfilePages(socket.request.headers as any, false, true) as FullUser;
                if (!user) return;
                console.log("disconnecting profile. sockets: ", user.profile.connectedSockets)
                await disconnectProfile(user.profile);
                io.emit(PROFILE_UPDATE(user.profile.id), user.profile);
            });
        });
        res.socket.server.io = io;
    }

    res.end();
}


export default ioHandler;