import { Request, Response, NextFunction } from "express";
import { PermissionService } from "../services/PermissionService";
import { Permission } from "../entity/Permission.entity";
import { IdGenerator } from "@core/idGenerator";

export class PermissionController {
    private permissionService: PermissionService;

    constructor(permissionService: PermissionService) {
        this.permissionService = permissionService;
    }

    // Get a permission by ID
    public async getPermissionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve permission by ID using PermissionService
            const permission = await this.permissionService.getPermissionById(req.params.id);
            
            // If no permission is found, return 404
            if (!permission) {
                res.status(404).json({ error: "Permission not found" });
                return;
            }

            // Return the permission data
            res.status(200).json(permission);
        } catch (error) {
            next(error);
        }
    }

    // Get all permissions
    public async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve all permissions using PermissionService
            const permissions = await this.permissionService.getPermissions();

            // If no permissions are found, return 404
            if (!permissions || permissions.length === 0) {
                res.status(404).json({ error: "No permissions found" });
                return;
            }

            // Return all permissions data
            res.status(200).json(permissions);
        } catch (error) {
            next(error);
        }
    }

    // Create a permission
    public async createPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { action, resource, description } = req.body;

            // Check if required fields are provided
            if (!action || !resource) {
                res.status(400).json({ error: "Action and resource are required." });
                return;
            }

            const idGenerator = IdGenerator.getInstance();
            const permissionId: string = idGenerator.generateId(16);

            // Create new permission instance
            const permission = new Permission(permissionId, action, resource, description,);

            // Create permission using PermissionService
            const createdPermission = await this.permissionService.createPermission(permission);

            // If creation fails, return 400
            if (!createdPermission) {
                res.status(400).json({ error: "Permission could not be created." });
                return;
            }

            // Return the created permission data
            res.status(201).json(createdPermission);
        } catch (error) {
            next(error);
        }
    }

    // Modify a permission
    public async modifyPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { action, resource, description } = req.body;

            // Check if permission ID is provided
            if (!req.params.id) {
                res.status(400).json({ error: "Permission ID is required." });
                return;
            }

            // Modify permission using PermissionService
            const updatedPermission = await this.permissionService.modifyPermission(req.params.id, {
                action, resource, description
            });

            // If modification fails, return 404
            if (!updatedPermission) {
                res.status(404).json({ error: "Permission could not be modified." });
                return;
            }

            // Return the updated permission data
            res.status(200).json(updatedPermission);
        } catch (error) {
            next(error);
        }
    }

    // Delete a permission
    public async deletePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Delete permission using PermissionService
            const isDeleted = await this.permissionService.deletePermission(req.params.id);

            // If deletion fails, return 404
            if (!isDeleted) {
                res.status(404).json({ error: "Permission could not be deleted." });
                return;
            }

            // Return success message for deletion
            res.status(200).json({ message: "Permission deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}
