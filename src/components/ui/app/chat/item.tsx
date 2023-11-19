import { Member, Message, Profile } from "@prisma/client";
import { ClipboardCopy, CrownIcon, Edit2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage } from "../../avatar";
import { ActionTooltip } from "../../action-tooltip";
import { MemberRole } from "@/lib/members";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../dropdown-menu";
import MessageContent from "./message-content";
import { getRoleName } from "@/lib/roles";
import LordIcon from "../../lord-icon";
import UserCard from "../../user-card";
import { useModal } from "../../../../../hooks/use-modal-store";

export type MessageWithMemberAndProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const TIMESTAMP_FORMAT = "d MMM yyyy, HH:mm";
const TIMESTAMP_SMALL = "HH:mm";

export const roleIcons = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
    "owner": <CrownIcon className="w-4 h-4 ml-2 text-yellow-500" />,
}

export default function ({
    message,
    socketUrl,
    socketQuery,
    currentMember,
    previousMessage,
}: { 
    message: MessageWithMemberAndProfile;
    socketUrl: string;
    socketQuery: Record<string, string>;
    currentMember: Member;
    previousMessage?: MessageWithMemberAndProfile;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { onOpen } = useModal();
    
    let roleName: string = getRoleName(currentMember.role);

    const hasBeenUpdated = message.createdAt !== message.updatedAt;
    const isAdmin = currentMember.role >= MemberRole.admin;
    const isModerator = currentMember.role == MemberRole.moderator;
    const isOwner = currentMember.id === message.memberId;
    const canDeleteMessage = !message.deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !message.deleted && isOwner;

    const shouldConnectMessages = previousMessage && (
        previousMessage.memberId === message.memberId &&
        ((new Date(message.createdAt)).getTime() - (new Date(previousMessage.createdAt)).getTime() < 1000 * 60 * 5)
    );

    const deleteMessage = () => {
        onOpen("deleteMessage", {
            message
        });
    }

    const Dropy = (
        <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
            <DropdownMenuTrigger asChild>
                <div className={cn("anim-icon right-3.5 bottom-full absolute",
                    isDropdownOpen ? "flex" : "hidden group-hover:flex",
                )} style={{
                    transform: 'translateY(35%)',
                }}>
                    <ActionTooltip label="More actions" side="top">
                        <div style={{
                            width: '27px',
                            height: '27px',
                        }} className="flex items-center justify-center cursor-pointer rounded-sm mt-2 bg-zinc-900 border ml-2 text-zinc-200 group-hover:text-zinc-500 transition">
                            <LordIcon target=".anim-icon" icon="rxufjlal" size={18} className="m-0" />
                        </div>
                    </ActionTooltip>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" style={{ transform: 'translateX(-40%)' }}>
                {canEditMessage && (
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Edit message</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                )}
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        <span>Copy message ID</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                {canDeleteMessage && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="anim-icon text-red-600" onClick={deleteMessage}>
                                <LordIcon target=".anim-icon" icon="kfzfxczd" className="mr-2" size={20} />
                                <span>Delete message</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className={cn("relative group flex items-start hover:bg-black/5 py-4 px-2 pb-0 transition w-full",
            shouldConnectMessages ? "pt-0 pb-0" : "first-of-type:!mb-2 mt-2")}>
            {!shouldConnectMessages && (
                <div className="relative group flex gap-x-2 items-start w-full py-1 px-2 hover:bg-zinc-950 rounded-md">
                    <div className="cursor-pointer hover:drop-shadow-md transition">
                        <UserCard side="right" profile={message.member.profile}>
                            <Avatar>
                                <AvatarImage src={message.member.profile.imageUri} />
                            </Avatar>
                        </UserCard>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <UserCard side="right" profile={message.member.profile}>
                                    <p className="font-semibold test-sm hover:underline cursor-pointer">
                                        {message.member.profile.name}
                                    </p>
                                </UserCard>
                                <ActionTooltip label={roleName} side="right">
                                    {roleIcons[roleName.toLocaleLowerCase() as keyof typeof roleIcons]}
                                </ActionTooltip> 
                            </div>
                            <span className="text-xs text-zinc-400 ">
                                {format(new Date(message.createdAt), TIMESTAMP_FORMAT)}
                            </span>
                            {hasBeenUpdated &&  !message.deleted && (
                                <ActionTooltip label={format(
                                    new Date(message.updatedAt),
                                    TIMESTAMP_FORMAT
                                )} side="right">
                                    <span className="text-[10px] text-zinc-400 ">
                                        (edited)
                                    </span>
                                </ActionTooltip>
                            )}
                        </div>
                        <div className={cn("text-sm text-zinc-300",
                            message.deleted && "italic && text-zinc-400 text-xs mt-1")}>
                            <MessageContent embeds={(message as any).embeds} message={message} />
                        </div>
                    </div>
                    {Dropy}
                </div>
            )}
            {shouldConnectMessages && (
                <div className="relative group flex items-start w-full px-2 gap-x-2 group py-1 hover:bg-zinc-950 rounded-md">
                    <span className="opacity-0 group-hover:opacity-100 font-bold text-xs text-zinc-400 mt-1 ml-1 mr-[5px]">
                        {format(new Date(message.createdAt), TIMESTAMP_SMALL)}
                    </span>
                    <div className={cn("text-sm text-zinc-300",
                        message.deleted && "italic text-zinc-400 text-xs mt-1")}>
                        <MessageContent embeds={(message as any).embeds} message={message} />
                    </div>
                    {Dropy}
                </div>
            )}
        </div>
    );
}
