import { IRoleRepository } from "../contract/IRoleRepository";
import { RedisClientType } from "@redis/client";
import { IDatabase } from "@db/contract/IDatabase";
import { RoleRedisEntity } from "@modules/roles/entity/redis/Role.entity";

export class RoleRepositoryRedis implements IRoleRepository {
    private client: RedisClientType;
    private isInitialize: Promise<void>;

    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
    }

    async initialize(): Promise<void> {
        try {
            if(!this.client.isOpen) {
                await this.client.connect();
            }
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
            throw error;
        }
    }

    async getRoleByField(field: string, value: string): Promise<RoleRedisEntity | null> {
        return null; // Don't use this method for redis
    }

    async getRoleById(roleId: string): Promise<RoleRedisEntity | null> {
        try {
            await this.isInitialize;

            const role = await this.client.hGetAll(`role:${roleId}`);

            return Object.keys(role).length > 0 ? RoleRedisEntity.fromRedisHash(role) : null;
        } catch(error) {
            console.error("Failed to find role by id:", error);
        }
    }

    async getRoleByName(name: string): Promise<RoleRedisEntity | null> {
        try {
            await this.isInitialize;

            // Get the id of role from index
            const roleId = await this.client.hGet(`role_index`, `name:${name}`);

            // find the role
            const role = await this.client.hGetAll(`role:${roleId}`);

            return Object.keys(role).length > 0 ? RoleRedisEntity.fromRedisHash(role) : null;
        } catch(error) {
            console.error("Failed to find role by name:", error);
        }
    }

    async getRoles(): Promise<RoleRedisEntity[] | null> {
        try {
            await this.isInitialize;
            
            const roles: RoleRedisEntity[] = [];
            let cursor: number = 0;

            do {
                const reply = await this.client.scan(cursor, {MATCH: "role:*", COUNT: 100});
                cursor = reply.cursor;
                const keys = reply.keys;

                for(const key of keys) {
                    const roleData = await this.client.hGetAll(key);
                    roles.push(RoleRedisEntity.fromRedisHash(roleData));
                }
            } while(cursor !== 0);

            return roles;
        } catch(error) {
            console.error("Failed to find roles:", error);
        }
    }

    async createRole(role: RoleRedisEntity): Promise<RoleRedisEntity | null> {
        try {
            await this.isInitialize;
            
            // Create role in db
            await this.client.hSet(`role:${role.id}`, role.toRedisHash());

            // Create an index in name
            await this.client.hSet(`role_index`, `name:${role.name}`, role.id);

            // Verify if role was created
            const exists = await this.client.exists(`role:${role.id}`);
            
            return exists === 1 ? role : null;
        } catch(error) {
            console.error("Failed to create role:", error);
        }
    }

    async modifyRole(role: RoleRedisEntity): Promise<RoleRedisEntity | null> {
        try {
            await this.isInitialize;
            
            // Modify role in db
            await this.client.hSet(`role:${role.id}`, role.toRedisHash());

            // Delete index in name and re-create a new
            await this.client.hDel(`role_index`, `name:${role.name}`);
            await this.client.hSet(`role_index`, `name:${role.name}`, role.id);


            // Verify if role was modified
            const exists = await this.client.exists(`role:${role.id}`);
            
            return exists === 1 ? role : null;
        } catch(error) {
            console.error("Failed to modify role:", error);
        }
    }

    async deleteRole(roleId: string): Promise<boolean> {
        try {
            await this.isInitialize;

            // Get the name of role from index
            const roleName = await this.client.hGet(`role:${roleId}`, `name`);

            // Delete the role
            const roleDel = await this.client.del(`role:${roleId}`);

            // Delete index in name
            const roleIndexDel = await this.client.hDel(`role_index`, `name:${roleName}`);
            
            // Delete role users of role (index)
            const roleUsersDele = await this.client.del(`role_users:${roleId}`);

            return roleDel > 0 || roleUsersDele > 0 || roleIndexDel > 0;
        } catch(error) {
            console.error("Failed to delete:", error);
        }
    }
    
}