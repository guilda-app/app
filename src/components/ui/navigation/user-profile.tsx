import { FullUser } from "@/lib/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { SocketIndicator } from "../socket-indicator";
import { useSocket } from "@/components/providers/socket-provider";
import { useEffect } from "react";
import { db } from "@/lib/db";
import { updateProfileInfo } from "@/lib/update-server-info";
import { updateProfileStatus } from "@/lib/profiles";

export default function ({
    user
}: { user: FullUser }) {

    const { isConnected } = useSocket();
    useEffect(() => {
        async function setUserStatus() {
            await updateProfileStatus(user.profile, isConnected ? "online" : "offline");
            await updateProfileInfo(user.profile.id);
        }
        setUserStatus();
    }, [isConnected]);

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
            <SocketIndicator />
        </div>
    )
}
