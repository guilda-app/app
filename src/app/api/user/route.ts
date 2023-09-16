import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';

async function userRoute(req: NextApiRequest) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    return NextResponse.json({
      email: req.session.user,
      isLoggedIn: true,
    })
  } else {
    return NextResponse.json({
      isLoggedIn: false,
      email: '',
    })
  }
}

export const GET = withIronSessionApiRoute(userRoute, sessionOptions)