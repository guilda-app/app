"use client";

import { useSocket } from "../providers/socket-provider";
import { Badge } from "./badge";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();

    return isConnected ? (
        <Badge className="mx-auto cursor-default w-full mt-3 hover:bg-green-700 select-none text-white bg-green-600">Connected: Real-time updates enabled</Badge>
    ) : (
        <Badge className="mx-auto cursor-default w-full mt-3 hover:bg-yellow-700 select-none text-white bg-yellow-600">Disconnected: Trying again every 1s</Badge>
    )
}