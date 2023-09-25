import type { User, Profile } from '@prisma/client';

export interface FullUser {
    user: User;
    profile: Profile;
}

export type { User, Profile };