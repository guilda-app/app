import { sessionOptions } from "@/lib/session"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { id } = await req.body
  
    req.session.user = {id};
    req.session.save();
    return NextResponse.json({
        isLoggedIn: true,
        id,
    });
}
  
export const POST = withIronSessionApiRoute(loginRoute, sessionOptions)