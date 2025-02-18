import { User } from "../../entity/User.entity";

export interface IUserRepository {
    findUserByField(field: string, value: string): Promise<User | null>
    getAllUsers(): Promise<Array<User> | null>
    createUser(user: User): Promise<User | null>
    modifyUser(user: User): Promise<User | null>
    deleteUser(userId: string): Promise<boolean>
}