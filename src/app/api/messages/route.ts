import { getTokenFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import getCurrentProfilePages from "@/lib/get-current-profile.pages";
import { NextResponse } from "next/server";
import { Message } from "postcss";

const MESSAGES_BATTCH_SIZE = 10;

export async function GET(req: any) {
    try {
        let user = await getCurrentProfilePages(req);
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!channelId) return new NextResponse("Bad Request", { status: 400 });

        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATTCH_SIZE,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    },
                    embeds: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }) as any;
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATTCH_SIZE,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    },
                    embeds: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }) as any;
        }

        let nextCursor = null;
        if (messages.length == MESSAGES_BATTCH_SIZE) {
            nextCursor = messages[messages.length - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (error) {
        console.log("[MESSAGE_FETCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
