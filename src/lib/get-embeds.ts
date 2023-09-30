import { MessageEmbed } from "@prisma/client";
import ogs from "open-graph-scraper";

export default async function (message: string) {
    // detect all links
    const linkRegex = /https?:\/\/[^\s]+/g;
    const links = message.match(linkRegex);

    let embeds: MessageEmbed[] = [];

    if (!links) return embeds;
    for (const link of links) {
        // check if link is an image
        const imageRegex = /https?:\/\/[^\s]+\.(png|jpg|jpeg|gif)/g;
        const isImage = imageRegex.test(link);

        if (isImage) {
            throw new Error("Images are not supported yet");
        } else {
            let response = await fetch(link);
            let data = await response.text();

            if (response.headers.get("content-type")?.startsWith("text/html")) {
                let {result} = await ogs({
                    html: data,
                });

                if (result.ogTitle) {
                    embeds.push({
                        title: result.ogTitle,
                        description: result.ogDescription,
                        image: (result.ogImage?.length as any > 0) ? (result.ogImage as any)[0].url : undefined,
                        url: link,
                        color: '#ffffff',
                    } as MessageEmbed);
                }
            } else {
                continue;
            }
        }
    }

    return embeds;
}
