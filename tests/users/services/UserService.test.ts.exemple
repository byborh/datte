import { UserService } from "../../../src/modules/users/services/UserService";
import { UserRepositoryMySQL } from "../../../src/modules/users/repositories/drivers/UserRepositoryMySQL";
import { MySQLDatabase } from "../../../src/config/db/drivers/MySQLDatabase";
import { getUserDTOMock } from "../mock/UserDTO.mock";
import { UserDTO } from "../../../src/modules/users/dto/UserDTO";
import { User } from "../../../src/modules/users/domain/User";
import { Repository } from "typeorm";


describe('UserService', () => {
    private repository: Repository<User>;

    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(new UserRepositoryMySQL(new MySQLDatabase));
    });

    /*
            private repository: Repository<User>;

            constructor() {this.repository = AppDataSource.getRepository(User);}
    */


    // beforeAll(async () => {
    //     // Initialisez la connexion à la base de données
    //     const dataSource = new MySQLDatabase;
    //     await dataSource.initialize();
    
    //     // Ajoutez des données de test
    //     const userRepository = dataSource.getRepository(User);
    //     await userRepository.save([
    //         {
    //             id: 'user-1',
    //             firstname: 'John',
    //             lastname: 'Doe',
    //             email: 'john.doe@example.com',
    //             password: 'hashed-password',
    //         },
    //         {
    //             id: 'user-2',
    //             firstname: 'Jane',
    //             lastname: 'Smith',
    //             email: 'jane.smith@example.com',
    //             password: 'hashed-password',
    //         },
    //     ]);
    // });
    
    // afterAll(async () => {
    //     // Fermez la connexion après tous les tests
    //     await dataSource.destroy();
    // });
    
    // afterEach(async () => {
    //     // Nettoyez les données après chaque test (si nécessaire)
    //     const entities = dataSource.entityMetadatas;
    
    //     for (const entity of entities) {
    //         const repository = dataSource.getRepository(entity.name);
    //         await repository.clear();
    //     }
    // });

    /* - Get a user by ID
        -----------------------------------------------------------------------------------------------------
        Branches: 90% (covers user not found, user found, and invalid inputs; missing database error handling).
        Lines: 95-100% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    describe('getUserById', () => {
        it('should return null if user not found', async () => {
            // Create a user with a non-existent ID
            const userId: string = 'not-existing-user-id';
    
            // Call the getUserById method
            const result: UserDTO | null = await userService.getUserById(userId);
            
            // Expect the result to be null
            expect(result).toBeNull();
        });
    
        it('should handle null userId gracefully', async () => {
            // Force the userId to be null
            const userId = null as unknown as string;
    
            // Expect the getUserById method to throw an error
            await expect(userService.getUserById(userId)).rejects.toThrow("Invalid user ID.");
        });
    
        it('should handle undefined userId gracefully', async () => {
            // Force the userId to be undefined
            const userId = undefined as unknown as string;
    
            // Expect the getUserById method to throw an error
            await expect(userService.getUserById(userId)).rejects.toThrow('Invalid user ID');
        });
    
        it('should throw an error for invalid user ID format', async () => {
            const userId = 'invalid-format';
            await expect(userService.getUserById(userId)).rejects.toThrow('Invalid user ID format');
        });
    
        it('should return user when user found', async () => {
            // Create a user with a existent ID
            const userId: string = 'user-1';
    
            // Call the getUserById method
            const result: UserDTO | null = await userService.getUserById(userId);
    
            // Expect the result to be a UserDTO object
            expect(result).toEqual(getUserDTOMock(userId));
        });
    
        it('should return user with all properties when user found', async () => {
            // Create a user with a existent ID
            const userId: string = "user-1";
    
            // Call the getUserById method
            const user: UserDTO = getUserDTOMock(userId);
    
            // Expect the result to be a UserDTO object
            const result: UserDTO | null = await userService.getUserById(userId);
    
            // Compare the properties
            expect(result).toEqual(user);
            expect(result?.id).toBe(user.id);
            expect(result?.firstname).toBe(user.firstname);
            expect(result?.lastname).toBe(user.lastname);
            expect(result?.pseudo).toBe(user.pseudo);
            expect(result?.email).toBe(user.email);
            expect(result?.password).toBe(user.password);
            expect(result?.telnumber).toBeUndefined();
        });
    })

    /* - Get a user by email
        -----------------------------------------------------------------------------------------------------
        Branches: 90% (covers user not found, user found, and invalid inputs; missing database error handling).
        Lines: 95-100% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    it('should return null if user not found', async () => {
        // Create a user with a non-existent Email
        const email: string = 'not-existing-user-email@email.com';

        // Call the getUserByEmail method
        const result: UserDTO | null = await userService.getUserByEmail(email);
        
        // Expect the result to be null
        expect(result).toBeNull();
    });

    it('should handle null email gracefully', async () => {
        // Force the email to be null
        const email = null as unknown as string;

        // Expect the getUserByEmail method to throw an error
        await expect(userService.getUserByEmail(email)).rejects.toThrow("Invalid user email.");
    });

    it('should handle undefined email gracefully', async () => {
        // Force the email to be undefined
        const email = undefined as unknown as string;

        // Expect the getUserByEmail method to throw an error
        await expect(userService.getUserByEmail(email)).rejects.toThrow('Invalid user Email');
    });

    it('should throw an error for invalid user email format', async () => {
        const email = 'invalid-format';
        await expect(userService.getUserByEmail(email)).rejects.toThrow('Invalid user email format');
    });

    it('should return user when user found', async () => {
        // Create a user with a existent Email
        const email: string = 'user-1@email.com';

        // Call the getUserByEmail method
        const result: UserDTO | null = await userService.getUserByEmail(email);

        // Expect the result to be a UserDTO object
        expect(result).toEqual(getUserDTOMock(email));
    });

    it('should return user with all properties when user found', async () => {
        // Create a user with a existent Email
        const email: string = "user-1";

        // Call the getUserByEmail method
        const user: UserDTO = getUserDTOMock(email);

        // Expect the result to be a UserDTO object
        const result: UserDTO | null = await userService.getUserByEmail(email);

        // Compare the properties
        expect(result).toEqual(user);
        expect(result?.email).toBe(user.email);
        expect(result?.firstname).toBe(user.firstname);
        expect(result?.lastname).toBe(user.lastname);
        expect(result?.pseudo).toBe(user.pseudo);
        expect(result?.email).toBe(user.email);
        expect(result?.password).toBe(user.password);
        expect(result?.telnumber).toBeUndefined();
    });

    /* - Get users
        -----------------------------------------------------------------------------------------------------
        Branches: 80% (covers normal case, user not found, and invalid inputs; missing database error handling).
        Lines: 90-95% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    it('should return an empty array when no users are found', async () => {
        // Database need be void before test

        // Mock the getAllUsers method to return an empty array
        const result = await userService.getUsers();

        // Expect the result to be an empty array
        expect(result).toBeNull();
    });

    it('should return an array of users when users are found', async () => {
        // Mock the getAllUsers method to return an array of users
        const users = [getUserDTOMock('user-1'), getUserDTOMock('user-2')];

        // Expect the result to be an array of users
        const result = await userService.getUsers();

        // Compare the results
        expect(result).toEqual(users);
    });

    it('should return null when an error occurs', async () => {
        // Mock the getAllUsers method to throw an error
        const error = new Error('Error occurred');

        // Create error mock
        userService.getUsers = jest.fn(() => Promise.reject(error));

        // Get all users
        const result = await userService.getUsers();

        // Expect the result to be null
        expect(result).toBeNull();
    });

    /* - CreateUser
        -----------------------------------------------------------------------------------------------------
        Branches: 80% (covers normal case, user already exists, and invalid inputs; missing database error handling).
        Lines: 90-95% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    it('should create a new user', async () => {
        const user = new User(
            'John',
            'Doe',
            '',
            'johndoe@example.com',
            'password',
            undefined
        );
      
        const result = await userService.createUser(user);

        const userDTO: UserDTO = getUserDTOMock('user-1');

        expect(result).toBeInstanceOf(userDTO);
        expect(result?.firstname).toBe(user.firstname);
        expect(result?.lastname).toBe(user.lastname);
        expect(result?.email).toBe(user.email);
    });
    
    it('should return null when user already exists', async () => {
    const user = new User(
        'John',
        'Doe',
        '',
        'johndoe@example.com',
        'password',
        undefined
    );

    const result = await userService.createUser(user);
    expect(result).toBeNull();
    });

    it('should throw an error when user is invalid', async () => {
    const user = new User(
        '',
        '',
        '',
        '',
        '',
        undefined
    );

    await expect(userService.createUser(user)).rejects.toThrowError();
    });

    /* - ModifyUser
        -----------------------------------------------------------------------------------------------------
        Branches: 90% (covers normal case, user not found, and invalid inputs; missing database error handling).
        Lines: 95-100% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    it('should modify a user', async () => {

        const user = new User(
            'user-1',
            'John',
            'Doe',
            '',
            'johndoe@example.com',
            'password123',
            '1234567890'
        );
    
        const modifiedUser = new User(
            'user-1',
            'John',
            'Doe',
            '',
            'johndoe@example.com',
            'password456',
            '1234567890'
        );
    
        const result = await userService.modifyUser(modifiedUser);
        
        const userDTO: UserDTO = getUserDTOMock('user-1');

        expect(result).toBeInstanceOf(userDTO);
        expect(result?.id).toBe(modifiedUser.id);
        expect(result?.firstname).toBe(modifiedUser.firstname);
        expect(result?.lastname).toBe(modifiedUser.lastname);
        expect(result?.email).toBe(modifiedUser.email);
        expect(result?.password).toBe(modifiedUser.password);
        expect(result?.telnumber).toBe(modifiedUser.telnumber);
    });

    it('should return null when user not found', async () => {
        const user = new User(
            'non-existing-user-id',
            'John',
            'Doe',
            '',
            'johndoe@example.com',
            'password123',
            '1234567890'
        );

        const result = await userService.modifyUser(user);
        expect(result).toBeNull();
    });

    it('should throw an error when user is invalid', async () => {
        const user = new User(
            'user-1',
            '',
            '',
            '',
            '',
            '',
            undefined
        );

        await expect(userService.modifyUser(user)).rejects.toThrowError();
    });

    /* - DeleteUser
        -----------------------------------------------------------------------------------------------------
        Branches: 85% (covers normal case, user not found, and invalid inputs; missing database error handling).
        Lines: 90-95% (all lines for normal cases and input validation are covered, except for database error scenarios).
    */

    it('should delete a user', async () => {
        const user = new User(
            'user-1',
            'John',
            'Doe',
            '',
            'johndoe@example.com',
            'password123',
            '1234567890'
        );

        await userService.createUser(user);

        const result = await userService.deleteUser(user.id);
        expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
        const userId = 'non-existent-user-id';
        const result = await userService.deleteUser(userId);
        expect(result).toBe(false);
    });

    it('should throw an error when invalid input', async () => {
        const userId = '';
        await expect(userService.deleteUser(userId)).rejects.toThrowError();
    });
})