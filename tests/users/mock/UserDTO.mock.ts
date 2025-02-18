import { UserDTO } from "../../../src/modules/users/dto/UserDTO";

export const users: { [key: string]: any } = { // UserDTO
  'user-1': { // User with all fields
    id: 'user-1',
    firstname: 'John',
    lastname: 'Doe',
    pseudo: 'johndoe',
    email: 'johndoe@example.com',
    password: "undefined",
    telnumber: undefined,
  },
  'user-2': { // User with only required fields
    id: 'user-2',
    firstname: 'Jane',
    lastname: 'Smith',
    pseudo: '',
    email: 'janesmith@example.com',
    password: undefined,
    telnumber: undefined,
  },
  'user-3': { // User with all fields
    id: 'user-3',
    firstname: 'Emilia',
    lastname: 'Clarke',
    pseudo: '',
    email: 'beauty@got.com',
    password: "i love john snow",
    telnumber: undefined,
  },
  'user-4': { // User with the same mail than user-3
    id: 'user-4',
    firstname: '',
    lastname: '',
    pseudo: '',
    email: 'beauty@got.com',
    password: "i love john snow",
    telnumber: undefined,
  },
  'user-5': { // User with nothing
    id: 'user-5',
    firstname: '',
    lastname: '',
    pseudo: '',
    email: '',
    password: '',
    telnumber: '',
  },
  'user-6': { // User with nothing (only undefined)
    id: 'user-6',
    firstname: undefined,
    lastname: undefined,
    pseudo: undefined,
    email: "undefined",
    password: undefined,
    telnumber: undefined,
  },
};

export function getUserDTOMock(userId: string): UserDTO {
  return users[userId];
}