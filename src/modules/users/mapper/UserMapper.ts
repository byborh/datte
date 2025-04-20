import { UserDTO } from "../dto/UserDTO";
import { UserContract } from "../contracts/IUser";
import { getDatabase } from "@db/DatabaseClient";
import { UserRepositorySQL } from "../repositories/drivers/UserRepositorySQL";
import { UserRepositoryRedis } from "../repositories/drivers/UserRepositoryRedis";
import { getRepository } from "@core/db/databaseGuards";
import { IUserRepository } from "../repositories/contract/IUserRepository";
import { UserRedisEntity } from "../entity/redis/User.entity";
import { UserAbstract } from "../entity/User.abstract";
import { UserRepositoryMongo } from "../repositories/drivers/UserRepositoryMongo";

export class UserMapper {
    private static userRepository: IUserRepository;

    // Initialize the repository
    private static async initRepository() {
        if(!this.userRepository) {
            const myDB = await getDatabase();

            // Il faut passer par le repository, c'est mieux !
            this.userRepository = getRepository(myDB, UserRepositorySQL, UserRepositoryRedis, UserRepositoryMongo) as IUserRepository;
        }
    }

    // Transform the dto to the entity
    static async toEntity(dto: UserDTO): Promise<UserAbstract> {
        if (!dto.id) throw new Error("User ID is required.");

        // Be sur that the repository is initialized
        await this.initRepository();
        
        // Get existing user from the database
        const existingUser: UserAbstract | null = await this.userRepository.findUserById(dto.id);

        if (!existingUser) throw new Error("User not found.");

        return ({
            id: dto.id,
            email: dto.email,
            password: existingUser.password, // Let password unchanged
            salt: existingUser.salt, // Let salt unchanged
            firstname: dto.firstname || null,
            lastname: dto.lastname || null,
            pseudo: dto.pseudo || null,
            telnumber: dto.telnumber || null,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        } as UserAbstract);
    }

    static async toRedisEntity(userDTO: UserDTO): Promise<UserRedisEntity> {
        if (!userDTO.id) throw new Error("User ID is required.");

        // Be sur that the repository is initialized
        await this.initRepository();
        
        // Get existing user from the database
        const existingUser: UserContract | null = await this.userRepository.findUserById(userDTO.id);

        if (!existingUser) throw new Error("User not found.");
        
        return new UserRedisEntity({
            id: userDTO.id,
            email: userDTO.email,
            password: existingUser.password, // Let password unchanged
            salt: existingUser.salt, // Let salt unchanged
            firstname: userDTO.firstname || null,
            lastname: userDTO.lastname || null,
            pseudo: userDTO.pseudo || null,
            telnumber: userDTO.telnumber || null,
            createdAt: userDTO.createdAt,
            updatedAt: userDTO.updatedAt
    });
    }


    // Transform the entity to the dto
    static toDTO(user: UserContract): UserDTO { return user.toDto(); }
}
