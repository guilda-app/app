import { FullUser } from "@/lib/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

export default function ({
    user
}: { user: FullUser }) {
    return (
        <div>
            <Separator className="my-2" />
            <div className="flex items-center rounded-sm hover:bg-muted transition-all duration-150 p-2 cursor-pointer">
                <Settings className="w-5 h-5" />
                <div className="ml-3">
                    <span className="font-semibold text-sm text-muted-foreground">
                        Settings
                    </span>
                </div>
            </div>
            <div className="flex items-center rounded-sm hover:bg-muted transition-all duration-150 p-2 cursor-pointer">
                <Avatar className="w-5 h-5">
                    <AvatarImage src={user.profile.imageUri} alt={user.profile.name} />
                </Avatar>
                <div className="ml-3">
                    <span className="font-semibold text-sm text-muted-foreground capitalize">
                        {user.profile.name}
                    </span>
                </div>
            </div>
        </div>
    )
}
