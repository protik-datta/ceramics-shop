import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

const PHONE_RE = /^01[3-9]\d{8}$/;

function normalizePhone(raw = '') {
  let p = String(raw).replace(/[\s-]/g, '');
  if (p.startsWith('+880')) p = '0' + p.slice(4);
  else if (p.startsWith('880')) p = '0' + p.slice(3);
  return p;
}

function validate(body) {
  const errors = {};
  const name = String(body.name || '').trim();
  const address = String(body.address || '').trim();
  const phone = normalizePhone(body.phone);
  if (name.length < 2 || name.length > 80) errors.name = 'সঠিক নাম লিখুন';
  if (!PHONE_RE.test(phone)) errors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)';
  if (address.length < 8 || address.length > 400) errors.address = 'সম্পূর্ণ ঠিকানা লিখুন';
  if (!body.productId || !mongoose.isValidObjectId(body.productId)) errors.productId = 'একটি ডিজাইন সিলেক্ট করুন';
  return { errors, name, phone, address };
}

export const createOrder = asyncHandler(async (req, res) => {
  const { errors, name, phone, address } = validate(req.body || {});
  if (Object.keys(errors).length) throw new ApiError(422, 'Validation failed', errors);

  const product = await Product.findOne({ _id: req.body.productId, active: true }).lean();
  if (!product) throw new ApiError(404, 'Product not found');

  const key = req.get('Idempotency-Key') || undefined;
  if (key) {
    const existing = await Order.findOne({ idempotencyKey: key }).lean();
    if (existing) return res.status(200).json({ success: true, duplicate: true, data: existing });
  }

  // Block identical orders (same phone + product) placed within 10 minutes
  const dedupeKey = `${phone}:${product._id}`;
  const recent = await Order.findOne({
    dedupeKey,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  }).lean();
  if (recent) {
    return res.status(409).json({
      success: false,
      message: 'এই নম্বর থেকে একই অর্ডার ইতিমধ্যে জমা হয়েছে',
      data: { orderId: recent._id },
    });
  }

  const total = product.price;
  const advance = product.advance;
  const order = await Order.create({
    product: product._id,
    productName: product.name,
    customer: { name, phone, address },
    total,
    advance,
    remaining: total - advance,
    idempotencyKey: key,
    dedupeKey,
  });

  res.status(201).json({ success: true, data: order });
});
