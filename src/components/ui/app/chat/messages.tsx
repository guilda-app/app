"use client";

import ChatWelcome from "@/components/ui/app/chat/welcome";
import { Member } from "@prisma/client";
import { useChatQuery } from "../../../../../hooks/use-chat-query";
import { Skeleton } from "../../skeleton";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import ChatItem, { MessageWithMemberAndProfile } from "./item";
import { useChatSocket } from "../../../../../hooks/use-chat-socket";

export default function({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue
}: {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId",
    paramValue: string
}) {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:message:update`;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });
    useChatSocket({
        queryKey,
        addKey,
        updateKey,
    });

    if (status == "loading") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="animate-spin w-8 h-8 text-zinc-400 my-4" />
                <p className="text-zinc-400 font-bold text-sm">Loading messages...</p>
            </div>
        );
    } else if (status == "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="w-8 h-8 text-red-600 my-4" />
                <p className="text-zinc-400 font-bold text-sm">There was an error loading messages!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 pt-4 flex flex-col py-4 pb-0 mr-2 px-5 overflow-y-auto">
            <div className="flex-1" />
            {!hasNextPage && (
                <ChatWelcome name={name} />
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group: any, i: number) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberAndProfile) => (
                            <ChatItem 
                                message={message} 
                                key={message.id} 
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                currentMember={member}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
