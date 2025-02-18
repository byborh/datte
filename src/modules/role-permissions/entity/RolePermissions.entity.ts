import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { RolePermissionsContract } from "../contracts/IRolePermissions";
import { Role } from "@modules/roles/entity/Role.entity";
import { Permission } from "@modules/permissions/entity/Permission.entity";

@Entity("role_permission")
export class RolePermissions implements RolePermissionsContract {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    role_id: string;

    @PrimaryColumn({ type: 'varchar', length: 255 })
    permission_id: string;

    @ManyToOne(() => Role, role => role.rolePermissions, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, permission => permission.rolePermissions, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }) 
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    constructor(role_id: string, permission_id: string) {
        this.role_id = role_id;
        this.permission_id = permission_id;
    }


    getPermission_id(): string | null {return this.permission_id;}
    getRole_id(): string | null {return this.role_id;}

    setPermission_id(permission_id: string): void {this.permission_id = permission_id;}
    setRole_id(role_id: string): void {this.role_id = role_id;}
}