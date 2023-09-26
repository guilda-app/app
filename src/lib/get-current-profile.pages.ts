"use server";
import { NextApiRequest } from "next/types";
import { getIDFromToken, getTokenFromCookies } from "./auth";
import { getProfileFromUser, getUserFromID } from "./profiles";
import { FullUser } from "./types";

export default async function(request: NextApiRequest, fromPages: boolean = false) {
    let token = await getTokenFromCookies(request.cookies, fromPages);
    if (!token) return null;

    let id = getIDFromToken(token);
    return {
        user: await getUserFromID(id),
        profile: await getProfileFromUser(id)
    } as FullUser;
}
