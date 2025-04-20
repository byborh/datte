import { UserAbstract } from "@modules/users/entity/User.abstract";

export interface IUserRepository {
    findUserByField(field: string, value: string): Promise<UserAbstract | null>;
    findUserById(userId: string): Promise<UserAbstract | null>;
    findUserByEmail(email: string): Promise<UserAbstract | null>;
    getAllUsers(): Promise<Array<UserAbstract> | null>;
    createUser(user: UserAbstract): Promise<UserAbstract | null>;
    modifyUser(user: UserAbstract): Promise<UserAbstract | null>;
    deleteUser(userId: string): Promise<boolean>;
}