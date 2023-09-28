"use client";

import axios from "axios";

export default async function(serverId: string) {
    try {
        await axios.patch("/api/socket/update-server-info", {
            serverId
        });
    } catch (e) {
        console.error(e);
    }
}
