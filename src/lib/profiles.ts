'use server';

import { db } from "@/lib/db";
import { Profile } from "@prisma/client";
import { Server } from "@/lib/types"

export async function getVerificationCode(email: string, forCreation: boolean) {
  const code = await db.verificationCode.create({
    data: {
      email,
      forCreation
    },
  });
  return code;
}

export async function createProfile({
  name,
  email
}: {
  name: string;
  email: string;
}) {
  const user = await db.user.create({
    data: {
      email,
    },
  });

  const profile = await db.profile.create({
    data: {
      name,
      userId: user.id,
      imageUri: "https://i.imgur.com/6VBx3io.png"
    },
  });

  return user;
}

export async function doesUserEmailExist(email: string) {
  return await db.user.findFirst({
    where: {
      email,
    },
  }) !== null;
}

export async function getActivationFromSlug(slug: string) {
  const code = await db.verificationCode.findUnique({
    where: {
      id: slug,
    },
  });

  return code;
}

export async function getUserFromEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  })
}

export async function removeActivation(id: string) {
  await db.verificationCode.delete({
    where: {
      id,
    },
  });
}

export async function getUserFromID(id: string) {
  return await db.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
}

export async function getProfileFromUser(id: string) {
  return await db.profile.findUniqueOrThrow({
    where: {
      userId: id,
    },
  });
}

export async function getProfileServerList(profile: Profile): Promise<Server[]> {
  return await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      invites: true,
      channels: true,
      members: true
    }
  });
}
