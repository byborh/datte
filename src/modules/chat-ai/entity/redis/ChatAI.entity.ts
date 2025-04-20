import { ChatAIContract } from "@modules/chat-ai/contracts/IChatAI";
import { ChatAIAbstract } from "../ChatAI.abstract";

export class ChatAIRedisEntity extends ChatAIAbstract {
    id: string;
    user_id: string;
    requestContent: string;
    responseContent: string;
    createdAt: Date;

    constructor(data: Partial<ChatAIContract>) {
        super(data.id, data.user_id, data.requestContent, data.responseContent, data.createdAt);
        
        this.id = data.id;
        this.user_id = data.user_id;
        this.requestContent = data.requestContent;
        this.responseContent = data.responseContent;
        this.createdAt = data.createdAt;
    }


    // Convert object to Redis hash
    toRedisHash(): { [key: string]: string } {
        return {
            id: this.id,
            user_id: this.user_id,
            requestContent: this.requestContent,
            responseContent: this.responseContent,
            createdAt: this.createdAt.toISOString() // à corriger
        }
    }

    // Covert Redis hash to object
    static fromRedisHash(hash: { [key: string]: string }) {
        return new ChatAIRedisEntity({
            id: hash.id,
            user_id: hash.user_id,
            requestContent: hash.requestContent,
            responseContent: hash.responseContent,
            createdAt: new Date(hash.createdAt)
        });
    }


    public getId(): string {return this.id;}
    public getUserId(): string {return this.user_id;}
    public getRequestContent(): string {return this.requestContent;}
    public getResponseContent(): string {return this.responseContent;}
    public getCreatedAt(): Date {return this.createdAt;}


    public setId(id: string): void {this.id = id;}
    public setUserId(userId: string): void {this.user_id = userId;}
    public setRequestContent(requestContent: string): void {this.requestContent = requestContent;}
    public setResponseContent(responseContent: string): void {this.responseContent = responseContent;}
    public setCreatedAt(createdAt: Date): void {this.createdAt = createdAt;}
}