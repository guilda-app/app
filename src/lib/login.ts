"use client";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

export const loginUser = async (req: any, email: string) => {
    req.session.user = email;
    await req.session.save();
    return {
        props: {}
    };
};