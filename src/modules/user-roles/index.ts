import express from 'express';
import { UserRolesService } from './services/UserRolesService';
import { UserRolesController } from './controllers/UserRolesController';
import { UserRolesRoutes } from './route/UserRolesRoutes';
import { getDatabase } from '@db/DatabaseClient';
import { getRepository } from '@core/db/databaseGuards';
import { UserRolesRepositorySQL } from './repositories/drivers/UserRolesRepositorySQL';
import { UserRolesRepositoryRedis } from './repositories/drivers/UserRolesRepositoryRedis';
import { IUserRolesRepository } from './repositories/contract/IUserRolesRepository';
import { UserRolesRepositoryMongo } from './repositories/drivers/UserRolesRepositoryMongo';


export const createUserRolesModule = async (): Promise<express.Router> => {
    const myDB = await getDatabase();

    const userRolesRepository = getRepository(myDB, UserRolesRepositorySQL, UserRolesRepositoryRedis, UserRolesRepositoryMongo) as IUserRolesRepository;

    const userRolesService = new UserRolesService(userRolesRepository);
    const userRolesController = new UserRolesController(userRolesService);

    return UserRolesRoutes(userRolesController);
}