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

export async function updateServerMembers(serverId: string) {
    try {
        await axios.patch("/api/socket/update-server-members", {
            serverId
        });
    } catch (e) {
        console.error(e);
    }
}

export async function updateProfileInfo(profileId: string) {
    try {
        await axios.patch("/api/socket/update-profile-info", {
            profileId
        });
    } catch (e) {
        console.error(e);
    }
}
