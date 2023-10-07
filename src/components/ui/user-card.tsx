import { Profile } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import AvatarWithStatus from "./avatar-with-status";

export default function UserCard({
    profile,
    children,
    side = "left"
}: {
    profile: Profile,
    children: React.ReactNode,
    side?: "left" | "right" | "top" | "bottom"
}) {
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
                            <AvatarWithStatus dotClassName="border-zinc-950" src={profile.imageUri} status={profile.status} dotSize="large" className="w-[70px] h-[70px] border-[5px] rounded-full border-zinc-950" />
                        </div>
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
