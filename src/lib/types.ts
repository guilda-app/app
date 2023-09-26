import type { User, Profile, Server as PrimitiveServer, Member, Invite, Channel } from '@prisma/client';

export interface FullUser {
    user: User;
    profile: Profile;
}

export interface Server extends PrimitiveServer {
    members: Member[];
    invites: Invite[];
    channels: Channel[];
}

export type { User, Profile };