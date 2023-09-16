"use server";

import { getActivationFromSlug, getProfileFromEmail, removeActivation } from '@/lib/profiles';
import { session } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: any) {
  const { activationId } = await req.json();
  let activation = await getActivationFromSlug(activationId);
  if (!activation)
    return NextResponse.json({ error: 'Invalid activation' });
  let profile = await getProfileFromEmail(activation.email);
  if (!profile)
    return NextResponse.json({ error: 'Invalid profile' });

  await removeActivation(activationId);
  await session(req).set('id', profile.userId);
  return NextResponse.json({ message: "success" });
}