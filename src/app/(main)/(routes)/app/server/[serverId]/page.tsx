"use client";

import { getServerFromId } from "@/lib/servers";
import { Server } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ({
    params
}: { params: { serverId: string }}) {
    let serverId = params.serverId;
    const router = useRouter();

    useEffect(() => {
        async function render() {
            let server = await getServerFromId(serverId, {
                include: {
                    channels: true,
                }
            }) as any;
            if (!server) {
                router.push("/app");
            }
            let channel = server.channels[0];
            if (channel) {
                router.push(`/app/server/${serverId}/channel/${channel.id}`);
            } 
        }
        render();
    }, []);

    return (
        <>
            LOADING... TODO!
        </>
    )
}
