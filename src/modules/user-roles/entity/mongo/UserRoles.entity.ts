import { Entity, ObjectIdColumn, Column, ManyToOne } from "typeorm";
import { UserRolesAbstract } from "../UserRoles.abstract";
import { UserRolesContract } from "@modules/user-roles/contracts/IUserRoles";
import { RoleMongoEntity } from "@modules/roles/entity/mongo/Role.entity";
import { UserMongoEntity } from "@modules/users/entity/mongo/User.entity";

@Entity("user_role")
export class UserRolesMongoEntity extends UserRolesAbstract {
    @ObjectIdColumn()
    id: string;

    @Column()
    user_id: string;

    @Column()
    role_id: string;

    @ManyToOne(() => UserMongoEntity, user => user.userRoles, { onDelete: 'CASCADE' })
    user: UserMongoEntity;

    @ManyToOne(() => RoleMongoEntity, role => role.userRoles, { onDelete: 'CASCADE' })
    role: RoleMongoEntity;

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