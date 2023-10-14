import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./avatar";
import { MinusCircle, MoonIcon } from "lucide-react";
import { ActionTooltip } from "./action-tooltip";

const statusIcons = {
    online: <div className="w-full h-full bg-green-500"></div>,
    idle: <MoonIcon className="w-full h-full text-yellow-500" />,
    dnd: <MinusCircle className="w-full h-full text-red-500" />,
    offline: <div className="w-full h-full bg-zinc-900 border-2 border-gray-600 rounded-full"></div>,
} as any;

export default function ({
    src,
    className = "",
    status,
    dotSize = "small",
    dotClassName = "",
    allowOffline = false,
    ...props
}: {
    src: string,
    className?: string,
    status: string,
    dotSize?: "small" | "large",
    dotClassName?: string,
    allowOffline?: boolean
}) {
    const offset = dotSize == "small" ? `-2px` : `0px`;
    const hidden = !allowOffline && status == "offline";
    return (
        <div className="relative">
            <div style={{ bottom: offset, right: offset }} className={cn("z-10 relative rounded-full absolute overflow-hidden ", !hidden ? "border-zinc-900" : "!border-0", dotClassName, dotSize == "small" ? "w-3 h-3 border-2" : "w-6 h-6 border-[4px]")}>
                {hidden ? null : (
                    <ActionTooltip label={status} side="top">
                        {statusIcons[status] || null}
                    </ActionTooltip>
                )}
            </div>
            <Avatar className={`w-8 h-8 relative ${className}`} {...props}>
                <AvatarImage src={src} alt="Avatar" />
            </Avatar>
        </div>
    );
}
