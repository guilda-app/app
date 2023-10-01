import { ServerMember, getServerMember, getServerMembers } from "@/lib/servers";
import { Member, Server } from "@prisma/client";
import { useEffect, useState } from "react";
import Section from "../section";
import NavigationUser from "./user";
import { useSocket } from "@/components/providers/socket-provider";
import { SERVER_MEMBERS_UPDATE } from "@/lib/socket";

export default function ServerUserList({
    serverId,
}: { serverId: string }) {
    
    const [serverMembers, setServerMembers] = useState<ServerMember[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const {socket} = useSocket();
    
    useEffect(() => {
        if (!socket) return;
        async function render() {
            let members = await getServerMembers(serverId);
            if (!members) return;
            setServerMembers(members);
            setIsMounted(true);

            socket.on(SERVER_MEMBERS_UPDATE(serverId), async (_: Server) => {
                console.log("server update")
                let members = await getServerMembers(serverId);
                if (!members) return;
                setServerMembers(members);
            });

            for (let member of members) {
                socket.on(`profile:${member.profile.id}:update`, async (profile: Member) => {
                    console.log("profile update")
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
        <div className="flex flex-col p-5 w-[300px] z-0 pl-7 pt-6 border-l bg-zinc-950">
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
