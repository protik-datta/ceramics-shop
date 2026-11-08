import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort({ order: 1 }).lean();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ success: true, count: products.length, data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  const product = await Product.findOne({ ...query, active: true }).lean();
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});
