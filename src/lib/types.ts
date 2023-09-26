import type { User, Profile, Server as PrimitiveServer, Member, Invite, Channel } from '@prisma/client';

import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export interface FullUser {
    user: User;
    profile: Profile;
}

export interface Server extends PrimitiveServer {
    members: Member[];
    invites: Invite[];
    channels: Channel[];
}

export interface PopulatedServer extends PrimitiveServer {
    members: Member[];
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerIO;
        };
    };
}

export type { User, Profile };