import { Role } from "@modules/roles/entity/Role.entity";

export interface IRoleRepository {
    getRoleByField(field: string, value: string): Promise<Role | null>;
    getRoleById(roleId: string): Promise<Role | null>;
    getRoles(): Promise<Role[] | null>;
    createRole(role: Role): Promise<Role | null>;
    modifyRole(role: Role): Promise<Role | null>;
    deleteRole(roleId: string): Promise<boolean>;
}