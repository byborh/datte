import { UserRepositoryMySQL } from "../../../src/modules/users/repositories/drivers/UserRepositoryMySQL";
import { UserService } from "../../../src/modules/users/services/UserService";
import { UserController } from "../../../src/modules/users/controllers/UserController";
import { User } from "../../../src/modules/users/domain/User";

const userRepository = new UserRepositoryMySQL(null);
const userService = new UserService(userRepository);
const userController = new UserController(userService);


describe('UserService', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(new UserRepositoryMySQL(null));
    userController = new UserController(userService);
  });


//   it('should delete a user', async () => {
//     const user = new User(
//         'user-1',
//         'John',
//         'Doe',
//         'Joe',
//         'johndoe@example.com',
//         'password123',
//         '1234567890'
//     );

//     await userController.createUser(user);

//     const result = await userController.deleteUser(user.id);
//     expect(result).toBe(true);
//   });


//   it('should return false when user not found', async () => {
//     const userId = 'non-existent-user-id';
//     const result = await userController.deleteUser(userId);
//     expect(result).toBe(false);
//   });


//   it('should throw an error when invalid input', async () => {
//     const userId = '';
//     await expect(userController.deleteUser(userId)).rejects.toThrowError();
//   });
});