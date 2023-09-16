"use server";
import { session } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  if (!await session(req).has('id')) 
      return NextResponse.json({ error: 'Not logged in' });
  let id = await session(req).get('id');
  return NextResponse.json({ id });
}