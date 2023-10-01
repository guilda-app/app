import { MemberRole } from "./members";

export function getRoleName(role: MemberRole) {
    let roleName: string = "";
    switch (role) {
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
    return roleName;
}
