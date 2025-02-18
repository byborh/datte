// Interface of the user
export interface UserContract {
    id: string;
    firstname?: string;
    lastname?: string;
    pseudo?: string;
    email: string;
    password: string;
    salt: string;
    telnumber?: string;
    createdAt: Date;
    updatedAt: Date;
}