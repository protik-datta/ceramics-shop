import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/productController.js';
import { createOrder } from '../controllers/orderController.js';

const router = Router();
router.get('/health', (req, res) => res.json({ success: true }));
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/orders', createOrder);
export default router;
