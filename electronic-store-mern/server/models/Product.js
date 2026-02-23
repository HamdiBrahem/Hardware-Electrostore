import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  badge: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [String],
  featured: { type: Boolean, default: false },
  countInStock: { type: Number, default: 10 },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
