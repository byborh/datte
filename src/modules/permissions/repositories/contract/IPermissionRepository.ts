import { Permission } from "@modules/permissions/entity/Permission.entity";

export interface IPermissionRepository {
    getPermissionByField(field: string, value: string): Promise<Permission | null>;
    getPermissionById(permissionId: string): Promise<Permission | null>;
    getPermissionByMultipleFields(fields: string[], values: string[]): Promise<Permission | null>
    getPermissions(): Promise<Permission[] | null>;
    createPermission(permission: Permission): Promise<Permission | null>;
    modifyPermission(permission: Permission): Promise<Permission | null>;
    deletePermission(permissionId: string): Promise<boolean>;
}