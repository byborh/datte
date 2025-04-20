import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '@db/DatabaseClient';
import { IUserRepository } from '@modules/users/repositories/contract/IUserRepository';
import { UserRepositoryRedis } from '@modules/users/repositories/drivers/UserRepositoryRedis';
import { UserRepositorySQL } from '@modules/users/repositories/drivers/UserRepositorySQL';
import { getRepository } from '@core/db/databaseGuards';
import { IUserRolesRepository } from '@modules/user-roles/repositories/contract/IUserRolesRepository';
import { UserRolesRepositorySQL } from '@modules/user-roles/repositories/drivers/UserRolesRepositorySQL'
import { UserRolesRepositoryRedis } from '@modules/user-roles/repositories/drivers/UserRolesRepositoryRedis';
import { UserRolesAbstract } from '@modules/user-roles/entity/UserRoles.abstract';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { RoleRepositorySQL } from '@modules/roles/repositories/drivers/RoleRepositorySQL';
import { RoleRepositoryRedis } from '@modules/roles/repositories/drivers/RoleRepostoryRedis';
import { IRoleRepository } from '@modules/roles/repositories/contract/IRoleRepository';
import { UserRepositoryMongo } from '@modules/users/repositories/drivers/UserRepositoryMongo';
import { UserRolesRepositoryMongo } from '@modules/user-roles/repositories/drivers/UserRolesRepositoryMongo';
import { RoleRepositoryMongo } from '@modules/roles/repositories/drivers/RoleRepositoryMongo';

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

            // Initialize database
            const myDB = await getDatabase();
            const userRepository = getRepository(myDB, UserRepositorySQL, UserRepositoryRedis, UserRepositoryMongo) as IUserRepository;
            const userRolesRepository = getRepository(myDB, UserRolesRepositorySQL, UserRolesRepositoryRedis, UserRolesRepositoryMongo) as IUserRolesRepository;

            // Verify if user exists
            const user = await userRepository.findUserById(decoded.sub);

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            // Verify if user has a role(s)
            const userRoles: UserRolesAbstract[] = await userRolesRepository.getUserRolesByMultipleFields(["user_id"], [decoded.sub]); // Or use : user.id
            
            if (!userRoles || userRoles.length === 0) {
                res.status(403).json({ message: "Access denied. User does not have a role: GUEST" });
                return;
            }

            const roleRepository = await getRepository(myDB, RoleRepositorySQL, RoleRepositoryRedis, RoleRepositoryMongo) as IRoleRepository;

            const userRolesTable: string[] = await Promise.all(
                userRoles.map(async (userRole) => {
                    if (!userRole.role_id) {
                        throw new Error("Role ID is missing in userRole");
                    }
                    const roleEntity = await roleRepository.getRoleById(userRole.role_id);
                    return roleEntity.name;
                })
            );


            if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRolesTable.includes(role))) {
                res.status(403).json({ message: "Access denied. Insufficient permissions." });
                return;
            }

            // Attach user data to the request
            (req as any).user = {
                id: user.id,
                roles: userRolesTable,
                tokenId: decoded.jti,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};