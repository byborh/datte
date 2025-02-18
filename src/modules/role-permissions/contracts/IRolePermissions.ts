import { Permission } from "@modules/permissions/entity/Permission.entity";
import { Role } from "@modules/roles/entity/Role.entity";

// Interface of the permission
export interface RolePermissionsContract {
  role_id: string;
  permission_id: string;
  role: Role;
  permission: Permission;
}