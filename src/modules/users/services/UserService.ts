import { UserDTO } from "../dto/UserDTO";
import { UserMapper } from "../mapper/UserMapper";
import { PasswordManager } from "@core/cryptography/PasswordManager";
import { CreateRoleAndTokenForUser } from "@core/auth/createRoleAndTokenForUser";
import { UserRolesRepositorySQL } from "@modules/user-roles/repositories/drivers/UserRolesRepositorySQL";
import { AuthTokenRepositorySQL } from "@modules/auth-token/repositories/drivers/AuthTokenRepositorySQL";
import { RoleRepositorySQL } from "@modules/roles/repositories/drivers/RoleRepositorySQL";
import { CreateToken } from "@core/auth/createToken";
import { getDatabase } from "@db/DatabaseClient";
import { IUserRepository } from "../repositories/contract/IUserRepository";
import { IRoleRepository } from "@modules/roles/repositories/contract/IRoleRepository";
import { getRepository } from "@core/db/databaseGuards";
import { RoleRepositoryRedis } from "@modules/roles/repositories/drivers/RoleRepostoryRedis";
import { UserRolesRepositoryRedis } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryRedis";
import { IUserRolesRepository } from "@modules/user-roles/repositories/contract/IUserRolesRepository";
import { IAuthTokenRepository } from "@modules/auth-token/repositories/contract/IAuthTokenRepository";
import { AuthTokenRepositoryRedis } from "@modules/auth-token/repositories/drivers/AuthTokenRepositoryRedis";
import { UserAbstract } from "../entity/User.abstract";
import { AuthTokenAbstract } from "@modules/auth-token/entity/AuthToken.abstract";
import { createUserEntity } from "../entity/User.factory";
import { RoleRepositoryMongo } from "@modules/roles/repositories/drivers/RoleRepositoryMongo";
import { UserRolesRepositoryMongo } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryMongo";
import { AuthTokenRepositoryMongo } from "@modules/auth-token/repositories/drivers/AuthTokenRepositoryMongo";
import _ from "lodash";


export class UserService {
    constructor(private userRepository: IUserRepository) {}

    // Get a user by ID
    public async getUserById(userId: string): Promise<UserDTO | null> {
        try {
            // Verify if userId is provided
            if (!userId) {
                throw new Error("User ID is required.");
            }

            // Call UserRepository to find a user by ID
            const userEntity: UserAbstract = await this.userRepository.findUserById(userId);

            // If no user is found, return null
            if (!userEntity) {
                throw new Error("User not found.");
            }

            // Transform the entity to the dto
            const userDTO: UserDTO = UserMapper.toDTO(userEntity);

            // Return the user
            return userDTO;
        } catch (error) {
            console.error("Error finding user in UserService:", error);
            throw new Error("Failed to find user.");
        }
    }

    // Get a user by Email
    public async getUserByEmail(email: string): Promise<UserDTO | null> {
        try {
            // Verify if email is provided
            if (!email) throw new Error("Email is required.");

            // Call UserRepository to find a user by email
            const userEntity: UserAbstract = await this.userRepository.findUserByEmail(email);

            // If no user is found, return null
            if (!userEntity) {
                throw new Error("User not found.");
            }

            // Transform the entity to the dto
            const userDTO: UserDTO = UserMapper.toDTO(userEntity);

            // Return the user
            return userDTO;
        } catch (error) {
            console.error("Error finding user by email in UserService:", error);
            throw new Error("Failed to find user by email.");
        }
    }

    // Get all users
    public async getUsers(): Promise<Array<UserDTO> | null> {
        try {
            // Call UserRepository to find all users
            const usersEntity: UserAbstract[] = await this.userRepository.getAllUsers();

            // If no users are found, return null
            if (!usersEntity) return null;

            // Return all users in DTO format
            return usersEntity.map(userEntity => UserMapper.toDTO(userEntity));
        } catch (error) {
            console.error("Error finding users in UserService:", error);
            throw new Error("Failed to find users.");
        }
    }
    
    // Create user
    public async createUser(user: UserAbstract): Promise<UserDTO | null> {
        try {
            // Factory to create a correct type of user entity
            const userEntity = await createUserEntity(user);

            // Verify if user exists
            const localUser: UserAbstract | null = await this.userRepository.findUserByEmail(userEntity.email);
            if (localUser) {
                console.error("User already exists:", localUser);
                throw new Error("User already exists.");
            }

            // Password management
            const passwordManager = PasswordManager.getInstance();

            // Creation of the salt
            const salt: string = passwordManager.generateSalt();

            // Creation of hashed password
            const hashedPassword: string = passwordManager.hashPassword(userEntity.password, salt);

            // Verification of password
            // const isPasswordValid: boolean = passwordManager.verifyPassword(userEntity.password, salt, hashedPassword); // IL N'EST PAS UTILISE ???

            // Assign hashed password to user
            userEntity.setPassword(hashedPassword);
            userEntity.setSalt(salt);

            // Create user from repository
            const createdUser: UserAbstract | null = await this.userRepository.createUser(userEntity);

            // User didn't created
            if (!createdUser) throw new Error("User didn't created...")

            // Initialize the Database
            const myDB = await getDatabase();

            // Initialize the repository
            // Role repository
            const roleRepository = getRepository(myDB, RoleRepositorySQL, RoleRepositoryRedis, RoleRepositoryMongo) as IRoleRepository;
            // UserRoles repository
            const userRolesRepository = getRepository(myDB, UserRolesRepositorySQL, UserRolesRepositoryRedis, UserRolesRepositoryMongo) as IUserRolesRepository;
            // AuthToken repositoryé&
            const authTokenRepository = getRepository(myDB, AuthTokenRepositorySQL, AuthTokenRepositoryRedis, AuthTokenRepositoryMongo) as IAuthTokenRepository;

            const createToken = CreateToken.getInstance(authTokenRepository);

            // Attribute USER role
            const createRoleAndTokenForUser = CreateRoleAndTokenForUser.getInstance(roleRepository, userRolesRepository, createToken);
            const authToken: AuthTokenAbstract | null = await createRoleAndTokenForUser.createRoleAndTokenForUser(createdUser.getId());

            if(!authToken) throw new Error("Attribution of role or token didn't created...");

            // Entity to DTO
            const userDTO: UserDTO = UserMapper.toDTO(createdUser);
            return userDTO;
        } catch (error) {
            console.error("Error creating user in UserService:", error);
            throw new Error("Failed to create user.");
        }
    }

    // Modify user
    public async modifyUser(userId: string, user: Partial<UserAbstract>): Promise<UserDTO | null> {
        try {
            // Factory to create a correct type of user entity
            const userEntity = await createUserEntity(user);

            // Verify if user exists
            const existingUserDTO: UserDTO | null = await this.getUserById(userId);
            if (!existingUserDTO) {
                throw new Error("User not found.");
            }
    
            // Mapp the DTO to the entity
            const existingUser: UserAbstract = await UserMapper.toEntity(existingUserDTO);

            // Factory to create a correct type of user entity
            const existingUserEntity = await createUserEntity(existingUser);
    
            // Variable to track changes
            let hasChanges: boolean = false;
    
            // Compare fields and update if necessary
            if (userEntity.email && userEntity.email !== existingUserEntity.email) {
                existingUserEntity.setEmail(userEntity.email);
                hasChanges = true;
            }
    
            if (userEntity.firstname && userEntity.firstname !== existingUserEntity.firstname) {
                existingUserEntity.setFirstname(userEntity.firstname);
                hasChanges = true;
            }
    
            if (userEntity.lastname && userEntity.lastname !== existingUserEntity.lastname) {
                existingUserEntity.setLastname(userEntity.lastname);
                hasChanges = true;
            }
    
            if (userEntity.pseudo && userEntity.pseudo !== existingUserEntity.pseudo) {
                existingUserEntity.setPseudo(userEntity.pseudo);
                hasChanges = true;
            }
    
            if (userEntity.telnumber && userEntity.telnumber !== existingUserEntity.telnumber) {
                existingUserEntity.setTelnumber(userEntity.telnumber);
                hasChanges = true;
            }
    
            // Verify password
            if (userEntity.password) {
                const passwordManager = PasswordManager.getInstance();
                const isPasswordValid: boolean = passwordManager.verifyPassword(
                    userEntity.password,
                    existingUserEntity.salt,
                    existingUserEntity.password
                );
    
                // If password is different
                if (!isPasswordValid) {
                    const newSalt = passwordManager.generateSalt();
                    const hashedPassword = passwordManager.hashPassword(userEntity.password, newSalt);
                    existingUserEntity.setSalt(newSalt);
                    existingUserEntity.setPassword(hashedPassword);
                    hasChanges = true;
                }
            }
    
            // If no changes are detected, do nothing
            if (!hasChanges) {
                throw new Error("No changes detected.");
            }
    
            // Mise à jour de la date de modification
            // Update the updatedAt field
            existingUserEntity.setUpdatedAt(new Date());
    
            // Update the user in DB
            const updatedUser: UserAbstract | null = await this.userRepository.modifyUser(existingUserEntity);
    
            // If user didn't updated, return null
            if (!updatedUser) {
                throw new Error("User not updated.");
            }
    
            // Return the updated user without sensitive userEntity
            return UserMapper.toDTO(updatedUser);
        } catch (error) {
            console.error("Error modifying user in UserService:", error);
            throw new Error("Failed to modify user.");
        }
    }    

    // Delete user
    public async deleteUser(userId: string): Promise<boolean> {
        try {
            // Verify if userId is provided
            if (!userId) {
                throw new Error("User ID is required.");
            }

            // Find the user by ID
            const user: UserDTO | null = await this.getUserById(userId);
            if (!user) {
                console.error("User not found:", userId);
                return false;
            }

            // Delete the user
            const isDeleted: boolean = await this.userRepository.deleteUser(userId);

            // Return true if the user is deleted, false otherwise
            return isDeleted;
        } catch (error) {
            console.error("Error deleting user in UserService:", error);
            throw new Error("Failed to delete user.");
        }
    }
}