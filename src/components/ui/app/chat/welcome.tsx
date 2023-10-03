import { HashIcon } from "lucide-react";
import { Separator } from "../../separator";

export default function ({ name }: { name: string}) {
    return (
        <div className="space-y-2 px-4 mb-8">
            <div className="h-[75px] w-[75px] rounded-lg bg-zinc-900 border shadow mb-2 flex items-center justify-center">
                <HashIcon className="w-12 h-12 text-white" />
            </div>
            <p className="text-xl md:text-3xl font-bold">
                Welcome to #{name}
            </p>
            <p className="text-zinc-500 text-sm">
                This is the beginning <b>#{name}</b>. Start by sending a message.
            </p>
        </div>
    )
}
