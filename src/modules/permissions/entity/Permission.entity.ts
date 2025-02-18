import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PermissionContract } from "../contracts/IPermission";
import { RolePermissions } from "@modules/role-permissions/entity/RolePermissions.entity";

@Entity("permissions")
export class Permission implements PermissionContract {
    @PrimaryColumn()
    id: string;

    @Column()
    action: string;

    @Column()
    resource: string;

    @Column()
    description: string;

    // Relation One-to-Many avec RolePermission
    @OneToMany(() => RolePermissions, rolePermission => rolePermission.permission, { cascade: ["remove"] })
    rolePermissions: RolePermissions[];

    /*
    ----------------------------------------------------------------------------------
        Add liaisons here with other Entities
        Ex :
            - @OneToMany
                entityName: EntityName
            - @OneToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
    ----------------------------------------------------------------------------------
    */

    constructor(id: string, action: string, resource: string, description: string) {
        this.id = id;
        this.action = action;
        this.resource = resource;
        this.description = description;
    }

    public getId(): string { return this.id; }
    public getAction(): string { return this.action; }
    public getResource(): string { return this.resource; }
    public getDescription(): string { return this.description; }

    public setId(id: string): void { this.id = id; }
    public setAction(action: string): void { this.action = action; }
    public setResource(resource: string): void { this.resource = resource; }
    public setDescription(description: string): void { this.description = description; }
}