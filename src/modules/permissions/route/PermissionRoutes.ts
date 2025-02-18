import express, { Request, Response,NextFunction } from 'express'
import { PermissionController } from '../controllers/PermissionController';
import { validateAttributeMiddleware } from '@middlewares/validateAttributeMiddleware';
import { authMiddleware } from '@middlewares/authMiddleware';

export const permissionRoutes = (permissionController: PermissionController): express.Router => {
    const router = express.Router();

    // Lire une permission (ADMIN, MANAGER)
    router.get('/:id',
        authMiddleware(['ADMIN', 'MANAGER']),
        validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
        (req: Request, res: Response, next: NextFunction) => permissionController.getPermissionById(req, res, next)
    );

    // Lire toutes les permissions (ADMIN, MANAGER)
    router.get('/',
        authMiddleware(['ADMIN', 'MANAGER']),
        (req: Request, res: Response, next: NextFunction) => permissionController.getAllPermissions(req, res, next)
    );

    // Créer une permission (ADMIN uniquement)
    router.post('/',
        authMiddleware(['ADMIN']),
        validateAttributeMiddleware('body', 'action', 'Action missing or invalid in request body'),
        validateAttributeMiddleware('body', 'resource', 'Resource missing or invalid in request body'),
        validateAttributeMiddleware('body', 'description', 'Description missing or invalid in request body'),
        (req: Request, res: Response, next: NextFunction) => permissionController.createPermission(req, res, next)
    );

    // Modifier une permission (ADMIN uniquement)
    router.patch('/:id',
        authMiddleware(['ADMIN']),
        validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
        (req: Request, res: Response, next: NextFunction) => permissionController.modifyPermission(req, res, next)
    );

    // Supprimer une permission (ADMIN uniquement)
    router.delete('/:id',
        authMiddleware(['ADMIN']),
        validateAttributeMiddleware('params', 'id', 'Id missing or invalid in request params.'),
        (req: Request, res: Response, next: NextFunction) => permissionController.deletePermission(req, res, next)
    );

    return router;
};