import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { RoleRepositoryMySQL } from "@modules/roles/repositories/drivers/RoleRepositoryMySQL";
import { Role } from "@modules/roles/entity/Role.entity";
import { UserRolesRepositoryMySQL } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryMySQL";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";
import { CreateToken } from "./createToken";

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

        // Get ID of USER role
        const role: Role = await this.roleRepository.getRoleByName('USER');
        const roleId: string = role.getId();

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