import { IRoleRepository } from "../contract/IRoleRepository";
import { Repository } from "typeorm";
import { SQLDatabase } from "@db/drivers/sql.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { createRoleEntity } from "@modules/roles/entity/Role.factory";
import { RoleSQLEntity } from "@modules/roles/entity/sql/Role.entity";

export class RoleRepositorySQL implements IRoleRepository {
    private repository: Repository<RoleSQLEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as SQLDatabase;
        this.repository = dataSource.getDataSource().getRepository(RoleSQLEntity);
    }

    async getRoleByField(field: string, value: string): Promise<RoleSQLEntity | null> {
        // Validate field
        const allowedFields = ['id', 'name', 'description'];
        if (!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // Find role by field
        const row = await this.repository.findOne({ where: { [field]: value } });

        // Validate rows
        if (!row) return null;

        const role = Array.isArray(row) ? row[0] : row;

        // Verify if all required fields are present
        if (!role.id || !role.name) {
            console.error("Invalid role data:", role);
            throw new Error("RoleSQLEntity data is incomplete.");
        }

        return role || null;
    }

    async getRoleById(roleId: string): Promise<RoleSQLEntity | null> {
        if (!roleId) return null;
        return await this.getRoleByField('id', roleId) || null;
    }

    async getRoleByName(name: string): Promise<RoleSQLEntity | null> {
        if (!name) return null;
        return await this.getRoleByField('name', name) || null;
    }

    async getRoles(): Promise<RoleSQLEntity[]> {
        // Fetch all roles from the database
        const rawResult: RoleSQLEntity[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        // Return the array of roles
        return rowsArray;
    }

    async createRole(role: RoleSQLEntity): Promise<RoleSQLEntity | null> {
        const roleEntity = await createRoleEntity(role);

        // Insert the role in the database
        const result = await this.repository.save(roleEntity);

        // If the role is not created, return null
        if (!result) return null;

        // Return the role
        return this.getRoleById(roleEntity.id) || null;
    }

    async modifyRole(role: RoleSQLEntity): Promise<RoleSQLEntity | null> {
        const roleEntity = await createRoleEntity(role);

        // Be sure that role exists
        const existingRole: RoleSQLEntity = await this.repository.findOne({ where: { id: roleEntity.id } });
        if (!existingRole) return null;

        // Merge role data with existing role data
        this.repository.merge(existingRole, roleEntity);

        // Save the modified role
        const result = await this.repository.save(existingRole);

        // Return the role
        return this.getRoleById(roleEntity.id) || null;
    }

    async deleteRole(roleId: string): Promise<boolean> {
        const result = await this.repository.delete(roleId);

        // Return true if the role is deleted, false otherwise
        return !result ? false : true;
    }
}
