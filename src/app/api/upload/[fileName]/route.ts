
import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { fileName: string } }) {
    const { fileName } = params;
    const path = process.cwd() + "/uploads/" + fileName;

    const file = await readFile(path);
    const buffer = Buffer.from(file);
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'image/png',
        },
        status: 200,
    });
}   
