import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    max: 100,
  },
  lastName: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  age: {
    type: Number,
    required: false,
    max: 110,
  },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  cartId: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
});

schema.plugin(monsoosePaginate);
export const UserSchema = model('users', schema);
