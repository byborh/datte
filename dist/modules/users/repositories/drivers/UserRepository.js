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
exports.UserRepository = void 0;
const User_1 = require("../../domain/User");
class UserRepository {
    constructor() {
        // Une Fausse base de données
        // A MODIFIER
        // Il faut utiliser un service de base de données (MySQL, MongoDB, etc.)
        this.users = [
            // Liste des utilisateurs
            new User_1.User("RuigsFkjS1owzGCa", "John", "Doe", "johndoe", "XfV8I@example.com", "password1", "123-456-7890"),
            new User_1.User("RuigsFkjS1owzGCb", "Emilia", "Clarke", "khalisia", "beauty@got.com", "johnSnowILoveU", "321-656-7001"),
            new User_1.User("RuigsFkjS1owzGCc", "eminem@example.com", "slimshady", "")
        ];
    }
    // Find a user by field
    findUserByField(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.find(user => user[field] === value);
            return user || null;
        });
    }
    // Find a user by ID
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.find(user => user.getId() === userId);
            return user || null;
        });
    }
    // Find a user by Email
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.find(user => user.getEmail() === email);
            return user || null;
        });
    }
    // Find all users
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users || null;
        });
    }
    // Create user
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.users.push(user);
            return this.findUserById(user.getId());
        });
    }
    // Modify user
    modifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.users.findIndex(u => u.getId() === user.getId());
            if (index !== -1) {
                this.users[index] = user;
                return user;
            }
            return null; // L'utilisateur n'a pas été trouvé
        });
    }
    // Delete user
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.users.indexOf(user);
            if (index !== -1) {
                this.users.splice(index, 1);
                return true;
            }
            return false;
        });
    }
}
exports.UserRepository = UserRepository;
