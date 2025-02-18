import { IdGenerator } from "@core/idGenerator";
import {User} from "../entity/User.entity";
import { UserDTO } from "../dto/UserDTO";
import { UserMapper } from "../mapper/UserMapper";
import {UserRepositoryMySQL} from "../repositories/drivers/UserRepositoryMySQL";
import {PasswordManager} from "@core/cryptography/PasswordManager";
import _ from "lodash";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";
import { CreateRoleAndTokenForUser } from "@core/auth/createRoleAndTokenForUser";
import { UserRolesRepositoryMySQL } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryMySQL";
import { AuthTokenRepositoryMySQL } from "@modules/auth-token/repositories/drivers/AuthTokenRepositoryMySQL";
import { RoleRepositoryMySQL } from "@modules/roles/repositories/drivers/RoleRepositoryMySQL";
import { CreateToken } from "@core/auth/createToken";


export class UserService {
    private userRepository: UserRepositoryMySQL;

    constructor(userRepository: UserRepositoryMySQL) {
        this.userRepository = userRepository;
    }

    // Get a user by ID
    public async getUserById(userId: string): Promise<UserDTO | null> {
        try {
            // Verify if userId is provided
            if (!userId) {
                throw new Error("User ID is required.");
            }

            // Call UserRepository to find a user by ID
            const userEntity: User = await this.userRepository.findUserById(userId);

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
            if (!email) {
                throw new Error("Email is required.");
            }

            // Call UserRepository to find a user by email
            const userEntity: User = await this.userRepository.findUserByEmail(email);

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
            const usersEntity: User[] = await this.userRepository.getAllUsers();

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
    public async createUser(user: User): Promise<UserDTO | null> {
        try {
            // Verify if user exists
            const localUser: UserDTO | null = await this.userRepository.findUserByEmail(user.getEmail());
            if (localUser) {
                console.error("User already exists:", localUser);
                throw new Error("User already exists.");
            }

            // Password management
            const passwordManager = PasswordManager.getInstance();

            // Creation of the salt
            const salt: string = passwordManager.generateSalt();

            // Creation of hashed password
            const hashedPassword: string = passwordManager.hashPassword(user.getPassword(), salt);

            // Verification of password
            const isValid: boolean = passwordManager.verifyPassword(user.getPassword(), salt, hashedPassword);

            // Assign hashed password to user
            user.setPassword(hashedPassword);
            user.setSalt(salt);

            // Create user from repository
            const createdUser: User | null = await this.userRepository.createUser(user);

            // User didn't created
            if (!createdUser) throw new Error("User didn't created...")

            // Dependencies :
            const roleRepository = new RoleRepositoryMySQL();
            const userRolesRepository = new UserRolesRepositoryMySQL();
            const authTokenRepository = new AuthTokenRepositoryMySQL();

            const createToken = CreateToken.getInstance(authTokenRepository);            

            // Attribute USER role
            const createRoleAndTokenForUser = CreateRoleAndTokenForUser.getInstance(roleRepository, userRolesRepository, createToken);
            const authToken: AuthToken | null = await createRoleAndTokenForUser.createRoleAndTokenForUser(createdUser.getId());

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
    public async modifyUser(userId: string, data: Partial<User>): Promise<UserDTO | null> {
        try {
            // Vérification de l'existence de l'utilisateur
            const existingUserDTO: UserDTO | null = await this.getUserById(userId);
            if (!existingUserDTO) {
                throw new Error("User not found.");
            }
    
            // Mapping du DTO vers l'entité
            const existingUser: User = await UserMapper.toEntity(existingUserDTO);
    
            // Variable pour suivre les modifications
            let hasChanges: boolean = false;
    
            // Comparaison des champs et mise à jour si nécessaire
            if (data.email && data.email !== existingUser.getEmail()) {
                existingUser.setEmail(data.email);
                hasChanges = true;
            }
    
            if (data.firstname && data.firstname !== existingUser.getFirstname()) {
                existingUser.setFirstname(data.firstname);
                hasChanges = true;
            }
    
            if (data.lastname && data.lastname !== existingUser.getLastname()) {
                existingUser.setLastname(data.lastname);
                hasChanges = true;
            }
    
            if (data.pseudo && data.pseudo !== existingUser.getPseudo()) {
                existingUser.setPseudo(data.pseudo);
                hasChanges = true;
            }
    
            if (data.telnumber && data.telnumber !== existingUser.getTelnumber()) {
                existingUser.setTelnumber(data.telnumber);
                hasChanges = true;
            }
    
            // Vérification du mot de passe (changer uniquement s'il est modifié)
            if (data.password) {
                const passwordManager = PasswordManager.getInstance();
                const isPasswordValid: boolean = passwordManager.verifyPassword(
                    data.password,
                    existingUser.getSalt(),
                    existingUser.getPassword()
                );
    
                // Si le mot de passe est différent
                if (!isPasswordValid) {
                    const newSalt = passwordManager.generateSalt();
                    const hashedPassword = passwordManager.hashPassword(data.password, newSalt);
                    existingUser.setSalt(newSalt);
                    existingUser.setPassword(hashedPassword);
                    hasChanges = true;
                }
            }
    
            // Si aucune modification n'est détectée, ne rien faire
            if (!hasChanges) {
                throw new Error("No changes detected.");
            }
    
            // Mise à jour de la date de modification
            existingUser.setUpdatedAt(new Date());
    
            // Mise à jour dans la base de données
            const updatedUser: User | null = await this.userRepository.modifyUser(existingUser);
    
            // Si l'utilisateur n'a pas été mis à jour, retourner null
            if (!updatedUser) {
                throw new Error("User not updated.");
            }
    
            // Retourner le DTO de l'utilisateur mis à jour sans données sensibles
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