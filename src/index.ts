// src/index.ts
import express from 'express';
import { createUserModule } from './modules/users';
import { createPermissionModule } from './modules/permissions';
import { errorHandler } from '@middlewares/errorHandler';
import { initDatabase } from '@db/AppDataSource';
import { createRoleModule } from '@modules/roles';
import { createUserRolesModule } from '@modules/user-roles';
import { createRolePermissionsModule } from '@modules/role-permissions';
import { createAuthTokenModule } from '@modules/auth-token';

const app = express();
const port = 3000;

// Middleware global
app.use(express.json());

// Create router for prefix : /api/v0.0.1
const apiRouter = express.Router();

// Add module's here
apiRouter.use('/users', createUserModule());
apiRouter.use('/permissions', createPermissionModule());
apiRouter.use('/roles', createRoleModule());
apiRouter.use('/userroles', createUserRolesModule());
apiRouter.use('/rolepermissions', createRolePermissionsModule());
apiRouter.use('/auth', createAuthTokenModule());
// Add other modules HERE

app.use('/api/v0.0.1', apiRouter);

// Middleware global of error
app.use(errorHandler);

// Landing page for the moment
app.get('/', (req, res) => {
  res.send('Welcome to Datte D1 ! \n Version 0.0.1 \n By DatteD1 \n http:localhost:3000/api/v0.0.1/users');
});

// Initialize the db before the database
initDatabase().then(() => {
  // Run the server
  app.listen(port, () => {
    console.log(`📌 Serveur en cours d'exécution sur le port ${port}`);
  });
}).catch ((error) => {
  // Catch errors
  console.error("Error initializing database:", error);
})


