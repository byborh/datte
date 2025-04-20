import { ChatAIContract } from "../contracts/IChatAI";

export abstract class ChatAIAbstract implements ChatAIContract {
    id: string;
    user_id: string;
    requestContent: string;
    responseContent: string;
    createdAt: Date;
    
    constructor(id: string, user_id: string, requestContent: string, responseContent: string, createdAt: Date) {
        this.id = id;
        this.user_id = user_id;
        this.requestContent = requestContent;
        this.responseContent = responseContent;
        this.createdAt = createdAt;
    }

    getId(): string {return this.id;}
    getUserId(): string {return this.user_id;}
    getRequestContent(): string {return this.requestContent;}
    getResponseContent(): string {return this.responseContent;}
    getCreatedAt(): Date {return this.createdAt;}

    setId(id: string): void {this.id = id;}
    setUserId(userId: string): void {this.user_id = userId;}
    setRequestContent(requestContent: string): void {this.requestContent = requestContent;}
    setResponseContent(responseContent: string): void {this.responseContent = responseContent;}
    setCreatedAt(createdAt: Date): void {this.createdAt = createdAt;}
}