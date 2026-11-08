import { Router } from 'express';
import * as c from '../controllers/adminController.js';

const r = Router();
r.get('/stats', c.stats);
r.get('/orders/export', c.exportOrders);
r.get('/orders', c.listOrders);
r.get('/orders/:id', c.getOrder);
r.patch('/orders/:id', c.updateOrder);
r.delete('/orders/:id', c.deleteOrder);
r.get('/products', c.adminListProducts);
r.post('/products', c.adminCreateProduct);
r.patch('/products/:id', c.adminUpdateProduct);
r.delete('/products/:id', c.adminDeleteProduct);
export default r;
