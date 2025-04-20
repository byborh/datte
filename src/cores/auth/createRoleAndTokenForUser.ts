import { CreateToken } from "./createToken";
import { IRoleRepository } from "@modules/roles/repositories/contract/IRoleRepository";
import { IUserRolesRepository } from "@modules/user-roles/repositories/contract/IUserRolesRepository";
import { AuthTokenAbstract } from "@modules/auth-token/entity/AuthToken.abstract";
import { createRoleEntity } from "@modules/roles/entity/Role.factory";
import { createUserRolesEntity } from "@modules/user-roles/entity/UserRoles.factory";
import { TRoleName } from "@modules/roles/contracts/TRoleName";

export class CreateRoleAndTokenForUser {
    private static instance: CreateRoleAndTokenForUser;
    private roleRepository: IRoleRepository;
    private userRolesRepository: IUserRolesRepository;
    private createToken: CreateToken;

    private constructor(roleRepo: IRoleRepository, userRolesRepo: IUserRolesRepository, createToken: CreateToken) {
        this.roleRepository = roleRepo;
        this.userRolesRepository = userRolesRepo;
        this.createToken = createToken;
    }

    public static getInstance(
        roleRepository: IRoleRepository,
        userRolesRepository: IUserRolesRepository,
        createToken: CreateToken
    ): CreateRoleAndTokenForUser {
        if (!CreateRoleAndTokenForUser.instance) {
            CreateRoleAndTokenForUser.instance = new CreateRoleAndTokenForUser(roleRepository, userRolesRepository, createToken);
        }
        return CreateRoleAndTokenForUser.instance;
    }

    public async createRoleAndTokenForUser(userId: string): Promise<AuthTokenAbstract | null> {
        try {
            // Rôles par défaut
            const defaultRoles: { id: string; name: TRoleName; description: string }[] = [
                { id: "123sW8eR1tZ4USER", name: "USER", description: "Just a chill user" },
                { id: "wE3rT6yU8iK2lO7p", name: "MANAGER", description: "Gère les utilisateurs et les permissions avec certaines restrictions" },
                { id: "qA5sW8eR1tZ4vC9m", name: "ADMIN", description: "Accès total à toutes les ressources" },
            ];

            // Récupérer les rôles existants
            const existingRoles = await this.roleRepository.getRoles();
            const existingRoleNames = new Set(existingRoles.map(role => role.name));

            // Créer les rôles manquants
            for (const defaultRole of defaultRoles) {
                if (!existingRoleNames.has(defaultRole.name)) {
                    const roleEntity = await createRoleEntity(defaultRole); // Factory pour créer une entité valide
                    const createdRole = await this.roleRepository.createRole(roleEntity);
                    if (!createdRole) throw new Error(`Failed to create role: ${defaultRole.name}`);
                    existingRoles.push(createdRole);
                }
            }

            // Récupérer l'ID du rôle USER
            const userRole = existingRoles.find(role => role.name === "ADMIN");
            if (!userRole) throw new Error("ADMIN role not found");
            const roleId: string = userRole.getId();

            // Créer une association User <-> Role
            const userRoleEntity = await createUserRolesEntity({ user_id: userId, role_id: roleId });
            const createdUserRole = await this.userRolesRepository.createUserRoles(userRoleEntity);
            if (!createdUserRole) throw new Error("UserRoles didn't get created correctly.");

            // Générer un token d'authentification
            const authToken = await this.createToken.createToken(userId, [roleId]);
            if (!authToken) throw new Error("Failed to generate authentication token.");

            return authToken;
        } catch (error) {
            console.error("Error in createRoleAndTokenForUser:", error);
            throw error;
        }
    }
}
