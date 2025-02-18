export interface AuthTokenContract {
    id: string
    user_id: string
    token: string,
    createdAt: Date,
    expiresAt: Date
}