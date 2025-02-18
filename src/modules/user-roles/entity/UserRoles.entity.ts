import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { UserRolesContract } from "../contracts/IUserRoles";
import { User } from "@modules/users/entity/User.entity";
import { Role } from "@modules/roles/entity/Role.entity";

@Entity("user_role")
export class UserRoles implements UserRolesContract {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    user_id: string;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    role_id: string;

    @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'role_id' })
    role: Role;

    constructor(user_id: string, role_id: string) {
        this.user_id = user_id;
        this.role_id = role_id;
    }


    getUser_id(): string | null {return this.user_id;}
    getRole_id(): string | null {return this.role_id;}

    setUser_id(user_id: string): void {this.user_id = user_id;}
    setRole_id(role_id: string): void {this.role_id = role_id;}
}