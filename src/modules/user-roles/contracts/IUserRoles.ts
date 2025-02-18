import { Role } from "@modules/roles/entity/Role.entity";
import { User } from "@modules/users/entity/User.entity";

// Interface of the permission
export interface UserRolesContract {
  user_id: string;
  role_id: string;
  user: User;
  role: Role
}