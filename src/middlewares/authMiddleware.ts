import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@db/AppDataSource';
import fs from 'fs';
import path from 'path';
import { User } from '@modules/users/entity/User.entity';

const publicKeyPath = path.join(__dirname, '../../ec_public.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export const authMiddleware = (requiredRoles: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Verify the presence of the token
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Token missing.' });
                return;
            }

            const token = authHeader.split(' ')[1];

            // Verify the validation of token
            let decoded: any;
            try {
                decoded = jwt.verify(token, publicKey);
            } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                    res.status(401).json({ message: 'Token expired.' });
                    return;
                } else if (error.name === 'JsonWebTokenError') {
                    res.status(401).json({ message: 'Invalid token.' });
                    return;
                }
                res.status(401).json({ message: 'Token verification failed.' });
                return;
            }

            if (!decoded.sub) {
                res.status(401).json({ message: 'Invalid token payload.' });
                return;
            }

            // Verify token expiration
            if (decoded.exp < Date.now() / 1000) {
                res.status(401).json({ message: 'Token expired.' });
                return;
            }

            // Verify if user exists
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { id: decoded.sub },
                relations: ['userRoles', 'userRoles.role'], // Fetch user roles
            });

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const userRoles: string[] = user.userRoles.map((userRole) => userRole.role.name);

            if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRoles.includes(role))) {
                res.status(403).json({ message: "Access denied. Insufficient permissions." });
                return;
            }

            // Attach user data to the request
            (req as any).user = {
                id: user.id,
                roles: userRoles,
                tokenId: decoded.jti,
            };


            next();
        } catch (error) {
            next(error);
        }
    };
};
