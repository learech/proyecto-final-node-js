import express from 'express';
import { 
    getCartByIdViewsController,
    getProductsViewsController, 
    getUserViewsController 
} from '../controllers/views.controllers.js';

const router = express.Router();

router.get('/', getUserViewsController);
router.get('/products', getProductsViewsController);
router.get('/cart/:cid', getCartByIdViewsController);


export default router;