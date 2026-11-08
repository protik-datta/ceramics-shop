import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { connectDB } from './config/db.js';

const base = (process.env.CLIENT_PUBLIC_URL || 'http://localhost:5173').replace(/\/$/, '');
const items = [
  ['gold-border', 'গোল্ড বর্ডার কম্বো'],
  ['rose-flower', 'রোজ ফ্লাওয়ার কম্বো'],
  ['pink-rose', 'পিংক রোজ কম্বো'],
  ['green-leaf', 'গ্রিন লিফ কম্বো'],
  ['green-leaf-2', 'গ্রিন লিফ কম্বো-২'],
  ['mixed-floral', 'মিক্সড ফ্লোরাল কম্বো'],
  ['yellow-flower', 'ইয়েলো ফ্লাওয়ার কম্বো'],
  ['black-floral', 'ব্ল্যাক ফ্লোরাল কম্বো'],
  ['peach-flower', 'পিচ ফ্লাওয়ার কম্বো'],
  ['classic-1', 'ক্লাসিক কম্বো-১'],
  ['classic-2', 'ক্লাসিক কম্বো-২'],
  ['classic-3', 'ক্লাসিক কম্বো-৩'],
  ['classic-8', 'ক্লাসিক কম্বো-৪'],
];

await connectDB();
await Product.deleteMany({});
await Product.insertMany(
  items.map(([slug, name], i) => ({
    slug,
    name,
    image: `${base}/products/${slug}.jpg`,
    price: 3500,
    originalPrice: 5500,
    advance: 350,
    order: i + 1,
  }))
);
console.log(`Seeded ${items.length} products`);
await mongoose.disconnect();
