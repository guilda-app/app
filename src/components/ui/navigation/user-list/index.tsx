import { ServerMember, getServerMembers } from "@/lib/servers";
import { Member, Server } from "@prisma/client";
import { useEffect, useState } from "react";
import Section from "../section";
import NavigationUser from "./user";
import { useSocket } from "@/components/providers/socket-provider";

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

            socket.on(`server:${serverId}:update`, async (_: Server) => {
                console.log("server update")
                let members = await getServerMembers(serverId);
                if (!members) return;
                setServerMembers(members);
            });
        }
        render();
    }, []);

    const onlineMembers = serverMembers.filter((member) => member.profile.status != "offline");
    const offlineMembers = serverMembers.filter((member) => member.profile.status == "offline");

    return isMounted ? (
        <div className="flex flex-col p-5 w-[300px] z-0 pl-7 pt-6 border-l bg-zinc-950">
            {onlineMembers.length > 0 && (
                <>
                    <Section text={`Online Members - ${onlineMembers.length}`} />
                    {onlineMembers.map((member) => (
                        <NavigationUser key={member.id} user={member} />
                    ))}
                </>
            )}
            {offlineMembers.length > 0 && (
                <>
                    <Section text={`Offline Members - ${offlineMembers.length}`} />
                    {offlineMembers.map((member) => (
                        <NavigationUser key={member.id} user={member} />
                    ))}
                </>
            )}
        </div>
    ) : null;
}
