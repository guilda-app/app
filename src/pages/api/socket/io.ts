
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/lib/types";

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path,
            // @ts-ignore
            addTrailingSlash: false
        });
        res.socket.server.io = io;
    }

    res.end();
}


export default ioHandler;