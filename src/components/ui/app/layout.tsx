"use client";
import { useCurrentUser } from '@/lib/authHooks';
import SideNav from '../navigation/side-nav';

export default function AppLayout({
    children
}: { children: React.ReactNode }) {
    const {user, refresh} = useCurrentUser();

    return user ? (
        <div className='w-full relative h-full overflow-hidden flex'>
            <SideNav user={user} />
            <div className='relative w-[calc(100%-300px)] h-full'>
                {children}
            </div>
        </div>
    ) : null;
}
