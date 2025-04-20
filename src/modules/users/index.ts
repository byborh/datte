import express from 'express';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { UserRepositorySQL } from './repositories/drivers/UserRepositorySQL';
import { userRoutes } from './route/userRoutes';
import { getDatabase } from '@db/DatabaseClient';
import { IUserRepository } from './repositories/contract/IUserRepository';
import { getRepository } from '@core/db/databaseGuards';
import { UserRepositoryRedis } from './repositories/drivers/UserRepositoryRedis';
import { UserRepositoryMongo } from './repositories/drivers/UserRepositoryMongo';

export const createUserModule = async (): Promise<express.Router> => {

  const myDB = await getDatabase();

  const userRepository = getRepository(myDB, UserRepositorySQL, UserRepositoryRedis, UserRepositoryMongo) as IUserRepository;

  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  return userRoutes(userController);
};
