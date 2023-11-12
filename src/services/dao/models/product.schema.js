//@ts-check
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema(
  {
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true, },
    category: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100, unique: true },
    stock: { type: Number, required: true },
    thumbnail: { type: [String], required: false },
  },
  { versionKey: false}
);

productSchema.plugin(mongoosePaginate);

export const ProductsSchema = model('products', productSchema);
