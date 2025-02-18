import express from 'express';
import { AuthTokenController } from './controllers/AuthTokenController';
import { AuthTokenService } from './services/AuthTokenService';
import { AuthTokenRepositoryMySQL } from './repositories/drivers/AuthTokenRepositoryMySQL';
import { AuthTokenRoutes } from './route/AuthTokenRoutes';
import { UserRepositoryMySQL } from '@modules/users/repositories/drivers/UserRepositoryMySQL';
import { UserRolesRepositoryMySQL } from '@modules/user-roles/repositories/drivers/UserRolesRepositoryMySQL';

export const createAuthTokenModule = (): express.Router => {
  const authTokenRepositoryMySQL = new AuthTokenRepositoryMySQL();

  // User / User-Role repositories in AuthToken module
  const userRepositoryMySQL = new UserRepositoryMySQL();
  const userRolesRepositoryMySQL = new UserRolesRepositoryMySQL();

  const authTokenService = new AuthTokenService(authTokenRepositoryMySQL, userRepositoryMySQL, userRolesRepositoryMySQL);
  const authTokenController = new AuthTokenController(authTokenService);

  // Le contrôleur sera injecté dans les routes
  return AuthTokenRoutes(authTokenController);
};
