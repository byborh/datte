import { RoleAbstract } from "@modules/roles/entity/Role.abstract";
import {  } from "@modules/roles/entity/sql/Role.entity";
import { UserAbstract } from "@modules/users/entity/User.abstract";

// Interface of the user roles
export interface UserRolesContract {
  user_id: string;
  role_id: string;
  user?: UserAbstract;
  role?: RoleAbstract
}