import express from 'express';
import { RolePermissionsRepositoryMySQL } from './repositories/drivers/RolesPermissionRepositoryMySQL';
import { RolePermissionsService } from './services/RolePermissionsService';
import { RolePermissionsController } from './controllers/RolePermissionsController';
import { RolePermissionsRoutes } from './route/RolePermissionsRoutes';

export const createRolePermissionsModule = (): express.Router => {
    const rolePermissionsRepositoryMySQL = new RolePermissionsRepositoryMySQL();
    const rolePermissionsService = new RolePermissionsService(rolePermissionsRepositoryMySQL);
    const rolePermissionsController = new RolePermissionsController(rolePermissionsService);

    return RolePermissionsRoutes(rolePermissionsController);
}