
import nextAppSession, {promisifyStore} from 'next-app-session';

declare global {
    var appSession: any
}

interface Session {
    id: string;
}

if (typeof window !== 'undefined')
    (window as any).global = window

export const session = globalThis.appSession || nextAppSession<Session>({
    name: "guilda-app", // The cookie name that will hold sid
    secret: process.env.SECRET_COOKIE_PASSWORD, // Providing a secret will sign the SID before storing it in the cookie, providing extra security
}); 

if (process.env.NODE_ENV === 'development') {
    globalThis.appSession = session;
}
