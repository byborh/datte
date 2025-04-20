export interface ChatAIContract {
    id: string
    user_id: string,
    requestContent: string,
    responseContent: string,
    createdAt: Date,
}