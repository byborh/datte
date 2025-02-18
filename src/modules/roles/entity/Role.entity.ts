import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { RoleContract } from "../contracts/IRole";
import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { RolePermissions } from "@modules/role-permissions/entity/RolePermissions.entity";
import { TRoleName } from "../contracts/TRoleName";

@Entity("roles")
export class Role implements RoleContract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ length: 50, unique: true })
    name: TRoleName;

    @Column({ type: "text", nullable: true })
    description: string | null;

    @OneToMany(() => UserRoles, userRole => userRole.role, { cascade: true })
    userRoles: UserRoles[];

    // Relation One-to-Many avec RolePermission
    @OneToMany(() => RolePermissions, rolePermission => rolePermission.role, { cascade: ["remove"] })
    rolePermissions: RolePermissions[];


    constructor(id: string, name: TRoleName, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }

    public setId(id: string): void { this.id = id; }
    public setName(name: TRoleName): void { this.name = name; }
    public setDescription(description: string): void { this.description = description; }
}