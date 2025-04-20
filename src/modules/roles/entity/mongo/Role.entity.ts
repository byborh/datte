import { Column, Entity, ObjectIdColumn, OneToMany } from "typeorm";
import { TRoleName } from "../../contracts/TRoleName";
import { RoleAbstract } from "../Role.abstract";
import { RoleContract } from "@modules/roles/contracts/IRole";
import { UserRolesMongoEntity } from "@modules/user-roles/entity/mongo/UserRoles.entity";

@Entity("roles")
export class RoleMongoEntity extends RoleAbstract {
    @ObjectIdColumn()
    id: string;

    @Column({ length: 50, unique: true })
    name: TRoleName;

    @Column({ nullable: true })
    description: string | null;

    @OneToMany(() => UserRolesMongoEntity, userRole => userRole.role, { cascade: true })
    userRoles: UserRolesMongoEntity[];


    constructor(data?: Partial<RoleContract>) {
        super(data?.id ?? "", data?.name ?? "USER", data?.description ?? null);
        
        this.id = data?.id ?? "";
        this.name = data?.name ?? "USER";
        this.description = data?.description ?? null;
    }
    
    public getId(): string { return this.id }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }

    public setId(id: string): void { this.id = id; }
    public setName(name: TRoleName): void { this.name = name; }
    public setDescription(description: string): void { this.description = description; }
}