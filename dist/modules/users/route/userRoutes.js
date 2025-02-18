"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// src/modules/users/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const validateAttributeMiddleware_1 = require("@middlewares/validateAttributeMiddleware");
const lengthRequirementMiddleware_1 = require("@middlewares/lengthRequirementMiddleware");
const userRoutes = (userController) => {
    const router = express_1.default.Router();
    router.get('/:id', (0, validateAttributeMiddleware_1.validateAttributeMiddleware)('params', 'id', 'Id missing or invalid in request params.'), (req, res, next) => userController.getUserById(req, res, next));
    router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));
    router.post('/', (0, validateAttributeMiddleware_1.validateAttributeMiddleware)('body', 'email', 'Email missing or invalid in request body'), (0, validateAttributeMiddleware_1.validateAttributeMiddleware)('body', 'password', 'Password missing or invalid in request body'), (0, lengthRequirementMiddleware_1.lengthRequirementMiddleware)(8, 'password'), (0, lengthRequirementMiddleware_1.lengthRequirementMiddleware)(3, 'email'), (req, res, next) => userController.createUser(req, res, next));
    router.patch('/:id', (0, validateAttributeMiddleware_1.validateAttributeMiddleware)('params', 'id', 'Id missing or invalid in request params.'), (req, res, next) => userController.modifyUser(req, res, next));
    router.delete('/:id', (0, validateAttributeMiddleware_1.validateAttributeMiddleware)('params', 'id', 'Id missing or invalid in request params.'), (req, res, next) => userController.deleteUser(req, res, next));
    return router;
};
exports.userRoutes = userRoutes;
