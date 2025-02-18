import { UserContract } from "../contracts/IUser";

/*
    The password is optional.
    It's required only in requests (e.g., creating a new user).
    But it's NOT required in responses (e.g., when getting a user).
    More secure to exclude it from responses.
*/
export interface UserDTO extends Omit<UserContract, "password" | "salt"> {}
