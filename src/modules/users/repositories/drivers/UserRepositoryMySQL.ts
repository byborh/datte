import { User } from "@modules/users/entity/User.entity";
import { IUserRepository } from "../contract/IUserRepository";
import { Repository } from "typeorm";
import { AppDataSource } from "@db/AppDataSource";

export class UserRepositoryMySQL implements IUserRepository {
    private repository: Repository<User>;

    constructor() {this.repository = AppDataSource.getRepository(User);}

    async findUserByField(field: string, value: string): Promise<User | null> {
        // Validate field
        const allowedFields = ['id', 'email', 'first_name', 'last_name', 'pseudo', 'tel_number', 'createdAt', 'updatedAt'];
        if(!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // List of users finded by field
        const row = await this.repository.findOne({where: {[field]: value}});

        // Validate rows
        if (!row) return null;

        const user = Array.isArray(row) ? row[0] : row

        // Verify if all required fields are present
        if (!user.id || !user.email || !user.password) {
            console.error("Invalid user data:", user);
            throw new Error("User data is incomplete.");
        }

        // Map the result to a User instance
        return user || null;
    }
    
    async findUserById(userId: string): Promise<User | null> {
        if(!userId) return null;
        return await this.findUserByField('id', userId) || null;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        if(!email) return null;
        return await this.findUserByField('email', email) || null;
    }

    /**
     * Retrieves a user from the database based on multiple fields and their corresponding values.
     * This method is useful when you need to find a user using a combination of fields (e.g., email and username, or firstName and lastName).
     * 
     * @param fields - An array of field names (e.g., ['email', 'username']) to search by.
     * @param values - An array of values (e.g., ['test@example.com', 'john_doe']) corresponding to the fields.
     * 
     * @returns A Promise that resolves to the found User object if a match is found, or null if no user matches the conditions.
     * 
     * @example useage :
     * const user = await getUserByMultipleFields(['email', 'username'], ['test@example.com', 'john_doe']);
     * 
     * @throws This method does not throw errors directly, but the underlying repository might throw errors
     * if there are issues with the database connection or query execution.
     */
    async getUserByMultipleFields(fields: string[], values: string[]): Promise<User | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find user
        return await this.repository.findOne({where: conditions}) || null;
    }

    async getAllUsers(): Promise<User[]> {
        // Fetch all users from the database
        const rawResult: User[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        // Return the array of users
        return rowsArray;
    }  

    async createUser(user: User): Promise<User | null> {
        // Insert the user in the database
        const result = await this.repository.save(user);

        // If the user is not created, return null
        if (!result) return null;
    
        // Return the user
        return this.findUserById(user.getId()) || null;
    }

    async modifyUser(user: User): Promise<User | null> {
        // Be sur that user exists
        const existingUser: User = await this.repository.findOne({ where: { id: user.getId() } })
        if(!existingUser) return null;

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
        return !result ? false : true;
    }
   
}