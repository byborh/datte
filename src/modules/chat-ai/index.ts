import express from 'express';
import { ChatAIController } from './controllers/ChatAIController';
import { ChatAIService } from './services/ChatAIService';
import { ChatAIRepositorySQL } from './repositories/drivers/ChatAIRepositorySQL';
import { ChatAIRoutes } from './route/ChatAIRoutes';
import { getDatabase } from '@db/DatabaseClient';
import { IChatAIRepository } from './repositories/contract/IChatAIRepository';
import { ChatAIRepositoryRedis } from './repositories/drivers/ChatAIRepositoryRedis';
import { getRepository } from '@core/db/databaseGuards';
import { ChatAIRepositoryMongo } from './repositories/drivers/ChatAIRepositoryMongo';

export const createChatAIModule = async (): Promise<express.Router> => {
  const myDB = await getDatabase();

  const chatAIRepository = getRepository(myDB, ChatAIRepositorySQL, ChatAIRepositoryRedis, ChatAIRepositoryMongo) as IChatAIRepository;

  const chatAIService = new ChatAIService(chatAIRepository);
  const chatAIController = new ChatAIController(chatAIService);

  // Le contrôleur sera injecté dans les routes
  return ChatAIRoutes(chatAIController);
};
