"use client";
import { useCurrentUser } from '@/lib/authHooks';
import SideNav from './side-nav';

export default function AppLayout() {
    const {user, refresh} = useCurrentUser();

    return user ? (
        <>
            <SideNav user={user} />
        </>
    ) : null;
}
