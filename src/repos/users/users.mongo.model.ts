import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';

const usersSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  age: {
    type: Number,
  },
  clothes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ClothingItem',
    },
  ],
  avatar: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'User'],
    default: 'User',
  },
});

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
