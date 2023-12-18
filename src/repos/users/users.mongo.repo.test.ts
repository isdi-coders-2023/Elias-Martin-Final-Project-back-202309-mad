import { UsersMongoRepo } from './users.mongo.repo';
import { UserModel } from './users.mongo.model.js';
import { LoginUser, User } from '../../entities/user';
import { Auth } from '../../services/auth.js';

jest.mock('./users.mongo.model.js');
jest.mock('../../services/auth.js');

describe('Given UsersMongoRepo', () => {
  Auth.hash = jest.fn();
  Auth.compare = jest.fn().mockResolvedValue(true);
  let usersRepo: UsersMongoRepo;

  describe('When we isntantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
        exec,
      });

      UserModel.find = mockQueryMethod;
      UserModel.findById = mockQueryMethod;
      UserModel.findOne = mockQueryMethod;
      UserModel.findByIdAndUpdate = mockQueryMethod;
      UserModel.create = jest.fn().mockResolvedValue('Test');
      usersRepo = new UsersMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await usersRepo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      const result = await usersRepo.create({} as Omit<User, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute login', async () => {
      const result = await usersRepo.login({ email: '' } as LoginUser);
      expect(UserModel.findOne).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await usersRepo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await usersRepo.update('', { name: 'TestName' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      usersRepo = new UsersMongoRepo();
    });
    test('Then getById should throw an error', async () => {
      expect(usersRepo.getById('' as string)).rejects.toThrow();
    });
    test('Then login should throw an error', async () => {
      expect(usersRepo.login({} as User)).rejects.toThrow();
    });
    test('Then update should throw an error', async () => {
      expect(usersRepo.update('', {} as User)).rejects.toThrow();
    });
  });

  describe('When unimplemented methods are called', () => {
    beforeEach(() => {
      usersRepo = new UsersMongoRepo();
    });
    test('Given delete method is unimplemented', async () => {
      const deleteMethod = () => usersRepo.delete('');
      expect(deleteMethod).toThrow('Method not implemented.');
    });
    test('Given search method is unimplemented', async () => {
      const searchMethod = () => usersRepo.search({ key: 'id', value: '' });
      expect(searchMethod).toThrow('Method not implemented.');
    });
  });
});
