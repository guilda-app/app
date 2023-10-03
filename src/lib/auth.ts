import Cookies from "js-cookie";
import { parse as parseCookies } from "cookie";
import jwt from "jsonwebtoken";

type UserDetails = {
    id: string; // we just need the user id to get the profile
}

export async function login(user: UserDetails) {
    const token = jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET, {
        expiresIn: "360d",
    });
    
    Cookies.set("currentUser", JSON.stringify({ accessToken: token }));
}

export async function logout() {
    Cookies.remove("currentUser");
}

export async function getTokenFromCookies(cookies: any, fromPages: boolean = false, fromSocket: boolean = false) {
    let token = null as string | null;
    try {
        if (fromPages) {
            token = JSON.parse(cookies["currentUser"])["accessToken"];
        } else if (fromSocket) {
            token = JSON.parse(parseCookies(cookies)["currentUser"])["accessToken"];   
        } else if (cookies.get("currentUser")?.value) {
            token = JSON.parse(cookies.get("currentUser")?.value)["accessToken"];;
        } else {
            token = JSON.parse(cookies.get("currentUser"))["accessToken"];
        }
    } catch(e) {
        if (false) {
            console.error("[FETCH_TOKEN]", `(pages: ${fromPages})`, e)
        }
    }
    return token;
}

export function getIDFromToken(token: string) {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    return decoded.id;
}
