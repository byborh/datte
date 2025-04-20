// src/index.ts
import express from 'express';
import { createUserModule } from './modules/users';
import { errorHandler } from '@middlewares/errorHandler';
import { createRoleModule } from '@modules/roles';
import { createUserRolesModule } from '@modules/user-roles';
import { createAuthTokenModule } from '@modules/auth-token';
import { createChatAIModule } from '@modules/chat-ai';
import { getDatabase } from '@db/DatabaseClient';

const app = express();
const port = 3000;

// Middleware global
app.use(express.json());

// Landing page for the moment
app.get('/', (req, res) => {
  res.send('Welcome to Datte C1 ! \n Version 1.0.0 \n By Datte - C1 \n http:localhost:3000/api/v0.0.2');
});


async function loadModules() {
  const userModule = await createUserModule();
  const roleModule = await createRoleModule();
  const userRolesModule = await createUserRolesModule();
  const authTokenModule = await createAuthTokenModule();
  const chatAIModule = await createChatAIModule();
  // Add other modules HERE

  return { userModule, roleModule, userRolesModule, authTokenModule, chatAIModule };
}

async function startServer() {
  try {
    await getDatabase();
    console.log("📌 Database connected");

    // Load modules
    const modules = await loadModules();

    // Create router for prefix : /api/v0.0.2
    const apiRouter = express.Router();

    // Add module's here
    apiRouter.use('/users', modules.userModule);
    apiRouter.use('/userroles', modules.userRolesModule);
    apiRouter.use('/auth', modules.authTokenModule);
    apiRouter.use('/roles', modules.roleModule);
    apiRouter.use('/chatai', modules.chatAIModule);
    // Add other load modules HERE

    app.use('/api/v0.0.2', apiRouter);

    // Middleware global of error
    app.use(errorHandler);

    // Run server only after database connection
    app.listen(port, () => {
      console.log(`📌 Serveur en cours d'exécution sur le port ${port}`);
    });

  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// 🚀 Run Datte
startServer();
