import { ImgData } from '../types/img.data.js';
import { ClothingItem } from './clothingItem.js';

export type LoginUser = {
  email: string;
  passwd: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  clothes: ClothingItem[];
  avatar: ImgData;
  role: 'Admin' | 'User';
};
