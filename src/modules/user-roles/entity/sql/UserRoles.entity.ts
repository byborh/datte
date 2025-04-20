import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserSQLEntity } from "@modules/users/entity/sql/User.entity";
import { RoleSQLEntity } from "@modules/roles/entity/sql/Role.entity";
import { UserRolesAbstract } from "../UserRoles.abstract";
import { UserRolesContract } from "@modules/user-roles/contracts/IUserRoles";

@Entity("user_role")
export class UserRolesSQLEntity extends UserRolesAbstract {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    user_id: string;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    role_id: string;

    @ManyToOne(() => UserSQLEntity, user => user.userRoles, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'user_id' })
    user: UserSQLEntity;

    @ManyToOne(() => RoleSQLEntity, role => role.userRoles, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'role_id' })
    role: RoleSQLEntity;

    constructor(data?: Partial<UserRolesContract>) {
        super(data?.user_id ?? "", data?.role_id ?? "");
        this.user_id = data?.user_id ?? null;
        this.role_id = data?.role_id ?? null;
    }


    getUser_id(): string | null {return this.user_id;}
    getRole_id(): string | null {return this.role_id;}

    setUser_id(user_id: string): void {this.user_id = user_id;}
    setRole_id(role_id: string): void {this.role_id = role_id;}
}