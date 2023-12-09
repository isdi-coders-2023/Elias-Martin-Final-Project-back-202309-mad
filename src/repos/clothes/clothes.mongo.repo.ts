import { ClothingItem } from '../../entities/clothingItem.js';
import { ClothingItemModel } from './clothes.mongo.model.js';
import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users/users.mongo.repo.js';
import mongoose from 'mongoose';

const debug = createDebug('EPV:clothes:mongo:repo');

export class ClothesMongoRepo implements Repository<ClothingItem> {
  usersRepo: UsersMongoRepo;
  constructor() {
    this.usersRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async search({
    key,
    value,
  }: {
    key: keyof ClothingItem;
    value: unknown;
  }): Promise<ClothingItem[]> {
    const result = await ClothingItemModel.find({ [key]: value })
      .populate('author', {
        clothes: 0,
      })
      .exec();
    return result;
  }

  async getAll(): Promise<ClothingItem[]> {
    const result = await ClothingItemModel.find()
      .populate('author', {
        clothes: 0,
      })
      .exec();
    return result;
  }

  async getById(id: string): Promise<ClothingItem> {
    const result = await ClothingItemModel.findById(id)
      .populate('author', {
        clothes: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<ClothingItem, 'id'>): Promise<ClothingItem> {
    const userID = newItem.author.id;
    const user = await this.usersRepo.getById(userID);
    const result: ClothingItem = await ClothingItemModel.create({
      ...newItem,
      author: userID,
    });
    // Esto está mal porque no quiero que me lo añada al carrito al crearlo
    user.clothes.push(result);
    await this.usersRepo.update(userID, user);
    return result;
  }

  async update(
    id: string,
    updatedItem: Partial<ClothingItem>
  ): Promise<ClothingItem> {
    const result = await ClothingItemModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('author', {
        clothes: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await ClothingItemModel.findByIdAndDelete(id)
      .populate('author', {
        clothes: 0,
      })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const userID = result.author.id;
    const user = await this.usersRepo.getById(userID);
    user.clothes = user.clothes.filter((item) => {
      const itemID = item as unknown as mongoose.mongo.ObjectId;
      return itemID.toString() !== id;
    });
    await this.usersRepo.update(userID, user);
  }
}
