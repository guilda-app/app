import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FullUser, Profile, Server } from "@/lib/types";
import { getProfileFromUser, getProfileServerList, getUserFromID } from "./profiles";
import { getIDFromToken, getTokenFromCookies } from "@/lib/auth";
import { useSocket } from "@/components/providers/socket-provider";
import { PROFILE_UPDATE, SERVER_UPDATE } from "./socket";
import { getServerFromId } from "./servers";

export function useCurrentUser() {
  const [user, setUser] = useState<FullUser | null>(null);
  const {socket} = useSocket();

  const refresh = async () => {
    let currentUser = await getTokenFromCookies(Cookies);
    if (currentUser) {
        let id = getIDFromToken(currentUser);
        setUser({
            user: await getUserFromID(id),
            profile: await getProfileFromUser(id)
        } as FullUser);
    } 
  }

  useEffect(() => {
    async function fetchUser() {
        let currentUser = await getTokenFromCookies(Cookies);
        if (currentUser) {
            let id = getIDFromToken(currentUser);
            try {
                const profile = await getProfileFromUser(id);
                setUser({
                    user: await getUserFromID(id),
                    profile
                } as FullUser);
                socket?.on(PROFILE_UPDATE(profile.id), (profile: Profile) => {
                    setUser((current: any) => {return {
                        user: current?.user,
                        profile
                    }});
                });
            } catch (error) {
                console.log(error)
                Cookies.remove("currentUser");
                window.location.reload();
            }
        } 
    }
    fetchUser();
  }, []);

  return { user, refresh };
};

export function useUserServerList(user: FullUser | null) {
    const [list, setList ] = useState<Server[]>([]);
    const [loadedList, setLoadedList] = useState<boolean>(false);
    const { socket } = useSocket();

    const refresh = async () => {
        if (user?.profile) {
            let servers = await getProfileServerList(user.profile);
            setList(servers);
        }
    }

    useEffect(() => {
        if (socket) {
            list.forEach(server => {
                socket.on(SERVER_UPDATE(server.id), (server: Server) => {
                    setList(oldList => {
                        let newList = oldList.map(oldServer => {
                            if (oldServer.id === server.id) {
                                return server;
                            }
                            return oldServer;
                        });
                        return newList;
                    });
                });
            });
        }
    }, [socket, list]);

    useEffect(() => {
        async function fetchList() {
            if (user?.profile) {
                let servers = await getProfileServerList(user.profile);
                setList(servers);
            }
            setLoadedList(true);
        }
        fetchList();
    }, [user]);

    return { list, refresh, loadedList };
}

export function useUserServer(serverId: string) {
    const [server, setServer] = useState<Server | null>(null);

    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on(SERVER_UPDATE(serverId), (server: Server) => {
                setServer(server);
            });
        }
    }, [socket, serverId]);

    useEffect(() => {
        async function fetchServer() {
            let server = await getServerFromId(serverId);
            if (!server) return;
            setServer(server);
        }
        fetchServer();
    }, []);

    return server;
}
