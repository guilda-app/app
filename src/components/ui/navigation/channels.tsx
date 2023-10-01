import { FullUser } from "@/lib/types";
import { Server } from "@/lib/types";
import { ChannelType } from "@/lib/channel";
import { DoorClosedIcon, HashIcon, Link, Mail, MegaphoneIcon, MoveRight, Plus, PlusCircle, PlusCircleIcon, PlusIcon, Search, Settings, User, UserPlus } from "lucide-react";
import Section from "./section";
import { Separator } from "../separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/members";
import { useModal } from "../../../../hooks/use-modal-store";
import { ActionTooltip } from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import LordIcon from "../lord-icon";

export default function ({
    server,
    user,
}: { server: Server | null, user: FullUser }) {
    if (!server) return null;
    const { onOpen } = useModal();
    const role = server.members?.find((member) => member.profileId === user.profile.id)?.role as MemberRole;

    const isAdmin = role >= MemberRole.admin;
    const isModerator = isAdmin || role === MemberRole.moderator;

    const serverInvites = server.invites;
    const params = useSearchParams();
    const router = useRouter();

    const openServerSettings = (e: any) => {
        e.preventDefault();
        onOpen("serverSettings", {
            server
        });
    }

    return (
        <div className="mt-5">
            <div>
                {isAdmin && (
                    <div onClick={openServerSettings} className="anim-icon mb-1 select-none relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                        <LordIcon target=".anim-icon" icon="hwuyodym" className="mr-3" size={20} />
                        <div className="!p-0 truncate text-sm font-semibold">Server configuration</div>
                    </div>
                )}
                <div className="anim-icon mb-1 relative flex items-center overflow-hidden select-none text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                    <LordIcon target=".anim-icon" icon="xfftupfv" className="mr-3" size={20} />
                    <div className="!p-0 truncate text-sm font-semibold ">Search messages</div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-black px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"><span className="text-xs pt-0.5">⌘</span> + K</kbd>
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="anim-icon mb-3 relative flex items-center select-none overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                        <LordIcon target=".anim-icon" icon="rxufjlal" className="mr-3" size={20} />
                        <div className="!p-0 truncate text-sm font-semibold ">More actions</div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px]">
                    <DropdownMenuLabel>Server actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isModerator && (
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="anim-icon" onClick={(
                                    () => {
                                        onOpen("createChannel", {
                                            profileId: user.profile.id,
                                            server,
                                            onCreated: () => {
                                                console.log("channel created")
                                            }
                                        });
                                    }
                                )}>
                                    <LordIcon target=".anim-icon" icon="hpivxauj" className="mr-2" size={20} />
                                    <span>Create new channel</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="anim-icon">
                            <LordIcon target=".anim-icon" icon="uiakkykh" className="mr-2" size={20} />
                            <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {serverInvites?.map((invite) => (
                                <DropdownMenuItem className="anim-icon" onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.code}`)
                                }}>
                                    <LordIcon target=".anim-icon" icon="wxhtpnnk" className="mr-2" size={20} />
                                    <span>invite with code "{invite.code}"</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="anim-icon">
                                <LordIcon target=".anim-icon" icon="ynwbvguu" className="mr-2" size={20} />
                                <span>Create new invite</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    </DropdownMenuGroup>
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="anim-icon">
                                    <LordIcon target=".anim-icon" icon="kulwmpzs" className="mr-2" size={20} />
                                    <span>Manage members</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    {!isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="anim-icon text-red-500">
                                    <DoorClosedIcon className="mr-2 h-4 w-4" />
                                    <span>Leave server</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="anim-icon text-red-500">
                                    <LordIcon target=".anim-icon" icon="wdqztrtx" className="mr-2" size={20} />
                                    <span>Report server</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
                </DropdownMenu>
                <Separator className="mt-2 mb-2" />
                <Section text="Server channels" className="mt-5" />
                {server.channels?.map((channel) => (
                    <div className="group select-none relative flex items-center overflow-hidden cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1 text-muted-foreground" key={channel.id} onClick={() => {
                        router.push(`/app/server/${server.id}/channel/${channel.id}`);
                    }}>
                        {channel.type == ChannelType.text ? (<HashIcon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-3 w-4 h-4" />) : (<MegaphoneIcon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-3 w-4 h-4" />)}
                        <div className={cn(
                            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                            params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                        )}>{channel.name}</div>
                        {isAdmin && (
                            <ActionTooltip label="Channel settings" side="right">
                                <Settings className="transition-all duration-300 group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 w-4 h-4 hidden opacity-0 group-hover:opacity-100 group-hover:block ml-auto cursor-pointer" />
                            </ActionTooltip>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
