'use server';

import { db } from "@/lib/db";

export async function getVerificationCode(email: string) {
  const code = await db.verificationCode.create({
    data: {
      email,
    },
  });
  return code;
}

export async function createProfile({
    name,
    email,
    image,
}: {
    name: string;
    email: string;
    image: string;
}) {
  const profile = await db.profile.create({
    data: {
      name,
      email,
      image,
    },
  });

  return profile;
}
