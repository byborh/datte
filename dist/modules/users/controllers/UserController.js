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
exports.UserController = void 0;
const User_1 = require("../domain/User");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // Get a user by ID
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDto = yield this.userService.getUserById(req.params.id);
                if (!userDto) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
                res.status(200).json(userDto);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all users
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getUsers();
                if (!users || users.length === 0) {
                    res.status(404).json({ error: "No users found" });
                    return;
                }
                res.status(200).json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Create a user
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstname, lastname, pseudo, telnumber } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: "Email and password are required." });
                    return;
                }
                const user = new User_1.User({
                    id: req.params.id,
                    email,
                    password,
                    salt: "", // À gérer correctement
                    firstname,
                    lastname,
                    pseudo,
                    telnumber,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                const createdUser = yield this.userService.createUser(user);
                if (!createdUser) {
                    res.status(400).json({ error: "User could not be created." });
                    return;
                }
                res.status(201).json(createdUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Modify a user
    modifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstname, lastname, pseudo, telnumber } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: "Email and password are required." });
                    return;
                }
                const user = new User_1.User({
                    id: req.params.id,
                    email,
                    password,
                    salt: "", // À gérer correctement
                    firstname,
                    lastname,
                    pseudo,
                    telnumber,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                console.log("User to modify in controller:", user);
                const updatedUser = yield this.userService.modifyUser(user);
                if (!updatedUser) {
                    res.status(404).json({ error: "User could not be modified." });
                    return;
                }
                res.status(200).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a user
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield this.userService.deleteUser(req.params.id);
                if (!isDeleted) {
                    res.status(404).json({ error: "User could not be deleted." });
                    return;
                }
                res.status(200).json({ message: "User deleted successfully." });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
