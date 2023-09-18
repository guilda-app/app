import fetchClient from "@/lib/fetch-client";
import { jwt } from "@/lib/utils";
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE!) || 1209600,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: {
          label: "ID",
          type: "identifier",
        },
      },
      async authorize(credentials) {
        try {
          const response = await fetchClient({
            method: "POST",
            url: process.env.BASE_URL + "/api/auth/login",
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw response;
          }

          const data: { user: User; access_token: string } = await response.json();

          if (!data?.access_token) {
            throw response;
          }

          return { ...data.user, accessToken: data?.access_token };
        } catch (error) {
          if (error instanceof Response) {
            return null;
          }

          throw new Error("An error has occurred during login request");
      }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        if (session.type === "MANUAL") {
          const response = await fetchClient({
            url: process.env.BASE_URL + "/api/user",
            token: token.accessToken as string,
          });
          const user = await response.json();

          return { ...token, ...user };
        }

        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      const { exp: accessTokenExpires } = jwt.decode(token.accessToken as string);

      if (!accessTokenExpires) {
        return token;
      }

      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

      if (accessTokenHasExpired) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        throw new Error("Refresh token has expired");
      }

      (session as any).accessToken = token.accessToken;
      (session as any).user.id = token.id || "";

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      await fetchClient({
        method: "POST",
        url: process.env.BASE_URL + "/api/logout",
        token: token.accessToken as string,
      });
    },
  },
};

async function refreshAccessToken(token: JWT) {
    try {
      const response = await fetchClient({
        method: "POST",
        url: process.env.BASE_URL + "/api/refresh",
        token: token.accessToken as string,
      });
  
      if (!response.ok) throw response;
  
      const refreshedAccessToken: { access_token: string } = await response.json();
      const { exp } = jwt.decode(refreshedAccessToken.access_token);
  
      return {
        ...token,
        accessToken: refreshedAccessToken.access_token,
        exp,
      };
    } catch (error) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  }
