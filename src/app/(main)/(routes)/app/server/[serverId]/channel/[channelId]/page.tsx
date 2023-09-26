"use client";
import { useCurrentUser } from "@/lib/authHooks";
import { getChannelFromId, getServerMember } from "@/lib/servers";
import { Channel, Member } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChannelHeader from "@/components/ui/app/channels/header";
import ChatInput from "@/components/ui/app/chat/chat-input";

export default function ({
    params
}: { params: { channelId: string, serverId: string }}) {
    const { channelId, serverId } = params;
    const {user, refresh} = useCurrentUser();
    const [isMounted, setIsMounted] = useState(false);

    const [channel, setChannel] = useState<Channel | null>(null);
    const [member, setMember] = useState<Member | null>(null);

    const router = useRouter();

    useEffect(() => {
        async function render() {
            console.log(user)
            if (!user) return;
            let channel = await getChannelFromId(channelId);
            let member = await getServerMember(serverId, user.profile.id);

            if (!channel || !member) {
                router.push("/app");
            }

            setChannel(channel);
            setMember(member);
            setIsMounted(true);
        }
        render();
    }, [user]);

    return isMounted ? (
        <div className="h-full flex flex-col">
            <ChannelHeader channel={channel} />
            <div className="flex-1">[messages here]</div>
            <ChatInput 
                name={channel?.name as string}
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel?.id as string,
                    serverId: serverId,
                }}
            />
        </div> 
    ) : null;
}