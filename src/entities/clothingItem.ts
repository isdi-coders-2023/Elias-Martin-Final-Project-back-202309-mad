import { ImgData } from '../types/img.data.js';
import { User } from './user.js';

export type ClothingItem = {
  id: string;
  name: string;
  size: string;
  price: string;
  clothingItemHeight: string;
  clothingItemWidth: string;
  clothingItemFrontImg: ImgData;
  clothingItemBackImg: ImgData;
  tares: string;
  author: User;
};
