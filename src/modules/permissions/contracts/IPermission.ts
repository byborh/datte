// Interface of the permission
export interface PermissionContract {
  id: string;           // ID of the permission
  action: string;       // Ex: 'CREATE', 'EDIT', 'DELETE'
  resource: string;     // Ex: 'user', 'message', 'video'
  description?: string; // Description of the permission
}