import { Member, Message, Profile } from "@prisma/client";
import { ChevronDown, CircleEllipsisIcon, ClipboardCopy, CrownIcon, DropletsIcon, Edit2, GripVerticalIcon, LucideShieldEllipsis, MenuIcon, ShieldAlert, ShieldCheck, Trash2Icon } from "lucide-react";
import { Avatar } from "../../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ActionTooltip } from "../../action-tooltip";
import { MemberRole } from "@/lib/members";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../dropdown-menu";
import MessageContent from "./message-content";

export type MessageWithMemberAndProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const TIMESTAMP_FORMAT = "d MMM yyyy, HH:mm";

const roleIcons = {
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
}: { 
    message: MessageWithMemberAndProfile;
    socketUrl: string;
    socketQuery: Record<string, string>;
    currentMember: Member;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    let roleName: string = "";
    switch (message.member.role) {
        case MemberRole.member:
            roleName = "Guest";
            break;
        case MemberRole.moderator:
            roleName = "Moderator";
            break;
        case MemberRole.admin:
            roleName = "Admin";
            break;
        case MemberRole.owner:
            roleName = "Owner";
            break;
    }

    const hasBeenUpdated = message.createdAt !== message.updatedAt;
    const isAdmin = currentMember.role >= MemberRole.admin;
    const isModerator = currentMember.role == MemberRole.moderator;
    const isOwner = currentMember.id === message.memberId;
    const canDeleteMessage = !message.deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !message.deleted && isOwner;

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <Avatar>
                        <AvatarImage src={message.member.profile.imageUri} />
                    </Avatar>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold test-sm hover:underline cursor-pointer">
                                {message.member.profile.name}
                            </p>
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
                    <p className={cn("text-sm text-zinc-300",
                        message.deleted && "italic && text-zinc-400 text-xs mt-1")}>
                        <MessageContent embeds={message.embeds} content={message.content} />
                    </p>
                    {/* TODO: images! */}

                </div>
            </div>
            <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
                <DropdownMenuTrigger asChild>
                    <div className={cn(
                        isDropdownOpen ? "flex" : "hidden group-hover:flex",
                    )}>
                        <ActionTooltip label="More actions" side="top">
                            <ChevronDown className="cursor-pointer w-6 h-6 p-1 rounded-sm bg-zinc-900 border ml-2 text-zinc-200 group-hover:text-zinc-500 transition" />
                        </ActionTooltip>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
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
                                <DropdownMenuItem className="text-red-600">
                                    <Trash2Icon className="mr-2 h-4 w-4" />
                                    <span>Delete message</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
