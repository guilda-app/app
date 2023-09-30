"use client";
import { getInviteFromCode, getServerFromId, joinServerFromInvite } from "@/lib/servers";
import { Invite, Server } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/authHooks";
import updateServerInfo from "@/lib/update-server-info";
import { Icons } from "@/components/icons";
import { DoorOpenIcon } from "lucide-react";

export default function ({
    params
}: { params: { inviteCode: string }}) {
    const [invite, setInvite] = useState<Invite | null>(null);
    const [server, setServer] = useState<Server | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {user} = useCurrentUser();
    const {inviteCode} = params;
    useEffect(() => {
        async function render() {
            let invite = await getInviteFromCode(inviteCode);
            if (invite) {
                let server = await getServerFromId(invite.serverId);
                if (!server) {
                    window.location.href = "/app";
                }
                setServer(server);
            }
            setInvite(invite);
            setIsMounted(true);
        }
        render();
    });

    const joinServer = async (e: any) => {
        setIsLoading(true);
        e.preventDefault();
        if (!invite) return;
        if (!user) return;
        
        await joinServerFromInvite(invite, user.profile);
        window.location.href = `/app/server/${invite.serverId}?justJoined=1`;
    }

    return isMounted ? invite ? (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="md:w-1/2 lg:w-1/4 text-center">
                <CardHeader>
                    <Avatar className="mx-auto mb-2">
                        <AvatarImage src={server?.imageUri} />
                    </Avatar>
                    <CardTitle> {server?.name} </CardTitle>
                    <CardDescription>Someone invited you to join their server!</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={joinServer} className="w-full">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) || (
                            <DoorOpenIcon className="mr-2 h-4 w-4" />
                        )}
                        Start a new adventure!
                    </Button>
                </CardFooter>
            </Card>
        </div>
    ) : (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="md:w-1/2 lg:w-1/4 text-center">
                <CardHeader>
                    <CardTitle>Whoops!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The invite you're trying to use is invalid or expired.</p>
                </CardContent>
                <CardFooter>
                    <Link href="/app" className="w-full">
                        <Button className="w-full">Go back home :(</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    ) : null; // TODO: loading animation
}
