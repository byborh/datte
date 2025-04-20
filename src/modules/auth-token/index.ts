import express from 'express';
import { AuthTokenController } from './controllers/AuthTokenController';
import { AuthTokenService } from './services/AuthTokenService';
import { AuthTokenRoutes } from './route/AuthTokenRoutes';
import { UserRepositorySQL } from '@modules/users/repositories/drivers/UserRepositorySQL';
import { getDatabase } from '@db/DatabaseClient';
import { UserRolesRepositorySQL } from '@modules/user-roles/repositories/drivers/UserRolesRepositorySQL'
import { getRepository } from '@core/db/databaseGuards';
import { AuthTokenRepositorySQL } from './repositories/drivers/AuthTokenRepositorySQL';
import { AuthTokenRepositoryRedis } from './repositories/drivers/AuthTokenRepositoryRedis';
import { IAuthTokenRepository } from './repositories/contract/IAuthTokenRepository';
import { UserRepositoryRedis } from '@modules/users/repositories/drivers/UserRepositoryRedis';
import { IUserRepository } from '@modules/users/repositories/contract/IUserRepository';
import { UserRolesRepositoryRedis } from '@modules/user-roles/repositories/drivers/UserRolesRepositoryRedis';
import { IUserRolesRepository } from '@modules/user-roles/repositories/contract/IUserRolesRepository';
import { AuthTokenRepositoryMongo } from './repositories/drivers/AuthTokenRepositoryMongo';
import { UserRepositoryMongo } from '@modules/users/repositories/drivers/UserRepositoryMongo';
import { UserRolesRepositoryMongo } from '@modules/user-roles/repositories/drivers/UserRolesRepositoryMongo';

export const createAuthTokenModule = async (): Promise<express.Router> => {
  const myDB = await getDatabase();

  const authTokenRepository = getRepository(myDB, AuthTokenRepositorySQL, AuthTokenRepositoryRedis, AuthTokenRepositoryMongo) as IAuthTokenRepository;
  const userRepository = getRepository(myDB, UserRepositorySQL, UserRepositoryRedis, UserRepositoryMongo) as IUserRepository;
  const userRolesRepository = getRepository(myDB, UserRolesRepositorySQL, UserRolesRepositoryRedis, UserRolesRepositoryMongo) as IUserRolesRepository;

  const authTokenService = new AuthTokenService(authTokenRepository, userRepository, userRolesRepository);
  const authTokenController = new AuthTokenController(authTokenService);

  return AuthTokenRoutes(authTokenController);
};
