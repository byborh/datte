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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryMySQL = void 0;
const User_1 = require("@modules/users/domain/User");
const AppDataSource_1 = require("@db/drivers/AppDataSource");
class UserRepositoryMySQL {
    constructor() {
        this.repository = AppDataSource_1.AppDataSource.getRepository(User_1.User);
    }
    findUserByField(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate field
                const allowedFields = ['id', 'email', 'firstname', 'lastname', 'pseudo', 'telnumber', 'createdAt', 'updatedAt'];
                if (!allowedFields.includes(field))
                    throw new Error(`Invalid field: ${field}`);
                // List of users finded by field
                const row = yield this.repository.findOne({ where: { [field]: value } });
                // Validate rows
                if (!row) {
                    console.error("No user found for field:", field, "with value:", value);
                    return null;
                }
                ;
                const user = Array.isArray(row) ? row[0] : row;
                console.log("User found:", user);
                // Verify if all required fields are present
                if (!user.id || !user.email || !user.password) {
                    console.error("Invalid user data:", user);
                    throw new Error("User data is incomplete.");
                }
                // Map the result to a User instance
                return user;
            }
            catch (error) {
                console.error("Error finding user by field:", error);
                throw new Error("Failed to find user by field.");
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId)
                    return null;
                console.log("User to find by id in repository:", this.findUserByField('id', userId));
                return yield this.findUserByField('id', userId);
            }
            catch (error) {
                console.error("Error finding user by id:", error);
                throw new Error("Failed to find user by id.");
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email)
                    return null;
                return yield this.findUserByField('email', email);
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw new Error("Failed to find user by email.");
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all users from the database
                const [rawResult] = yield this.repository.find();
                const rows = Array.isArray(rawResult) ? rawResult : [rawResult];
                // Verify if rows are an array or a single object
                const rowsArray = Array.isArray(rows) ? rows : [rows]; // if single object, insert in an array
                if (rowsArray.length === 0) {
                    console.error("No users found in the database.");
                    return [];
                }
                // Utiliser le UserMapper pour mapper chaque ligne en une entité User
                return rowsArray.map(row => row);
            }
            catch (error) {
                console.error("Error getting users:", error);
                throw new Error("Failed to get users.");
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Insert the user in the database
                const result = this.repository.create(user);
                // If the user is not created, return null
                if (!result)
                    return null;
                // Return the user
                return this.findUserById(user.getId());
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw new Error("Failed to create user");
            }
        });
    }
    modifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.insert(user);
                if (!result)
                    return null;
                return this.findUserById(user.getId());
            }
            catch (error) {
                console.error("Error modifying user:", error);
                throw new Error("Failed to modify user.");
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.delete(userId);
                // Return true if the user is deleted, false otherwise
                return !result ? false : true;
            }
            catch (error) {
                console.error("Error deleting user:", error);
                throw new Error("Failed to delete user.");
            }
        });
    }
}
exports.UserRepositoryMySQL = UserRepositoryMySQL;
