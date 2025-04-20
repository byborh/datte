import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/RoleService";
import { RoleSQLEntity } from "../entity/sql/Role.entity";
import { IdGenerator } from "@core/idGenerator";

export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    // Get a role by ID
    public async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve role by ID using RoleService
            const role = await this.roleService.getRoleById(req.params.id);
            
            // If no role is found, return 404
            if (!role) {
                res.status(404).json({ error: "Role not found" });
                return;
            }

            // Return the role data
            res.status(200).json(role);
        } catch (error) {
            next(error);
        }
    }

    // Get all roles
    public async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve all roles using RoleService
            const roles = await this.roleService.getRoles();

            // If no roles are found, return 404
            if (!roles || roles.length === 0) {
                res.status(404).json({ error: "No roles found" });
                return;
            }

            // Return all roles data
            res.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    }

    // Create a role
    public async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description } = req.body;

            // Check if required fields are provided
            if (!name || !description) {
                res.status(400).json({ error: "Action and resource are required." });
                return;
            }

            const idGenerator = IdGenerator.getInstance();
            const roleId: string = idGenerator.generateId();

            // Create new role instance
            const role = new RoleSQLEntity({id: roleId, name: name, description: description});

            // Create role using RoleService
            const createdRole = await this.roleService.createRole(role);

            // If creation fails, return 400
            if (!createdRole) {
                res.status(400).json({ error: "Role could not be created." });
                return;
            }

            // Return the created role data
            res.status(201).json(createdRole);
        } catch (error) {
            next(error);
        }
    }

    // Modify a role
    public async modifyRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description } = req.body;

            // Check if role ID is provided
            if (!req.params.id) {
                res.status(400).json({ error: "Role ID is required." });
                return;
            }

            // Modify role using RoleService
            const updatedRole = await this.roleService.modifyRole(req.params.id, {
                name, description
            });

            // If modification fails, return 404
            if (!updatedRole) {
                res.status(404).json({ error: "Role could not be modified." });
                return;
            }

            // Return the updated role data
            res.status(200).json(updatedRole);
        } catch (error) {
            next(error);
        }
    }

    // Delete a role
    public async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Delete role using RoleService
            const isDeleted = await this.roleService.deleteRole(req.params.id);

            // If deletion fails, return 404
            if (!isDeleted) {
                res.status(404).json({ error: "Role could not be deleted." });
                return;
            }

            // Return success message for deletion
            res.status(200).json({ message: "Role deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}
