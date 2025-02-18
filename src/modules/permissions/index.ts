import express from 'express';
import { PermissionService } from './services/PermissionService';
import { PermissionController } from './controllers/PermissionController';
import { permissionRoutes } from './route/PermissionRoutes';
import { PermissionRepositoryMySQL } from './repositories/drivers/PermissionRepositoryMySQL';


export const createPermissionModule = (): express.Router => {
    const permissionRepositoryMySQL = new PermissionRepositoryMySQL();
    const permissionService = new PermissionService(permissionRepositoryMySQL);
    const permissionController = new PermissionController(permissionService);

    return permissionRoutes(permissionController);
}