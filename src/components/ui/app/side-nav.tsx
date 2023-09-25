import CreateServerDialog from "@/components/dialogs/create-server";
import { useUserServerList } from "@/lib/authHooks";
import { FullUser } from "@/lib/types";
import { Server } from "@prisma/client";

export default function ({ user }: { user: FullUser }) {
    let { list: servers, refresh, loadedList } = useUserServerList(user);

    const onServerCreated = (server: Server) => {
        refresh();
    }

    return loadedList ? (
        <div className="p-10 border-r w-1/3 bg-zinc-950 shadow-inner h-full">
            <CreateServerDialog profileId={
                user.profile.id
            } onCreated={onServerCreated} defaultServerName={`${user.profile.name}'s server`} openByDefault={servers.length == 0} />
            {servers.map((server) => (
                <div key={server.id} className="mt-5">
                    {server.name}
                </div>
            ))}
        </div>
    ) : null; // TODO: loading animation
}
