import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FullUser } from "@/lib/types";
import { getProfileFromUser, getProfileServerList, getUserFromID } from "./profiles";
import { getIDFromToken, getTokenFromCookies } from "@/lib/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<FullUser | null>(null);

  useEffect(() => {
    async function fetchUser() {
        let currentUser = await getTokenFromCookies(Cookies);
        console.log(currentUser)
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
    const [list, setList ] = useState<any[]>([]);
    const [loadedList, setLoadedList] = useState<boolean>(false);

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

    const refresh = async () => {
        if (user?.profile) {
            let servers = await getProfileServerList(user.profile);
            setList(servers);
        }
    }

    return { list, refresh, loadedList };
}
