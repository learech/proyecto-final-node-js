import express from 'express';
import {
    getAllCartsController,
    saveCartController,
    getCartByIdController,
    deleteCartByIdController,
    addToCartController,
    removeFromCartController,
    emptyCartByIdController,
    addQtyToCartController,
    overwriteCartByIdController,
    purchaseCartController,
} from '../controllers/carts.controllers.js';
import { isCartOwner, isLogged, isNotAdmin } from '../middlewares/auth.js';



const router = express.Router()

router.get('/', getAllCartsController);
router.post('/', saveCartController);
router.get('/:cid', getCartByIdController);
router.delete('/:cid/deletecart', deleteCartByIdController);
router.get('/:cid/purchase', isLogged, isNotAdmin, purchaseCartController);
router.put('/:cid', overwriteCartByIdController);
router.post('/:cid/product/:pid', isNotAdmin, isCartOwner, addToCartController);
router.put('/:cid/product/:pid', addQtyToCartController);
router.delete('/:cid/product/:pid', removeFromCartController);
router.delete('/:cid', emptyCartByIdController);



export default router;