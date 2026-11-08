import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '304 pcs ডিনার সেট + 13 pcs কুকিং সেট' },
    price: { type: Number, required: true, default: 3500 },
    originalPrice: { type: Number, required: true, default: 5500 },
    advance: { type: Number, required: true, default: 350 },
    image: { type: String, required: true },
    badge: { type: String, default: '🎁 কম্বো' },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
