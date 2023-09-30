"use client";
import { Channel } from "@prisma/client";
import { Hash, Pin, PinIcon, PinOffIcon } from "lucide-react";
import { ActionTooltip } from "../../action-tooltip";

export default function ({
    channel
}, { channel: Channel }) {
    return (
        <div className="z-20 bg-zinc-950 w-full border-b shadow-md p-5 flex items-center select-none">
            <Hash className="w-5 h-5 text-muted ml-10" />
            <div className="ml-3">
                <span className="font-semibold text-lg text-muted-foreground font-semibold">
                    {channel.name}
                </span>
            </div>
            <ActionTooltip label="Pinned messages" side="top">
                <PinIcon className="w-5 h-5 text-muted-foreground ml-auto mr-10 rotate-45 cursor-pointer hover:text-white hover:opacity-80" />
            </ActionTooltip>
        </div>
    )
}
