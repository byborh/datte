import { IRoleRepository } from "../contract/IRoleRepository";
import { Repository } from "typeorm";
import { MongoDatabase } from "@db/drivers/mongo.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { createRoleEntity } from "@modules/roles/entity/Role.factory";
import { RoleMongoEntity } from "@modules/roles/entity/mongo/Role.entity";

export class RoleRepositoryMongo implements IRoleRepository {
    private repository: Repository<RoleMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(RoleMongoEntity);
    }

    async getRoleByField(field: string, value: string): Promise<RoleMongoEntity | null> {
        try {
            const allowedFields = ['id', 'name', 'description'];
            if (!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

            const row = await this.repository.findOne({ where: { [field]: value } });
            if (!row) return null;

            if (!row.id || !row.name) {
                console.error("Invalid role data:", row);
                throw new Error("RoleMongoEntity data is incomplete.");
            }

            return row;
        } catch (error) {
            console.error("Failed to find role by field:", error);
            return null;
        }
    }

    async getRoleById(roleId: string): Promise<RoleMongoEntity | null> {
        try {
            return await this.repository.findOneBy({ id: roleId }) || null;
        } catch (error) {
            console.error("Failed to find role by id:", error);
            return null;
        }
    }

    async getRoleByName(name: string): Promise<RoleMongoEntity | null> {
        return await this.getRoleByField('name', name);
    }

    async getRoles(): Promise<RoleMongoEntity[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error("Failed to find roles:", error);
            return [];
        }
    }

    async createRole(role: RoleMongoEntity): Promise<RoleMongoEntity | null> {
        try {
            const roleEntity = await createRoleEntity(role);

            const result = await this.repository.save(roleEntity);
            return result ? await this.getRoleById(result.id) : null;
        } catch (error) {
            console.error("Failed to create role:", error);
            return null;
        }
    }

    async modifyRole(role: RoleMongoEntity): Promise<RoleMongoEntity | null> {
        try {
            const roleEntity = await createRoleEntity(role);

            const existingRole = await this.repository.findOneBy({ id: role.id });
            if (!existingRole) return null;

            this.repository.merge(existingRole, roleEntity);
            await this.repository.save(existingRole);

            return await this.getRoleById(roleEntity.id);
        } catch (error) {
            console.error("Failed to modify role:", error);
            return null;
        }
    }

    async deleteRole(roleId: string): Promise<boolean> {
        try {
            const result = await this.repository.delete({ id: roleId });
            return result.affected ? true : false;
        } catch (error) {
            console.error("Failed to delete role:", error);
            return false;
        }
    }
}