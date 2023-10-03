import { FullUser } from "@/lib/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { SocketIndicator } from "../socket-indicator";
import { useSocket } from "@/components/providers/socket-provider";
import { useEffect } from "react";
import { db } from "@/lib/db";
import { updateProfileInfo } from "@/lib/update-server-info";
import { connectProfile, disconnectProfile, updateProfileStatus } from "@/lib/profiles";
import LordIcon from "../lord-icon";

export default function ({
    user
}: { user: FullUser }) {

    const { isConnected } = useSocket();
    useEffect(() => {
        async function setUserStatus() {
            if (isConnected) {
                await connectProfile(user.profile);
            } else {
                await disconnectProfile(user.profile);
            }
            await updateProfileInfo(user.profile.id);
        }
        setUserStatus();
    }, [isConnected]);

    return (
        <div>
            <Separator className="my-2" />
            <div className="anim-icon flex items-center rounded-sm hover:bg-muted transition-all duration-150 p-2 cursor-pointer">
                <LordIcon target=".anim-icon" icon="hwuyodym" className="w-5 h-5 mr-2" />
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
