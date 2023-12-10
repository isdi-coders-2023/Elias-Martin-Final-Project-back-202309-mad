import { ClothesMongoRepo } from './clothes.mongo.repo';
import { ClothingItemModel } from './clothes.mongo.model';
import { ClothingItem } from '../../entities/clothingItem';
import { UsersMongoRepo } from '../users/users.mongo.repo';
import { HttpError } from '../../types/http.error';

jest.mock('./clothes.mongo.model.js');

describe('Given ClothesMongoRepo', () => {
  let repo: ClothesMongoRepo;

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
      ClothingItemModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      ClothingItemModel.create = jest.fn().mockResolvedValue('Test');
      repo = new ClothesMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest
        .fn()
        .mockResolvedValue({ clothes: [] });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.create({ author: {} } as Omit<
        ClothingItem,
        'id'
      >);
      expect(result).toBe('Test');
    });

    test('Then it should execute search', async () => {
      const result = await repo.search({ key: 'size', value: 'M' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await repo.update('', { name: 'Bomber' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
    // Test('Then it should execute delete', async () => {
    //   const result = await repo.delete('');
    //   expect(exec).toHaveBeenCalled();
    //   expect(result).toBe('Test');
    // });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest
      .fn()
      .mockRejectedValue(
        new HttpError(404, 'Not Found', 'Delete not possible')
      );
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
      repo = new ClothesMongoRepo();
    });

    test('Then getById should throw an error', async () => {
      expect(repo.getById('')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Delete not possible')
      );
    });
    test('Then update should throw an error', async () => {
      expect(repo.update('', { name: 'Bomber' })).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Delete not possible')
      );
    });
    test('Then delete should throw an error', async () => {
      expect(repo.delete('')).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Delete not possible')
      );
    });
  });
});
