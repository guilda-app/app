import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FullUser, Server } from "@/lib/types";
import { getProfileFromUser, getProfileServerList, getUserFromID } from "./profiles";
import { getIDFromToken, getTokenFromCookies } from "@/lib/auth";
import { useSocket } from "@/components/providers/socket-provider";
import { SERVER_UPDATE } from "./socket";

export function useCurrentUser() {
  const [user, setUser] = useState<FullUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
        let currentUser = await getTokenFromCookies(Cookies);
        if (currentUser) {
            let id = getIDFromToken(currentUser);
            try {
                setUser({
                    user: await getUserFromID(id),
                    profile: await getProfileFromUser(id)
                } as FullUser);
            } catch (error) {
                console.log(error)
                Cookies.remove("currentUser");
                window.location.reload();
            }
        } 
    }
    fetchUser();
  }, []);

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
        async function fetchList() {
            if (user?.profile) {
                let servers = await getProfileServerList(user.profile);
                setList(servers);
                if (socket) {
                    servers.forEach(server => {
                        if ( socket._callbacks[SERVER_UPDATE(server.id)] == undefined ) {
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
                        }
                    });
                }
            }
            setLoadedList(true);
        }
        fetchList();
    }, [user]);

    return { list, refresh, loadedList };
}
