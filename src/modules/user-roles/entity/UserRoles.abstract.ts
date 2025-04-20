import { RoleAbstract } from "@modules/roles/entity/Role.abstract";
import { UserRolesContract } from "../contracts/IUserRoles";
import { UserAbstract } from "@modules/users/entity/User.abstract";


export abstract class UserRolesAbstract implements UserRolesContract {
    user_id: string;
    role_id: string;
    user?: UserAbstract;
    role?: RoleAbstract;

    constructor(user_id: string, role_id: string) {
        this.user_id = user_id;
        this.role_id = role_id;
    }

    getUserId(): string | null {return this.user_id;}
    getRoleId(): string | null {return this.role_id;}

    setUserId(user_id: string): void {this.user_id = user_id;}
    setRoleId(role_id: string): void {this.role_id = role_id;}
}