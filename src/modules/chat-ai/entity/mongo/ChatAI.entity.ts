import { Column, Entity, ObjectIdColumn, ManyToOne } from "typeorm";
import { ChatAIAbstract } from "../ChatAI.abstract";
import { ChatAIContract } from "@modules/chat-ai/contracts/IChatAI";
import { UserMongoEntity } from "@modules/users/entity/mongo/User.entity";


@Entity("chat_ai")
export class ChatAIMongoEntity extends ChatAIAbstract {
    @ObjectIdColumn()
    id: string;

    @Column()
    user_id: string;

    @Column()
    requestContent: string;

    @Column()
    responseContent: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => UserMongoEntity, user => user.chatAIMongoEntity, { onDelete: 'CASCADE' })
    user: UserMongoEntity;

    constructor(data?: Partial<ChatAIContract>) {
        super(
            data?.id ?? "",
            data?.user_id ?? "",
            data?.requestContent ?? "",
            data?.responseContent ?? "",
            data?.createdAt ?? new Date()
        );
    
        this.id = data?.id ?? "";
        this.user_id = data?.user_id ?? "";
        this.requestContent = data?.requestContent ?? "";
        this.responseContent = data?.responseContent ?? "";
        this.createdAt = data?.createdAt ?? new Date();
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