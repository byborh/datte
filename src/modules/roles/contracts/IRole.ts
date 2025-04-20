import { TRoleName } from "./TRoleName";

// Interface of the role
export interface RoleContract {
  id: string;           // ID of the role
  name: TRoleName;      // Ex: 'Admin', 'User', 'Developer'
  description: string;  // Description of the role
}