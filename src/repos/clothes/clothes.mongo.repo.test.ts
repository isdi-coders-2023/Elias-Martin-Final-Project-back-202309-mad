import { ClothesMongoRepo } from './clothes.mongo.repo';
import { ClothingItemModel } from './clothes.mongo.model';
import { ClothingItem } from '../../entities/clothingItem';
import { UsersMongoRepo } from '../users/users.mongo.repo';
import { UserModel } from '../users/users.mongo.model';

jest.mock('./clothes.mongo.model.js');
jest.mock('../users/users.mongo.model.js');

describe('Given ClothesMongoRepo', () => {
  let clothesRepo: ClothesMongoRepo;

  describe('When we isntantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      ClothingItemModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      ClothingItemModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      ClothingItemModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      ClothingItemModel.create = jest.fn().mockResolvedValue('Test');
      clothesRepo = new ClothesMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await clothesRepo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await clothesRepo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest
        .fn()
        .mockResolvedValue({ clothes: [] });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await clothesRepo.create({ author: {} } as Omit<
        ClothingItem,
        'id'
      >);
      expect(result).toBe('Test');
    });

    test('Then it should execute search', async () => {
      const result = await clothesRepo.search({ key: 'size', value: 'M' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await clothesRepo.update('', { name: 'Bomber' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then should delete the clothingItem and remove it from the author clothes array', async () => {
      const id = 'testId';
      const exec = jest.fn().mockResolvedValue({});
      ClothingItemModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      await clothesRepo.delete(id);

      expect(ClothingItemModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      ClothingItemModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      ClothingItemModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      ClothingItemModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      clothesRepo = new ClothesMongoRepo();
    });

    test('Then getById should throw an error', async () => {
      expect(clothesRepo.getById('')).rejects.toThrow();
    });
    test('Then update should throw an error', async () => {
      expect(clothesRepo.update('', { name: 'Bomber' })).rejects.toThrow();
    });
    test('Then should throw an error if the clothingItem does not exist', async () => {
      const id = 'testId';
      ClothingItemModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      await expect(clothesRepo.delete(id)).rejects.toThrow();
    });
  });
});
