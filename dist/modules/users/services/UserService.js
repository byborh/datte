"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const idGenerator_1 = require("@core/idGenerator");
const UserMapper_1 = require("../mapper/UserMapper");
const PasswordManager_1 = require("@core/cryptography/PasswordManager");
const lodash_1 = __importDefault(require("lodash"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // Get a user by ID
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify if userId is provided
                if (!userId) {
                    throw new Error("User ID is required.");
                }
                // Call UserRepository to find a user by ID
                const userEntity = yield this.userRepository.findUserById(userId);
                // If no user is found, return null
                if (!userEntity) {
                    throw new Error("User not found.");
                }
                // Transform the entity to the dto
                const userDTO = UserMapper_1.UserMapper.toDTO(userEntity);
                // Return the user
                return userDTO;
            }
            catch (error) {
                console.error("Error finding user in UserService:", error);
                throw new Error("Failed to find user.");
            }
        });
    }
    // Get a user by Email
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify if email is provided
                if (!email) {
                    throw new Error("Email is required.");
                }
                // Call UserRepository to find a user by email
                const userEntity = yield this.userRepository.findUserByEmail(email);
                // If no user is found, return null
                if (!userEntity) {
                    throw new Error("User not found.");
                }
                // Transform the entity to the dto
                const userDTO = UserMapper_1.UserMapper.toDTO(userEntity);
                // Return the user
                return userDTO;
            }
            catch (error) {
                console.error("Error finding user by email in UserService:", error);
                throw new Error("Failed to find user by email.");
            }
        });
    }
    // Get all users
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call UserRepository to find all users
                const usersEntity = yield this.userRepository.getAllUsers();
                // If no users are found, return null
                if (!usersEntity)
                    return null;
                // Return all users in DTO format
                return usersEntity.map(userEntity => UserMapper_1.UserMapper.toDTO(userEntity));
            }
            catch (error) {
                console.error("Error finding users in UserService:", error);
                throw new Error("Failed to find users.");
            }
        });
    }
    // Create user
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify if user exists
                const localUser = yield this.getUserByEmail(user.getEmail());
                if (localUser) {
                    console.error("User already exists:", localUser);
                    throw new Error("User already exists.");
                }
                // Initialize IdGenerator
                const idGenerator = idGenerator_1.IdGenerator.getInstance();
                let userId;
                let existingUser = null;
                // Make sure that ID is unique
                do {
                    userId = idGenerator.generateId(16); // Generate a unique ID of 16 characters
                    // Verify if this id exist
                    existingUser = yield this.getUserById(userId);
                } while (existingUser !== null);
                console.log(`Generated ID: ${userId}`);
                // Assign ID to user
                user.setId(userId);
                // Password management
                const passwordManager = PasswordManager_1.PasswordManager.getInstance();
                // Creation of the salt
                const salt = passwordManager.generateSalt();
                // Creation of hashed password
                const hashedPassword = passwordManager.hashPassword(user.getPassword(), salt);
                // A SUPPRIMER AVANT LA PROD !!!
                console.log('Password:', user.getPassword());
                console.log('Hash:', hashedPassword);
                console.log('Salt:', salt);
                // Verification of password
                const isValid = passwordManager.verifyPassword(user.getPassword(), salt, hashedPassword);
                console.log('Mot de passe valide:', isValid);
                // Assign hashed password to user
                user.setPassword(hashedPassword);
                user.setSalt(salt);
                // Create user from repository
                const createdUser = yield this.userRepository.createUser(user);
                // User didn't created
                if (!createdUser) {
                    throw new Error("User didn't created...");
                }
                return createdUser;
            }
            catch (error) {
                console.error("Error creating user in UserService:", error);
                throw new Error("Failed to create user.");
            }
        });
    }
    // Modify user
    modifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("User to modify in service before processing:", user);
                // Vérifier si l'utilisateur existe
                const existingUserDTO = yield this.getUserById(user.getId());
                if (!existingUserDTO) {
                    throw new Error("User not found.");
                }
                // Convertir le DTO en entité User
                const existingUser = UserMapper_1.UserMapper.toEntity(existingUserDTO);
                // Comparer les données hors mot de passe
                const newUserData = {
                    email: user.getEmail(),
                    firstname: user.getFirstname(),
                    lastname: user.getLastname(),
                    pseudo: user.getPseudo(),
                    telnumber: user.getTelnumber()
                };
                const existingUserData = {
                    email: existingUser.getEmail(),
                    firstname: existingUser.getFirstname(),
                    lastname: existingUser.getLastname(),
                    pseudo: existingUser.getPseudo(),
                    telnumber: existingUser.getTelnumber()
                };
                let hasChanges = !lodash_1.default.isEqual(newUserData, existingUserData);
                // Vérifier si le mot de passe a changé
                const passwordManager = PasswordManager_1.PasswordManager.getInstance();
                const isPasswordValid = passwordManager.verifyPassword(user.getPassword(), existingUser.getSalt(), existingUser.getPassword());
                if (!isPasswordValid) {
                    hasChanges = true;
                    // Génération d'un nouveau hash uniquement si le mot de passe change
                    const newSalt = passwordManager.generateSalt();
                    const hashedPassword = passwordManager.hashPassword(user.getPassword(), newSalt);
                    user.setSalt(newSalt);
                    user.setPassword(hashedPassword);
                }
                // Si aucun changement, on ne fait rien
                if (!hasChanges) {
                    throw new Error("No changes detected.");
                }
                console.log("User to modify in service after processing:", user);
                // Mise à jour dans la base de données
                const updatedUser = yield this.userRepository.modifyUser(user);
                if (!updatedUser)
                    return null;
                // Retourner un DTO sans les données sensibles
                return UserMapper_1.UserMapper.toDTO(updatedUser);
            }
            catch (error) {
                console.error("Error modifying user in UserService:", error);
                throw new Error("Failed to modify user.");
            }
        });
    }
    // Delete user
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify if userId is provided
                if (!userId) {
                    throw new Error("User ID is required.");
                }
                // Find the user by ID
                const user = yield this.getUserById(userId);
                if (!user) {
                    console.error("User not found:", userId);
                    return false;
                }
                // Delete the user
                const isDeleted = yield this.userRepository.deleteUser(userId);
                // Return true if the user is deleted, false otherwise
                return isDeleted;
            }
            catch (error) {
                console.error("Error deleting user in UserService:", error);
                throw new Error("Failed to delete user.");
            }
        });
    }
}
exports.UserService = UserService;
