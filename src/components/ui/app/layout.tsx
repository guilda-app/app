"use client";
import { useCurrentUser } from '@/lib/authHooks';
import SideNav from '../navigation/side-nav';

export default function AppLayout() {
    const {user, refresh} = useCurrentUser();

    return user ? (
        <>
            <SideNav user={user} />
        </>
    ) : null;
}
