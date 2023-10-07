import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./avatar";
import { MinusCircle, MoonIcon } from "lucide-react";

const statusIcons = {
    online: <div className="w-full h-full bg-green-500"></div>,
    idle: <MoonIcon className="w-full h-full text-yellow-500" />,
    dnd: <MinusCircle className="w-full h-full text-red-500" />,
} as any;

export default function ({
    src,
    className = "",
    status,
    dotSize = "small",
    dotClassName = "",
    ...props
}: {
    src: string,
    className?: string,
    status: string,
    dotSize?: "small" | "large",
    dotClassName?: string
}) {
    const offset = dotSize == "small" ? `-2px` : `0px`;
    return (
        <div className="relative">
            <div style={{ bottom: offset, right: offset }} className={cn("z-10 relative rounded-full absolute border-zinc-900 overflow-hidden ", dotClassName, dotSize == "small" ? "w-3 h-3 border-2" : "w-6 h-6 border-[4px]")}>
                {statusIcons[status] || null}
            </div>
            <Avatar className={`w-8 h-8 relative ${className}`} {...props}>
                <AvatarImage src={src} alt="Avatar" />
            </Avatar>
        </div>
    );
}
