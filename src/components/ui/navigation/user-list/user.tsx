import { ServerMember } from "@/lib/servers";
import { Avatar, AvatarImage } from "../../avatar";
import { cn } from "@/lib/utils";
import AvatarWithStatus from "../../avatar-with-status";
import { ActionTooltip } from "../../action-tooltip";
import { roleIcons } from "../../app/chat/item";
import { getRoleName } from "@/lib/roles";
import UserCard from "../../user-card";

export default function NavigationUser({ user }: {
    user: ServerMember
}) {
    const roleName = getRoleName(user.role);
    return (
        <UserCard profile={user.profile}>
            <div className={cn("mb-1 select-none relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 p-2 pr-3 my-1", user.profile.status == "offline" ? "opacity-60" : "")}>
                <AvatarWithStatus src={user.profile.imageUri} status={user.profile.status} />
                <div className="ml-3 flex flex-col">
                    <span className="font-semibold text-sm text-white capitalize"> 
                        {user.profile.name}
                    </span>
                    {user.profile.statusMessage && (
                        <span className="text-xs font-semibold text-muted-foreground">
                            {user.profile.statusMessage}
                        </span>
                    )}
                </div>
                <ActionTooltip label={roleName} side="right">
                    <div className="ml-auto">
                        {roleIcons[roleName.toLocaleLowerCase() as keyof typeof roleIcons]}
                    </div>
                </ActionTooltip> 
            </div>
        </UserCard>
    )
}
