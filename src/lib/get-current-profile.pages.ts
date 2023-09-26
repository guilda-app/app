import { NextApiRequest } from "next/types";
import { getIDFromToken, getTokenFromCookies } from "./auth";
import { getProfileFromUser, getUserFromID } from "./profiles";
import { FullUser } from "./types";

export default async function(request: NextApiRequest) {
    let token = await getTokenFromCookies(request.cookies, true);
    if (!token) return null;

    let id = getIDFromToken(token);
    return {
        user: await getUserFromID(id),
        profile: await getProfileFromUser(id)
    } as FullUser;
}
