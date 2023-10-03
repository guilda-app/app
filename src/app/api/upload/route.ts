import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File;
  const extension = file.name.split('.').pop();
  const id = randomUUID();
  const fileName = `${id}.${extension}`;

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = process.cwd() + "/uploads/" + fileName;
  await writeFile(path, new Uint8Array(buffer))
  console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true, fileName })
} 
