import express, { Request, Response,NextFunction } from 'express'
import { UserRolesController } from '../controllers/UserRolesController';
import { validateAttributeMiddleware } from '@middlewares/validateAttributeMiddleware';

export const UserRolesRoutes = (userRoutesController: UserRolesController): express.Router => {
    const router = express.Router();

    router.get('/:user_id/:role_id',
        // authMiddleware(['ADMIN', 'MANAGER']),
        validateAttributeMiddleware('params', 'user_id', 'User_id missing or invalid in request params.'),
        validateAttributeMiddleware('params', 'role_id', 'Role_id missing or invalid in request params.'),
        (req: Request, res: Response, next: NextFunction) => userRoutesController.getUserRolesById(req, res, next)    
    )

    router.get('/',
        // authMiddleware(['ADMIN', 'MANAGER']),
        (req: Request, res: Response, next: NextFunction) => userRoutesController.getAllUserRoles(req, res, next)
    );

    router.post('/',
        // authMiddleware(['ADMIN', 'MANAGER']),
        validateAttributeMiddleware('body', 'user_id', 'User_id missing or invalid in request body'),
        validateAttributeMiddleware('body', 'role_id', 'Role_id missing or invalid in request body'),
        (req: Request, res: Response, next: NextFunction) => userRoutesController.createUserRoles(req, res, next)
    );

    router.delete('/:user_id/:role_id',
        // authMiddleware(['ADMIN', 'MANAGER']),
        validateAttributeMiddleware('params', 'user_id', 'User_id missing or invalid in request params.'),
        validateAttributeMiddleware('params', 'role_id', 'Role_id missing or invalid in request params.'),
        (req: Request, res: Response, next: NextFunction) => userRoutesController.deleteUserRoles(req, res, next)
    );

    return router;
}