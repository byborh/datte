import { IUserRolesRepository } from "../contract/IUserRolesRepository";
import { IDatabase } from "@db/contract/IDatabase";
import { UserRolesRedisEntity } from "@modules/user-roles/entity/redis/UserRoles.entity";
import { RedisClientType } from "redis";


export class UserRolesRepositoryRedis implements IUserRolesRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>;

    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialized();
    }

    async initialized(): Promise<void> {
        try {
            if(!this.client.isOpen) {
                await this.client.connect();
            }
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
        }
    }


    // async getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRolesRedisEntity[] | null> {
    //     try {
    //         await this.isInitialized;

    //         if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;
    
    //         const results: UserRolesRedisEntity[] = [];
    
    //         // If user_id is provided, get all its roles
    //         if (fields.includes("user_id")) {
    //             const userId = values[fields.indexOf("user_id")];
    //             const roleIds = await this.client.sMembers(`user_roles:${userId}`);

    //             // Verify if user_id found
    //             if(!roleIds || roleIds.length === 0) return null;

    //             results.push(...roleIds.map((roleId) => new UserRolesRedisEntity({user_id: userId, role_id: roleId})));
    //         }
    
    //         // If role_id is provided, get all its users
    //         if (fields.includes("role_id")) {
    //             const roleId = values[fields.indexOf("role_id")];
    //             const userIds = await this.client.sMembers(`role_users:${roleId}`);

    //             // Verify if role_id found
    //             if(!userIds || userIds.length === 0) return null;

    //             results.push(...userIds.map((userId) => new UserRolesRedisEntity({user_id: userId, role_id: roleId})));
    //         }

    //         return results.length > 0 ? results : null;
    //     } catch (error) {
    //         console.error("Error finding userRole in UserRolesRepositoryRedis:", error);
    //         throw error;
    //     }
    // }


    async getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRolesRedisEntity[] | null> {
        try {
            await this.isInitialized;
    
            // Vérification des entrées
            if (fields.length !== values.length || fields.length === 0) {
                return null;
            }
    
            // Récupération des indices des champs
            const userIdIndex = fields.indexOf("user_id");
            const roleIdIndex = fields.indexOf("role_id");
    
            // Si les deux champs sont fournis, rechercher l'association spécifique
            if (userIdIndex !== -1 && roleIdIndex !== -1) {
                const userId = values[userIdIndex];
                const roleId = values[roleIdIndex];
    
                // Vérifier si l'utilisateur a ce rôle
                const hasRole = await this.client.sIsMember(`user_roles:${userId}`, roleId);
                return hasRole ? [new UserRolesRedisEntity({ user_id: userId, role_id: roleId })] : null;
            }
    
            // Si seul user_id est fourni, récupérer tous ses rôles
            if (userIdIndex !== -1) {
                const userId = values[userIdIndex];
                const roleIds = await this.client.sMembers(`user_roles:${userId}`);
                return roleIds.length > 0
                    ? roleIds.map((roleId) => new UserRolesRedisEntity({ user_id: userId, role_id: roleId }))
                    : null;
            }
    
            // Si seul role_id est fourni, récupérer tous ses utilisateurs
            if (roleIdIndex !== -1) {
                const roleId = values[roleIdIndex];
                const userIds = await this.client.sMembers(`role_users:${roleId}`);
                return userIds.length > 0
                    ? userIds.map((userId) => new UserRolesRedisEntity({ user_id: userId, role_id: roleId }))
                    : null;
            }
    
            // Si aucun champ valide n'est fourni, retourner null
            return null;
        } catch (error) {
            console.error("Error finding userRole in UserRolesRepositoryRedis:", error);
            throw error;
        }
    }
    
    async getUserRoles(): Promise<UserRolesRedisEntity[] | null> {
        try {
            await this.isInitialized;
    
            const userRoles: UserRolesRedisEntity[] = [];
            let cursor = 0;
    
            // Loop through all keys
            do {
                const reply = await this.client.scan(cursor, { MATCH: "user_roles:*", COUNT: 100 });
                cursor = reply.cursor;
                const keys = reply.keys;
    
                for (const key of keys) {
                    const userId = key.split(":")[1]; // Extraire l'ID de l'utilisateur
                    const roleIds = await this.client.sMembers(key);
    
                    for (const roleId of roleIds) {
                        userRoles.push(new UserRolesRedisEntity({user_id: userId, role_id: roleId}));
                    }
                }
            } while (cursor !== 0);
    
            return userRoles.length > 0 ? userRoles : null;
        } catch (error) {
            console.error("Error finding all userRoles in UserRolesRepositoryRedis:", error);
            throw error;
        }
    }

    async createUserRoles(userRoles: UserRolesRedisEntity): Promise<UserRolesRedisEntity | null> {
        try {
            await this.isInitialized;

            // Create userRoles in db
            await this.client.sAdd(`user_roles:${userRoles.user_id}`, userRoles.role_id);
            await this.client.sAdd(`role_users:${userRoles.role_id}`, userRoles.user_id);

            return userRoles;
        } catch (error) {
            console.error("Error creating userRoles in UserRolesRepositoryRedis:", error);
        }
    }

    async deleteUserRolesByMultipleFields(fields: string[], values: string[]): Promise<boolean> {
        try {
            await this.isInitialized;
    
            const userIdIndex = fields.indexOf("user_id");
            const roleIdIndex = fields.indexOf("role_id");
    
            if (userIdIndex !== -1 && roleIdIndex !== -1) {
                const userId = values[userIdIndex];
                const roleId = values[roleIdIndex];
    
                // Récupérer les rôles existants
                const roles = await this.client.sMembers(`user_roles:${userId}`);
    
                // Filtrer et supprimer le rôle spécifique
                const updatedRoles = roles.filter(r => r !== roleId);
    
                if (updatedRoles.length === 0) {
                    await this.client.del(`user_roles:${userId}`);
                } else {
                    await this.client.sRem(`user_roles:${userId}`, roleId);
                }
    
                return true;
            }
    
            return false;
        } catch (error) {
            console.error("Error deleting UserRoles in UserRolesRepositoryRedis:", error);
            return false;
        }
    }
    
}