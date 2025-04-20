import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserRolesSQLEntity } from "@modules/user-roles/entity/sql/UserRoles.entity";
import { TRoleName } from "../../contracts/TRoleName";
import { RoleAbstract } from "../Role.abstract";
import { RoleContract } from "@modules/roles/contracts/IRole";

@Entity("roles")
export class RoleSQLEntity  extends RoleAbstract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ length: 50, unique: true })
    name: TRoleName;

    @Column({ type: "text", nullable: true })
    description: string | null;

    @OneToMany(() => UserRolesSQLEntity, userRole => userRole.role, { cascade: true })
    userRoles: UserRolesSQLEntity[];


    constructor(data?: Partial<RoleContract>) {
        super(data?.id ?? "", data?.name ?? "USER", data?.description ?? null);
        
        this.id = data?.id ?? "";
        this.name = data?.name ?? "USER";
        this.description = data?.description ?? null;
    }
    
    
    

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }

    public setId(id: string): void { this.id = id; }
    public setName(name: TRoleName): void { this.name = name; }
    public setDescription(description: string): void { this.description = description; }
}