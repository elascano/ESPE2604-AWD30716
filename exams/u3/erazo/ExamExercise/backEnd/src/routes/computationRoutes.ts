import { Router } from 'express';
import { cartTotal, productIva, productExpiration, listProducts } from '../controllers/computationController';

const router = Router();

router.get('/products', listProducts);
router.post('/cart/total', cartTotal);
router.get('/products/:id/iva', productIva);
router.post('/products/:id/expiration', productExpiration);

export default router;
