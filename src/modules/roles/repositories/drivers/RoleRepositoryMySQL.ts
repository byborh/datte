import { Role } from "@modules/roles/entity/Role.entity";
import { IRoleRepository } from "../contract/IRoleRepository";
import { Repository } from "typeorm";
import { AppDataSource } from "@db/AppDataSource";

export class RoleRepositoryMySQL implements IRoleRepository {
    private repository: Repository<Role>;

    constructor() { this.repository = AppDataSource.getRepository(Role); }

    async getRoleByField(field: string, value: string): Promise<Role | null> {
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
            throw new Error("Role data is incomplete.");
        }

        return role || null;
    }

    async getRoleById(roleId: string): Promise<Role | null> {
        if (!roleId) return null;
        return await this.getRoleByField('id', roleId) || null;
    }

    async getRoleByName(name: string): Promise<Role | null> {
        if (!name) return null;
        return await this.getRoleByField('name', name) || null;
    }

    async getRoles(): Promise<Role[]> {
        // Fetch all roles from the database
        const rawResult: Role[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        // Return the array of roles
        return rowsArray;
    }

    async createRole(role: Role): Promise<Role | null> {
        // Insert the role in the database
        const result = await this.repository.save(role);

        // If the role is not created, return null
        if (!result) return null;

        // Return the role
        return this.getRoleById(role.id) || null;
    }

    async modifyRole(role: Role): Promise<Role | null> {
        // Be sure that role exists
        const existingRole: Role = await this.repository.findOne({ where: { id: role.id } });
        if (!existingRole) return null;

        // Merge role data with existing role data
        this.repository.merge(existingRole, role);

        // Save the modified role
        const result = await this.repository.save(existingRole);

        // Return the role
        return this.getRoleById(role.id) || null;
    }

    async deleteRole(roleId: string): Promise<boolean> {
        const result = await this.repository.delete(roleId);

        // Return true if the role is deleted, false otherwise
        return !result ? false : true;
    }
}
