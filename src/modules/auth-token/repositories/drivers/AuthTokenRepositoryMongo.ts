import { IAuthTokenRepository } from "../contract/IAuthTokenRepository";
import { Repository } from "typeorm";
import { MongoDatabase } from "@db/drivers/mongo.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { AuthTokenMongoEntity } from "@modules/auth-token/entity/mongo/AuthToken.entity";

export class AuthTokenRepositoryMongo implements IAuthTokenRepository {
    private repository: Repository<AuthTokenMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(AuthTokenMongoEntity);
    }

    async createAuthToken(authToken: AuthTokenMongoEntity): Promise<AuthTokenMongoEntity> {
        const result = await this.repository.save(authToken);
        return result || null;
    }

    async getAuthTokenByUserId(userId: string): Promise<AuthTokenMongoEntity | null> {
        if (!userId) return null;
        return await this.repository.findOne({ where: { user_id: userId } }) || null;
    }

    async deleteAuthTokenByUserId(userId: string): Promise<boolean> {
        if (!userId) return false;
        const result = await this.repository.delete({ user_id: userId });
        return result.affected !== 0;
    }

    async getAllAuthTokens(): Promise<AuthTokenMongoEntity[]> {
        return await this.repository.find();
    }

    async deleteAuthTokenById(authTokenId: string): Promise<boolean> {
        if (!authTokenId) return false;
        const result = await this.repository.delete(authTokenId);
        return result.affected !== 0;
    }
}