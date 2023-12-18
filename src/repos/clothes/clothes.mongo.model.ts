import { Schema, model } from 'mongoose';
import { ClothingItem } from '../../entities/clothingItem.js';

const clothesSchema = new Schema<ClothingItem>({
  name: {
    type: String,
  },
  size: {
    type: String,
  },
  price: {
    type: String,
  },
  clothingItemHeight: {
    type: String,
  },
  clothingItemWidth: {
    type: String,
  },
  clothingItemFrontImg: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
  clothingItemBackImg: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
  tares: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

clothesSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const ClothingItemModel = model<ClothingItem>(
  'ClothingItem',
  clothesSchema,
  'clothes'
);
