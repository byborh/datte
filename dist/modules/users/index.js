"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserModule = void 0;
const UserController_1 = require("./controllers/UserController");
const UserService_1 = require("./services/UserService");
const userRoutes_1 = require("./route/userRoutes");
const UserRepositoryMySQL_1 = require("./repositories/drivers/UserRepositoryMySQL");
const createUserModule = () => {
    const userRepositoryMySQL = new UserRepositoryMySQL_1.UserRepositoryMySQL();
    const userService = new UserService_1.UserService(userRepositoryMySQL);
    const userController = new UserController_1.UserController(userService);
    // Le contrôleur sera injecté dans les routes
    return (0, userRoutes_1.userRoutes)(userController);
};
exports.createUserModule = createUserModule;
