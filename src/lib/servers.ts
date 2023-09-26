'use server';

import { db } from "@/lib/db";
import { Profile, Server } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { ChannelType } from "./channel";
import { MemberRole } from "./members";

export async function createNewServer({
    name,
    profileId
}: {
    name: string;
    profileId: string;
}) {
    // 1 to 4
    let randomIcon = Math.floor(Math.random() * 4) + 1;
    const server = await db.server.create({
        data: {
            name,
            profileId,
            imageUri: process.env.BASE_URL + `/default-server-icons/${randomIcon}.png`,
            invites: {
                create: {
                    code: uuidv4().substring(0, 8),
                }
            },
            channels: {
                create: {
                    name: "general",
                    profileId,
                }
            },
            members: {
                create: {
                    profileId,
                    role: MemberRole.owner
                }
            }
        },
    });
    
    return server;
}