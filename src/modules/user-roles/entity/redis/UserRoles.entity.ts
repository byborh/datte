import { UserRolesContract } from "@modules/user-roles/contracts/IUserRoles";
import { UserRolesAbstract } from "../UserRoles.abstract";

export class UserRolesRedisEntity extends UserRolesAbstract {
    user_id: string;
    role_id: string;

    constructor(data: Partial<UserRolesContract>) {
        super(data.user_id, data.role_id);
        this.user_id = data.user_id;
        this.role_id = data.role_id;
    }

    getUser_id(): string | null {return this.user_id;}
    getRole_id(): string | null {return this.role_id;}

    setUser_id(user_id: string): void {this.user_id = user_id;}
    setRole_id(role_id: string): void {this.role_id = role_id;}
}