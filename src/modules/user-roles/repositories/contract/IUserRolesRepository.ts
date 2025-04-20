import { UserRolesAbstract } from "@modules/user-roles/entity/UserRoles.abstract";

export interface IUserRolesRepository {
    /**
     * Retrieves user roles based on multiple fields and their corresponding values.
     * 
     * @param fields - An array of field names (e.g., ["user_id", "role_id"]) to filter by.
     * @param values - An array of values corresponding to the fields (e.g., ["123", "456"]).
     * @returns A promise that resolves to an array of UserRolesAbstract objects matching the criteria,
     *          or `null` if the input is invalid or no matches are found.
     */
    getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRolesAbstract[] | null>;

    /**
     * Retrieves all user roles from the database.
     * 
     * @returns A promise that resolves to an array of all UserRolesAbstract objects,
     *          or `null` if no roles are found or an error occurs.
     */
    getUserRoles(): Promise<UserRolesAbstract[] | null>;

    /**
     * Creates a new user role entry in the database.
     * 
     * @param userRoles - The UserRolesAbstract object containing the data to be created.
     * @returns A promise that resolves to the created UserRolesAbstract object,
     *          or `null` if the creation fails.
     */
    createUserRoles(userRoles: UserRolesAbstract): Promise<UserRolesAbstract | null>;


    /* 
    *
    *
    *  */
    deleteUserRolesByMultipleFields(fields: string[], values: string[]): Promise<boolean>;
}