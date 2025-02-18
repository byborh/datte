import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "@modules/users/entity/User.entity";
import { Role } from "@modules/roles/entity/Role.entity";
import { Permission } from "@modules/permissions/entity/Permission.entity";
import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { RolePermissions } from "@modules/role-permissions/entity/RolePermissions.entity";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "datte",
    entities: [User, Role, Permission, UserRoles, RolePermissions, AuthToken], // ADD ALL ENTITIES
    synchronize: process.env.NODE_ENV !== "production", // ATTENTION
    logging: process.env.NODE_ENV === "development", // ATTENTION
});

// Cette fonction gère l'initialisation de la base de données
export const initDatabase = async (): Promise<void> => {
    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log("📌 Database connected");
        } catch (error) {
            console.error("Erreur de connexion à la base :", error);
        }
    }
};