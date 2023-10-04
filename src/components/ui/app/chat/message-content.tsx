import { cn } from "@/lib/utils";
import { MessageEmbed } from "@prisma/client";
import { useState } from "react";

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
    const [imageShouldBeThumbnail, setImageShouldBeThumbnail] = useState(false);

    return (
        <div>
            <div className="font-normal" dangerouslySetInnerHTML={
                { __html: guildaMarkdown(escape(content)) }
            }></div>
            {embeds?.map((embed, i) => {
                return (
                    <div key={i} className={cn(`border max-w-md overflow-hidden border-[${embeds}] rounded-lg mt-2`)}>
                        <div className={cn(imageShouldBeThumbnail ? "flex items-start" : "")}>
                            <div className="flex flex-col flex-1 p-4">
                                <a className="flex flex-row items-center" href={embed.url}>
                                    <h1 className="text-blue-400 font-bold text-sm">{embed.title}</h1>
                                </a>
                                {embed.description && (
                                    <div className="flex flex-row mt-1 items-center">
                                        <p className="text-zinc-400 font-semibold text-xs" dangerouslySetInnerHTML={{ __html: guildaMarkdown(escape(embed.description)) }}></p>
                                    </div>
                                )}
                            </div>
                            {(embed.image && imageShouldBeThumbnail) && (
                                <div className="flex flex-row overflow-hidden max-w-[70px] w-fit ml-1 mr-4 my-4 rounded-lg items-center">
                                    <img src={embed.image} />
                                </div>
                            )}
                            {(embed.image && !imageShouldBeThumbnail) && (
                                <div className="flex flex-row overflow-hidden w-fit mx-4 mb-4 rounded-lg items-center">
                                    <img onLoad={(e) => {
                                        if (e.currentTarget.width < 350) {
                                            setImageShouldBeThumbnail(true);
                                        }
                                    }} src={embed.image} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}