"use client";
import { useCurrentUser } from "@/lib/authHooks";
import { getChannelFromId, getServerMember } from "@/lib/servers";
import { Channel, Member } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChannelHeader from "@/components/ui/app/channels/header";
import ChatInput from "@/components/ui/app/chat/chat-input";
import Messages from "@/components/ui/app/chat/messages";
import ServerUserList from "@/components/ui/navigation/user-list";
import updateServerInfo, { updateServerMembers } from "@/lib/update-server-info";

export default function ({
    params
}: { params: { channelId: string, serverId: string }}) {
    const { channelId, serverId } = params;
    const {user, refresh} = useCurrentUser();
    const [isMounted, setIsMounted] = useState(false);

    const [channel, setChannel] = useState<Channel | null>(null);
    const [member, setMember] = useState<Member | null>(null);

    const router = useRouter();
    const query = useSearchParams();

    useEffect(() => {
        async function render() {
            if (!user) return;
            let channel = await getChannelFromId(channelId);
            let member = await getServerMember(serverId, user.profile.id);

            if (!channel || !member) {
                router.push("/app");
            }

            setChannel(channel);
            setMember(member);

            if (query?.get("justJoined")) {
                await updateServerMembers(serverId);
            }

            setIsMounted(true);
        }
        render();
    }, [user]);

    return isMounted ? (
        <div className="w-full h-full relative flex">
            <div className="h-full flex flex-col flex-1">
                <ChannelHeader channel={channel} />
                <Messages 
                    member={member as Member}
                    name={channel?.name as string}
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    chatId={channelId}
                    socketQuery={{
                        channelId: channel?.id as string,
                        serverId: serverId,
                    }}
                    paramKey="channelId"
                    paramValue={channelId}
                />
                <ChatInput 
                    name={channel?.name as string}
                    apiUrl="/api/socket/messages"
                    query={{
                        channelId: channel?.id as string,
                        serverId: serverId,
                    }}
                />
            </div> 
            <ServerUserList serverId={serverId} />
        </div>
    ) : null;
}
