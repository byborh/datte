import express from 'express';
import { RoleController } from './controllers/RoleController';
import { RoleService } from './services/RoleService';
import { roleRoutes } from './route/RoleRoutes';
import { RoleRepositorySQL } from './repositories/drivers/RoleRepositorySQL';
import { getDatabase } from '@db/DatabaseClient';
import { RoleRepositoryRedis } from './repositories/drivers/RoleRepostoryRedis';
import { getRepository } from '@core/db/databaseGuards';
import { IRoleRepository } from './repositories/contract/IRoleRepository';
import { RoleRepositoryMongo } from './repositories/drivers/RoleRepositoryMongo';

export const createRoleModule = async (): Promise<express.Router> => {
  const myDB = await getDatabase();

  const roleRepository = getRepository(myDB, RoleRepositorySQL, RoleRepositoryRedis, RoleRepositoryMongo) as IRoleRepository;
  
  const roleService = new RoleService(roleRepository);
  const roleController = new RoleController(roleService);

  return roleRoutes(roleController);
};
