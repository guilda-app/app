import { cn } from "@/lib/utils";
import { MessageEmbed } from "@prisma/client";

function escape(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function guildaMarkdown(content: string): string {
    // *example* -> <i>example</i> | **example** -> <b>example</b> | ...
    content = content.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    content = content.replace(/\*(.*?)\*/g, "<i>$1</i>");
    content = content.replace(/__(.*?)__/g, "<u>$1</u>");
    content = content.replace(/~~(.*?)~~/g, "<s>$1</s>");
    content = content.replace(/`(.*?)`/g, "<code>$1</code>");
    content = content.replace(/\n/g, "<br>");
    // replace links with actual links
    content = content.replace(/(https?:\/\/[^\s]+)/g, "<a class=\"text-blue-400\" href='$1' target='_blank'>$1</a>");
    return content;
}

export default function ({ content, embeds }: { content: string, embeds: MessageEmbed[] }) {
    return (
        <div>
            <div dangerouslySetInnerHTML={
                { __html: guildaMarkdown(escape(content)) }
            }></div>
            {embeds?.map((embed, i) => {
                return (
                    <div key={i} className={cn(`border max-w-lg border-[${embeds}] rounded-lg p-4 mt-2`)}>
                        <div className="flex flex-row items-center">
                            <div className="flex flex-col flex-1">
                                <a className="flex flex-row items-center" href={embed.url}>
                                    <h1 className="text-blue-400 font-bold text-sm">{embed.title}</h1>
                                </a>
                                {embed.description && (
                                    <div className="flex flex-row mt-1 items-center">
                                        <p className="text-zinc-400 font-bold text-xs" dangerouslySetInnerHTML={{ __html: guildaMarkdown(escape(embed.description)) }}></p>
                                    </div>
                                )}
                                {embed.image && (
                                    <div className="flex flex-row mt-3 items-center">
                                        <img className="rounded-lg" src={embed.image} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}