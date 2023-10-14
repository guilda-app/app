import { ServerMember, getServerFromId, getServerMember, getServerMembers } from "@/lib/servers";
import { Member, Profile, Server } from "@prisma/client";
import { useEffect, useState } from "react";
import Section from "../section";
import NavigationUser from "./user";
import { useSocket } from "@/components/providers/socket-provider";
import { PROFILE_UPDATE, SERVER_MEMBERS_UPDATE } from "@/lib/socket";
import { useUserServer } from "@/lib/authHooks";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "../../avatar";

export default function ServerUserList({
    serverId,
}: { serverId: string }) {
    
    const [serverMembers, setServerMembers] = useState<ServerMember[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const {socket} = useSocket();
    const server = useUserServer(serverId) as Server;
    
    useEffect(() => {
        if (!socket) return;
        async function render() {
            let members = await getServerMembers(serverId);
            if (!members) return;
            setServerMembers(members);
            setIsMounted(true);

            socket.on(SERVER_MEMBERS_UPDATE(serverId), async (_: Server) => {
                let members = await getServerMembers(serverId);
                if (!members) return;
                setServerMembers(members);
            });

            for (let member of members) {
                socket.on(PROFILE_UPDATE(member.profile.id), async (profile: Profile) => {
                    let member = await getServerMember(serverId, profile.id) as ServerMember;
                    if (!member) return;
                    setServerMembers((members) => {
                        let newMembers = [...members];
                        let index = newMembers.findIndex((m) => m.id == member.id);
                        newMembers[index] = member;
                        return newMembers;
                    });
                });
            }
        }
        render();
    }, []);

    let onlineMembers: ServerMember[] = [];
    let offlineMembers: ServerMember[] = [];

    if (isMounted) {
        onlineMembers = serverMembers.filter((member) => member.profile.status != "offline");
        offlineMembers = serverMembers.filter((member) => member.profile.status == "offline");
    }

    return isMounted ? (
        <div className="flex flex-col p-5 w-[335px] z-0 pl-7 select-none pt-6 border-l bg-zinc-950">
            <div className="flex flex-col mt-2">
                <div className="flex items-center">
                    <Avatar className="mr-5">
                        <AvatarImage src={server.imageUri} />
                    </Avatar>
                    <div>
                        <h1 style={{ lineHeight: '1' }} className="text-xl font-bold">{server.name}</h1>
                        <p className="mt-1 text-xs font-bold text-green-400">{serverMembers.length} {serverMembers.length == 1 ? "member" : "members"}</p>
                    </div>
                </div>
                {server.description?.length > 0 && (
                    <p className="text-sm font-semibold text-muted-foreground opacity-80 mt-4">{server.description}</p>
                )}
                <Separator className="my-6" />
            </div>
            {onlineMembers.length > 0 && (
                <div className="mb-5">
                    <Section text={`Online Members - ${onlineMembers.length}`} />
                    {onlineMembers.map((member) => (
                        <NavigationUser key={member.id} user={member} />
                    ))}
                </div>
            )}
            {offlineMembers.length > 0 && (
                <div>
                    <Section text={`Offline Members - ${offlineMembers.length}`} />
                    {offlineMembers.map((member) => (
                        <NavigationUser key={member.id} user={member} />
                    ))}
                </div>
            )}
        </div>
    ) : null;
}
