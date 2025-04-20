import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { ChatAIAbstract } from "../ChatAI.abstract";
import { ChatAIContract } from "@modules/chat-ai/contracts/IChatAI";
import { UserSQLEntity } from "@modules/users/entity/sql/User.entity";


@Entity("chat_ai")
export class ChatAISQLEntity extends ChatAIAbstract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ type: "varchar", length: 255 })
    user_id: string;

    @Column({ type: "varchar", length: 1024 })
    requestContent: string;

    @Column({ type: "varchar", length: 8192})
    responseContent: string;

    @Column({ type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => UserSQLEntity, user => user.chatAISQLEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: UserSQLEntity;

    /*
    ----------------------------------------------------------------------------------
        Add liaisons here with other Entities
        Ex :
            - @OneToMany
                entityName: EntityName
            - @OneToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
    ----------------------------------------------------------------------------------
    */

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