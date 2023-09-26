"use client";
import { useUserServerList } from "@/lib/authHooks";
import { FullUser, Server } from "@/lib/types";
import { useModal } from "../../../../hooks/use-modal-store";
import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, PlusCircleIcon, SearchIcon, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import Channels from "./channels";
import UserProfile from "./user-profile";

export default function ({ user }: { user: FullUser }) {
    let { list: servers, refresh, loadedList } = useUserServerList(user);
    let [selectedServer, setSelectedServer] = useState<Server | null>(null);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter()

    const onServerCreated = (server: Server) => {
        refresh();
        setSelectedServer(server);
    }

    const openNewServerDialog = () => {
        onOpen("createServer", {
            profileId: user.profile.id,
            onCreated: onServerCreated,
            defaultServerName: `${user.profile.name}'s server`,
            canClose: servers.length > 0,
        });
    }

    useEffect(() => {
        if (loadedList) {
            let { serverId } = params;
            if (serverId) {
                let foundServer = servers.find((server) => server.id == serverId);
                if (foundServer) {
                    setSelectedServer(foundServer);
                    return;
                }
                window.location.href = "/app";
            } else {
                if (servers.length == 0) {
                    openNewServerDialog();
                } else if (servers.length == 1) {
                    setSelectedServer(servers[0]);
                }
            }
        }
    }, [servers, loadedList]);


    useEffect(() => {
        if (selectedServer) {
            if (params.serverId == selectedServer.id) return;
            router.push(`/app/server/${selectedServer.id}`);
        }
    }, [selectedServer]);

    return loadedList ? (
        <div className="p-5 flex flex-col space-between relative border-r w-[300px] bg-zinc-950 shadow-inner h-full justify-between">
            <div>
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full mt-5"
                        >
                            <Avatar className="mr-3 w-4 h-4">
                                <AvatarImage src={selectedServer?.imageUri} />
                            </Avatar>
                            {selectedServer?.name ?? "Select a server"}
                            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col items-center w-full absolute relative p-1 mt-1 w-[260px]">
                        <div className="flex items-center w-full border-b mb-3">
                            <Label htmlFor="search-servers">
                                <SearchIcon className="h-4 w-4 mx-4 opacity-50" />
                            </Label>
                            <Input placeholder="Search servers..." id="search-servers" className="w-full border-none !ring-0 !outline-none !rounded-none !p-0 !ring-offset-0" />
                        </div>
                        {servers.map((server) => (
                            <div key={server.id} className="mb-1 w-full items-center flex relative rounded-md hover:bg-zinc-900 trnaistion-all duration-150 cursor-pointer py-2 px-3" onClick={() => setSelectedServer(server)}>
                                {server.id == selectedServer?.id && (
                                    <div className="absolute inset-y-0 rounded-br rounded-tr left-0 w-[2px] left-[-3px] bg-white opacity-90"></div>
                                )}
                                <Avatar className="w-5 h-5 bg-zinc-900">
                                    <AvatarImage src={server.imageUri} />
                                </Avatar>
                                <span className="ml-4 text-sm font-semibold overflow-hidden w-full">
                                    {server.name}
                                </span>
                            </div>
                        ))}
                        <Separator className="mt-2" />   
                        <div className="flex rounded-md items-center space-between mt-1 px-2 py-1 hover:bg-zinc-900 w-full trnaistion-all duration-150 cursor-pointer">
                            <Users2 className="h-6 w-6 mr-4 ml-1 opacity-50" />
                            <div className="hover:!bg-none text-sm w-full font-semibold p-0 text-left">
                                Direct messages
                            </div>
                        </div>
                        <div onClick={openNewServerDialog} className="flex rounded-md items-center space-between mt-1 px-2 py-1 hover:bg-zinc-900 w-full trnaistion-all duration-150 cursor-pointer">
                            <PlusCircleIcon className="h-6 w-6 mr-4 ml-1 opacity-50" />
                            <div className="hover:!bg-none text-sm w-full font-semibold p-0 text-left">
                                Create a server
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Channels server={selectedServer} user={user} />
            </div>
            <UserProfile user={user} />
        </div>
    ) : null; // TODO: loading animation
}
