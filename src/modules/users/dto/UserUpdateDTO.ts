// DTO for updating functions, all fields are optional ! like this : email?: string etc
export interface UserUpdateDTO {
    id?: string;
    firstname?: string;
    lastname?: string;
    pseudo?: string;
    email?: string;
    telnumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
}