'use server';

import { db } from "@/lib/db";
import { Profile, Server } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export async function createNewServer({
    name,
    profileId
}: {
    name: string;
    profileId: string;
}) {
    const server = await db.server.create({
        data: {
            name,
            profileId,
            imageUri: "https://i.imgur.com/6VBx3io.png",
            invites: {
                create: {
                    code: uuidv4()
                }
            }
        },
    });
    
    return server;
}