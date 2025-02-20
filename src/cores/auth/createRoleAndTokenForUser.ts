import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { RoleRepositoryMySQL } from "@modules/roles/repositories/drivers/RoleRepositoryMySQL";
import { Role } from "@modules/roles/entity/Role.entity";
import { UserRolesRepositoryMySQL } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryMySQL";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";
import { CreateToken } from "./createToken";
import { TRoleName } from "@modules/roles/contracts/TRoleName";

export class CreateRoleAndTokenForUser {
    private static instance: CreateRoleAndTokenForUser;
    private roleRepository: RoleRepositoryMySQL;
    private userRolesRepository: UserRolesRepositoryMySQL;
    private createToken: CreateToken;

    private constructor(roleRepo: RoleRepositoryMySQL, userRolesRepo: UserRolesRepositoryMySQL, createToken: CreateToken) {
        this.roleRepository = roleRepo;
        this.userRolesRepository = userRolesRepo;
        this.createToken = createToken;
    }

    public static getInstance(
        roleRepository: RoleRepositoryMySQL,
        userRolesRepository: UserRolesRepositoryMySQL,
        createToken: CreateToken
    ): CreateRoleAndTokenForUser{
        if(!CreateRoleAndTokenForUser.instance) {
            CreateRoleAndTokenForUser.instance = new CreateRoleAndTokenForUser(roleRepository, userRolesRepository, createToken);
        }
        return CreateRoleAndTokenForUser.instance;
    }


    public async createRoleAndTokenForUser(userId: string): Promise<AuthToken | null> {
        // Get ID of USERS role

        // ---------------------------------------------------------------------------------------
        // IT'S A BAD CODE, I KNOW, BUT NVM, I'LL CHANGE IT FOR FUTURE VERSIONS...
        // PROMISE, I'LL DO IT BETER

        // Get all existant roles
        let roles: Role[] = await this.roleRepository.getRoles();

        // Define the default roles
        const defaultRoles = [
            {
                id: "123sW8eR1tZ4USER",
                name: "USER" as TRoleName,
                description: "Just a chill user",
            },
            {
                id: "wE3rT6yU8iK2lO7p",
                name: "MANAGER" as TRoleName,
                description: "Gère les utilisateurs et les permissions avec certaines restrictions",
            },
            {
                id: "qA5sW8eR1tZ4vC9m",
                name: "ADMIN" as TRoleName,
                description: "Accès total à toutes les ressources",
            },
        ];

        // Valide and create all roles if they don't exist
        for (const defaultRole of defaultRoles) {
            const roleExists = roles.some((role) => role.name === defaultRole.name);
            if (!roleExists) {
                const newRole = new Role(
                    defaultRole.id,
                    defaultRole.name,
                    defaultRole.description
                );
                const createdRole = await this.roleRepository.createRole(newRole);
                if (!createdRole) throw new Error(`Failed to create role: ${defaultRole.name}`);
                roles.push(createdRole); // Ajouter le nouveau rôle à la liste des rôles
            }
        }

        // ---------------------------------------------------------------------------------------

        const adminRole = roles.find((role) => role.name === "ADMIN");
        if (!adminRole) throw new Error("Admin role not found");

        const roleId: string = adminRole.id;

        // Create userRoles
        const userRoles: UserRoles = new UserRoles(userId, roleId);

        // Insérer dans la bdd
        const userRolesEntity: UserRoles = await this.userRolesRepository.createUserRoles(userRoles);
        if(!userRolesEntity) throw new Error("UserRoles didn't created correctly.")

        // Appeler la fonction pour créer un token
        const authToken: AuthToken = await this.createToken.createToken(userId, [roleId]);

        return authToken;
    }
}