import { UserMongoEntity } from "@modules/users/entity/mongo/User.entity";
import { IUserRepository } from "../contract/IUserRepository";
import { Repository } from "typeorm";
import { IDatabase } from "@db/contract/IDatabase";
import { MongoDatabase } from "@db/drivers/mongo.datasource";

export class UserRepositoryMongo implements IUserRepository {
    private repository: Repository<UserMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(UserMongoEntity);
    }

    async findUserByField(field: string, value: string): Promise<UserMongoEntity | null> {
        // Validate field
        const allowedFields = ['id', 'email', 'first_name', 'last_name', 'pseudo', 'telnumber', 'createdAt', 'updatedAt'];
        if (!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // Find user by field
        const row = await this.repository.findOne({ where: { [field]: value } });

        // Validate row
        if (!row) return null;

        const user = Array.isArray(row) ? row[0] : row;

        // Verify if all required fields are present
        if (!user.id || !user.email || !user.password) {
            console.error("Invalid user data:", user);
            throw new Error("UserMongoEntity data is incomplete.");
        }

        // Return the user
        return user || null;
    }

    async findUserById(userId: string): Promise<UserMongoEntity | null> {
        if (!userId) return null;
        return await this.findUserByField('id', userId) || null;
    }

    async findUserByEmail(email: string): Promise<UserMongoEntity | null> {
        if (!email) return null;
        return await this.findUserByField('email', email) || null;
    }

    async getUserByMultipleFields(fields: string[], values: string[]): Promise<UserMongoEntity | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        });

        // Find user
        return await this.repository.findOne({ where: conditions }) || null;
    }

    async getAllUsers(): Promise<UserMongoEntity[]> {
        // Fetch all users from the database
        const rawResult: UserMongoEntity[] = await this.repository.find();

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        // Return the array of users
        return rowsArray;
    }

    async createUser(user: UserMongoEntity): Promise<UserMongoEntity | null> {
        // Insert the user in the database
        const result = await this.repository.save(user);

        // If the user is not created, return null
        if (!result) return null;

        // Return the user
        return this.findUserById(user.getId()) || null;
    }

    async modifyUser(user: UserMongoEntity): Promise<UserMongoEntity | null> {
        // Be sure that user exists
        const existingUser: UserMongoEntity | null = await this.repository.findOneBy({ id: user.getId() });
        if (!existingUser) return null;

        // Merge user data with existing user data
        this.repository.merge(existingUser, user);

        // Save the modified user
        const result = await this.repository.save(existingUser);

        // Return the user
        return this.findUserById(user.getId()) || null;
    }

    async deleteUser(userId: string): Promise<boolean> {
        const result = await this.repository.delete(userId);

        // Return true if the user is deleted, false otherwise
        return !!result.affected; // `affected` indique le nombre de lignes supprimées
    }
}