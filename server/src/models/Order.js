import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    customer: {
      name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
      phone: { type: String, required: true, match: /^01[3-9]\d{8}$/ },
      address: { type: String, required: true, trim: true, minlength: 8, maxlength: 400 },
    },
    total: { type: Number, required: true },
    advance: { type: Number, required: true },
    remaining: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    idempotencyKey: { type: String, index: true, sparse: true },
    dedupeKey: { type: String, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
