import express from 'express';
import { UserRolesService } from './services/UserRolesService';
import { UserRolesController } from './controllers/UserRolesController';
import { UserRolesRepositoryMySQL } from './repositories/drivers/UserRolesRepositoryMySQL';
import { UserRolesRoutes } from './route/UserRolesRoutes';


export const createUserRolesModule = (): express.Router => {
    const userRolesRepositoryMySQL = new UserRolesRepositoryMySQL();
    const userRolesService = new UserRolesService(userRolesRepositoryMySQL);
    const userRolesController = new UserRolesController(userRolesService);

    return UserRolesRoutes(userRolesController);
}