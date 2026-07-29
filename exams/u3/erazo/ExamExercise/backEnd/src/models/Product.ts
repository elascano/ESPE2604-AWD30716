import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
