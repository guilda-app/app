"use client";
import { Channel } from "@prisma/client";
import { Hash, Pin, PinIcon, PinOffIcon, SlashIcon } from "lucide-react";
import { ActionTooltip } from "../../action-tooltip";
import { useUserServer } from "@/lib/authHooks";
import { Avatar } from "../../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function ({
    channel,
    serverId,
}, { channel: Channel, serverId: string }) {
    const server = useUserServer(serverId);

    return (
        <div className="z-20 bg-zinc-950 w-full border-b shadow-md p-5 flex items-center select-none">
            <Hash className="w-5 h-5 text-muted ml-10" />
            <div className="ml-3 flex items-center">
                <ActionTooltip label={server?.name || ""} side="bottom">
                    <Avatar className="w-7 h-7">
                        <AvatarImage src={server?.imageUri} />
                    </Avatar>
                </ActionTooltip>
                <span className="text-2xl font-semibold mx-3">
                    /
                </span>
                <ActionTooltip label={`#${channel.name} inside \`${server?.name}\``} side="bottom">
                    <span className="font-semibold text-lg text-muted-foreground font-semibold">
                        {channel.name}
                    </span>
                </ActionTooltip>
            </div>
            <ActionTooltip label="Pinned messages" side="top">
                <PinIcon className="w-5 h-5 text-muted-foreground ml-auto mr-10 rotate-45 cursor-pointer hover:text-white hover:opacity-80" />
            </ActionTooltip>
        </div>
    )
}
