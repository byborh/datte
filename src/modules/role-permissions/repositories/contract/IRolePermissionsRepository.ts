import { RolePermissions } from "@modules/role-permissions/entity/RolePermissions.entity";

export interface IRolePermissionsRepository {
    getRolePermissionsByMultipleFields(fields: string[], values: string[]): Promise<RolePermissions | null>
    getRolePermissions(): Promise<RolePermissions[] | null>;
    createRolePermissions(permission: RolePermissions): Promise<RolePermissions | null>;
}