import { Request, Response, NextFunction } from "express";
import { RolePermissions } from "../entity/RolePermissions.entity";
import { RolePermissionsService } from "../services/RolePermissionsService";

export class RolePermissionsController {
    private rolePermissionsService: RolePermissionsService;

    constructor(rolePermissionsService: RolePermissionsService) {
        this.rolePermissionsService = rolePermissionsService;
    }

    // Get a rolePermissions by ID
    public async getRolePermissionsById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve rolePermissions by ID using RolePermissionsService
            const rolePermissions = await this.rolePermissionsService.getRolePermissionsById(req.params.role_id, req.params.permission_id);
            
            // If no rolePermissions is found, return 404
            if (!rolePermissions) {
                res.status(404).json({ error: "RolePermissions not found" });
                return;
            }

            // Return the rolePermissions data
            res.status(200).json(rolePermissions);
        } catch (error) {
            next(error);
        }
    }

    // Get all rolePermissionss
    public async getAllRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Retrieve all rolePermissionss using RolePermissionsService
            const rolePermissionss = await this.rolePermissionsService.getRolePermissions();

            // If no rolePermissionss are found, return 404
            if (!rolePermissionss || rolePermissionss.length === 0) {
                res.status(404).json({ error: "No rolePermissionss found" });
                return;
            }

            // Return all rolePermissionss data
            res.status(200).json(rolePermissionss);
        } catch (error) {
            next(error);
        }
    }

    // Create a rolePermissions
    public async createRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { role_id, permission_id } = req.body;

            // Check if required fields are provided
            if (!role_id || !permission_id) {
                res.status(400).json({ error: "Action and resource are required." });
                return;
            }

            // Create new rolePermissions instance
            const rolePermissions = new RolePermissions(role_id, permission_id);

            // Create rolePermissions using RolePermissionsService
            const createdRolePermissions = await this.rolePermissionsService.createRolePermissions(rolePermissions);

            // If creation fails, return 400
            if (!createdRolePermissions) {
                res.status(400).json({ error: "RolePermissions could not be created." });
                return;
            }

            // Return the created rolePermissions data
            res.status(201).json(createdRolePermissions);
        } catch (error) {
            next(error);
        }
    }
}
