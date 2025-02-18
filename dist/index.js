"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const users_1 = require("./modules/users"); // Le module utilisateur
const errorHandler_1 = require("@middlewares/errorHandler");
const app = (0, express_1.default)();
const port = 3000;
// Middleware global
app.use(express_1.default.json());
// Add the user module
app.use('/api/v0.0.1/users', (0, users_1.createUserModule)());
// Add other modules HERE
// Middleware global of error
app.use(errorHandler_1.errorHandler);
// Landing page for the moment
app.get('/', (req, res) => {
    res.send('Welcome to Datte D1 ! \n Version 0.0.1 \n By DatteD1 \n http:localhost:3000/api/v0.0.1/users');
});
// Run the server
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
