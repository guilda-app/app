"use server";
import { Profile } from "@prisma/client";
import { db } from "./db";
import { Badge, BadgeType } from "./types";

export default async function getBadgesFromUser(profile: Profile): Promise<Badge[]> {
    let badges = profile.badges.split(",").map((badge) => {
        switch (badge) {
            case BadgeType.Newbee:
                return {
                    type: BadgeType.Newbee,
                    description: "New to the platform",
                    image: "/icons/badges/newbee.png",
                };
            default:
                return null;
        }
    });
    return badges;
}

export async function addBadgeToUser(profile: Profile, badge: BadgeType) {
    let badges = profile.badges.split(",");
    badges.push(badge);
    await db.profile.update({
        where: {
            id: profile.id,
        },
        data: {
            badges: badges.join(","),
        },
    });
}

export async function removeBadgeFromUser(profile: Profile, badge: BadgeType) {
    let badges = profile.badges.split(",");
    badges = badges.filter((b) => b !== badge);
    await db.profile.update({
        where: {
            id: profile.id,
        },
        data: {
            badges: badges.join(","),
        },
    });
}
