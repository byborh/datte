import express from 'express';
import { RoleController } from './controllers/RoleController';
import { RoleService } from './services/RoleService';
import { roleRoutes } from './route/RoleRoutes';
import { RoleRepositoryMySQL } from './repositories/drivers/RoleRepositoryMySQL';

export const createRoleModule = (): express.Router => {
  const roleRepositoryMySQL = new RoleRepositoryMySQL();
  const roleService = new RoleService(roleRepositoryMySQL);
  const roleController = new RoleController(roleService);

  // Le contrôleur sera injecté dans les routes
  return roleRoutes(roleController);
};
