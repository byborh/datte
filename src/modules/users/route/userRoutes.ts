import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import { validateAttributeMiddleware } from '@middlewares/validateAttributeMiddleware';
import { lengthRequirementMiddleware } from '@middlewares/lengthRequirementMiddleware';

export const userRoutes = (userController: UserController): express.Router => {
  const router = express.Router();

  router.get('/:id', 
    // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
    validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
    (req: Request, res: Response, next: NextFunction) => userController.getUserById(req, res, next)
  );

  router.get('/',
    // authMiddleware(['ADMIN', 'MANAGER']),
    (req: Request, res: Response, next: NextFunction) => userController.getAllUsers(req, res, next)
  );

  router.post('/',
    validateAttributeMiddleware('body', 'email', 'Email missing or invalid in request body'),
    validateAttributeMiddleware('body', 'password', 'Password missing or invalid in request body'),
    lengthRequirementMiddleware(8, 'password'),
    lengthRequirementMiddleware(3, 'email'),
    (req: Request, res: Response, next: NextFunction) => userController.createUser(req, res, next)
  );

  router.patch('/:id',
    // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
    validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
    (req: Request, res: Response, next: NextFunction) => userController.modifyUser(req, res, next)
  );

  router.delete('/:id',
    // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
    validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
    (req: Request, res: Response, next: NextFunction) => userController.deleteUser(req, res, next)
  );

  return router;
};
