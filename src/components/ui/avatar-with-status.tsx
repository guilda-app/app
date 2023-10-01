import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./avatar";
import { MinusCircle, MoonIcon } from "lucide-react";

const statusIcons = {
    online: <div className="w-3 h-3 bg-green-500 rounded-full absolute z-10 border-2 border-zinc-900" style={{ bottom: '-2px', right: '-2px' }}></div>,
    idle: <MoonIcon className="w-3 h-3 text-yellow-500 rounded-full absolute z-10 border-2 border-zinc-900" style={{ bottom: '-2px', right: '-2px' }} />,
    dnd: <MinusCircle className="w-3 h-3 text-red-500 rounded-full absolute z-10 border-2 border-zinc-900" style={{ bottom: '-2px', right: '-2px' }} />,
} as any;

export default function ({
    src,
    className = "",
    status,
    ...props
}: {
    src: string,
    className?: string,
    status: string
}) {
    return (
        <div className="relative">
            {statusIcons[status] || null}
            <Avatar className={`w-6 h-6 relative ${className}`} {...props}>
                <AvatarImage src={src} alt="Avatar" />
            </Avatar>
        </div>
    );
}
