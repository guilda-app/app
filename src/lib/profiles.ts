'use server';

import { db } from "@/lib/db";

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
  email,
  activationId,
}: {
  name: string;
  email: string;
  activationId: string;
}) {
  await removeActivation(activationId);
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

  return profile;
}

export async function getActivationFromSlug(slug: string) {
  const code = await db.verificationCode.findUnique({
    where: {
      id: slug,
    },
  });

  return code;
}

export async function getProfileFromEmail(email: string) {
  const profile = await db.profile.findUnique({
    where: {
      email,
    },
  });

  return profile;
}

export async function removeActivation(id: string) {
  await db.verificationCode.delete({
    where: {
      id,
    },
  });
}
