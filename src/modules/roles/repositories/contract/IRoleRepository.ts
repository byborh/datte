import { RoleAbstract } from "@modules/roles/entity/Role.abstract";

export interface IRoleRepository {
    getRoleByField(field: string, value: string): Promise<RoleAbstract | null>;
    getRoleById(roleId: string): Promise<RoleAbstract | null>;
    getRoleByName(name: string): Promise<RoleAbstract | null>;
    getRoles(): Promise<RoleAbstract[] | null>;
    createRole(role: RoleAbstract): Promise<RoleAbstract | null>;
    modifyRole(role: RoleAbstract): Promise<RoleAbstract | null>;
    deleteRole(roleId: string): Promise<boolean>;
}