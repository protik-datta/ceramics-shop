import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

const STATUSES = ['pending', 'confirmed', 'cancelled'];
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function orderFilter(q) {
  const f = {};
  if (q.status && STATUSES.includes(q.status)) f.status = q.status;
  if (q.search) {
    const r = new RegExp(esc(String(q.search).trim()), 'i');
    f.$or = [{ 'customer.name': r }, { 'customer.phone': r }, { productName: r }];
  }
  if (q.from || q.to) {
    f.createdAt = {};
    if (q.from) f.createdAt.$gte = new Date(`${q.from}T00:00:00+06:00`);
    if (q.to) f.createdAt.$lte = new Date(`${q.to}T23:59:59.999+06:00`);
  }
  return f;
}

export const stats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [byStatus, revenue, today] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, revenue: { $sum: '$total' }, advance: { $sum: '$advance' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  byStatus.forEach((b) => (counts[b._id] = b.count));
  res.json({
    success: true,
    data: {
      total: Object.values(counts).reduce((a, b) => a + b, 0),
      ...counts,
      revenue: revenue[0]?.revenue || 0,
      advance: revenue[0]?.advance || 0,
      today,
    },
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const filter = orderFilter(req.query);
  const [data, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, data, page, limit, total, pages: Math.ceil(total / limit) || 1 });
});

const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = "'" + s; // neutralize spreadsheet formulas
  return `"${s.replace(/"/g, '""')}"`;
};

export const exportOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find(orderFilter(req.query)).sort({ createdAt: -1 }).limit(5000).lean();
  const head = ['Order ID', 'Date', 'Product', 'Name', 'Phone', 'Address', 'Total', 'Advance', 'Remaining', 'Status'];
  const rows = orders.map((o) => [
    o._id, new Date(o.createdAt).toISOString(), o.productName, o.customer.name, o.customer.phone,
    o.customer.address, o.total, o.advance, o.remaining, o.status,
  ]);
  const csv = '﻿' + [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="orders.csv"' });
  res.send(csv);
});

export const getOrder = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id).lean();
  if (!o) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: o });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) throw new ApiError(422, 'Validation failed', { status: 'Invalid status' });
  const o = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!o) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: o });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const o = await Order.findByIdAndDelete(req.params.id);
  if (!o) throw new ApiError(404, 'Order not found');
  res.json({ success: true });
});

// ---------- products ----------
function productInput(body, partial = false) {
  const errors = {};
  const out = {};
  const str = (k, min = 1, max = 300) => {
    if (body[k] === undefined) return !partial && (errors[k] = 'Required');
    const v = String(body[k]).trim();
    if (v.length < min || v.length > max) errors[k] = `Must be ${min}-${max} characters`;
    else out[k] = v;
  };
  const num = (k) => {
    if (body[k] === undefined) return !partial && (errors[k] = 'Required');
    const v = Number(body[k]);
    if (!Number.isFinite(v) || v < 0) errors[k] = 'Must be a positive number';
    else out[k] = v;
  };
  str('name', 2, 120);
  str('image', 1, 500);
  if (body.description !== undefined) str('description', 0, 300);
  if (body.badge !== undefined) str('badge', 0, 40);
  ['price', 'originalPrice', 'advance', 'order'].forEach((k) => (k === 'order' ? body[k] !== undefined && num(k) : num(k)));
  if (body.active !== undefined) out.active = !!body.active;
  if (out.image && !/^(https?:\/\/|\/)/.test(out.image)) errors.image = 'Use an http(s) URL or a /path';
  if (out.advance !== undefined && out.price !== undefined && out.advance > out.price) errors.advance = 'Advance cannot exceed price';
  if (Object.keys(errors).length) throw new ApiError(422, 'Validation failed', errors);
  return out;
}

export const adminListProducts = asyncHandler(async (req, res) => {
  const data = await Product.find().sort({ order: 1 }).lean();
  res.json({ success: true, count: data.length, data });
});

export const adminCreateProduct = asyncHandler(async (req, res) => {
  const input = productInput(req.body || {});
  const slug = `${(req.body.slug || '').toString().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'combo'}-${Date.now().toString(36)}`;
  if (input.order === undefined) input.order = (await Product.countDocuments()) + 1;
  const p = await Product.create({ ...input, slug });
  res.status(201).json({ success: true, data: p });
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid ID');
  const input = productInput(req.body || {}, true);
  const p = await Product.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true }).lean();
  if (!p) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: p });
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true }).lean();
  if (!p) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: p });
});
