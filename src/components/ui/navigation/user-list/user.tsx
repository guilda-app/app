import { ServerMember } from "@/lib/servers";
import { Avatar } from "../../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function NavigationUser({ user }: {
    user: ServerMember
}) {
    return (
        <div className="mb-1 select-none relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
            <Avatar className="w-5 h-5">
                <AvatarImage src={user.profile.imageUri} alt={user.profile.name} />
            </Avatar>
            <div className="ml-3">
                <span className="font-semibold text-sm text-muted-foreground capitalize"> 
                    {user.profile.name}
                </span>
                {user.profile.statusMessage && (
                    <span className="text-xs text-muted-foreground ml-1">
                        {user.profile.statusMessage}
                    </span>
                )}
            </div>
        </div>
    )
}
