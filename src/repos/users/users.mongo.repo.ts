/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { Repository } from '../repo';
import { LoginUser, User } from '../../entities/user.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('EPV:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  // NO IMPLEMENTADO
  update(_id: string, _updatedItem: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  // NO IMPLEMENTADO
  search({
    key,
    value,
  }: {
    key:
      | 'avatar'
      | 'id'
      | 'role'
      | 'name'
      | 'surname'
      | 'age'
      | 'shoppingCart'
      | keyof LoginUser;
    value: unknown;
  }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  // NO IMPLEMENTADO
  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
