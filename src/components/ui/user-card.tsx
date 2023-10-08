import { Profile } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import AvatarWithStatus from "./avatar-with-status";
import getBadgesFromUser from "@/lib/badges";
import React, { useEffect } from "react";
import { Badge } from "@/lib/types";
import { ActionTooltip } from "./action-tooltip";

export default function UserCard({
    profile,
    children,
    side = "left"
}: {
    profile: Profile,
    children: React.ReactNode,
    side?: "left" | "right" | "top" | "bottom"
}) {
    const [badges, setBadges] = React.useState<Badge[] | null>([]);
    useEffect(() => {
        getBadgesFromUser(profile).then(setBadges);
    });
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 overflow-hidden rounded-lg border" align="start" side={side}>
                <div className="flex flex-col w-72">
                    <div className="w-full h-24 bg-zinc-900 border-b shadow">

                    </div>
                    <div className="relative px-7">
                        <div className="relative w-[70px] h-[70px]" style={{ transform: "translateY(-35px)" }}>
                            <AvatarWithStatus dotClassName="border-zinc-950" src={profile.imageUri} allowOffline status={profile.status} dotSize="large" className="w-[70px] h-[70px] border-[5px] rounded-full border-zinc-950" />
                        </div>
                        {badges?.length > 0 && (
                            <div className="flex items-center p-2 border rounded-md bg-black absolute right-4 top-[-12px]">
                                {badges.map((badge) => (
                                    <ActionTooltip label={badge.description} side="top">
                                        <div key={badge.type} className="flex flex-row items-center justify-center space-x-1">
                                            <img src={badge.image} className="w-4 h-4" />
                                        </div>
                                    </ActionTooltip>
                                ))}
                            </div>
                        )}
                        <div style={{ transform: "translateY(-25px)" }}>
                            <div className="select-none text-xl font-bold">
                               {profile.name}
                            </div>
                            {profile.statusMessage && (
                                <div className="text-xs font-semibold text-muted-foreground">
                                    {profile.statusMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
