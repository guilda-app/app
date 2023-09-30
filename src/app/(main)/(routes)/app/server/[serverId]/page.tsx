"use client";

import { getServerFromId } from "@/lib/servers";
import { Server } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ({
    params
}: { params: { serverId: string }}) {
    let serverId = params.serverId;
    const router = useRouter();
    const query = useSearchParams();

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
                let params = "";
                if (query?.get("justJoined")) {
                    params = "?justJoined=1";
                }
                router.push(`/app/server/${serverId}/channel/${channel.id}` + params);
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
