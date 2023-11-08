import express from 'express'
import { isAdmin, goToLogin } from "../middlewares/auth.middleware.js"

import { getAll, newCart, getCartById, addProductToCart, deleteCart, deleteProductFromCart, updateQuantity, updateCart, purchase, getPurchase, deletePurchase, getCartError, stripeBuy } from '../controller/cart.controller.js'

export const router = new express.Router(); 

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get("/",goToLogin, isAdmin, getAll);     
// router.get("/:cid",goToLogin, isAdmin, getCartById);
router.get("/:cid",getCartById); // Sin middlewares para Test
router.post("/",newCart);
router.post("/:cid/product/:pid",goToLogin, addPorductToCart);
// router.delete("/:cid",goToLogin, isAdmin, deleteCart);
router.delete("/:cid",deleteCart); // Sin middlewares para Test
router.delete("/:cid/product/:pid",goToLogin, deleteProductFromCart); 
router.put("/:cid/product/:pid",goToLogin, updateQuantity);
router.put("/:cid",goToLogin, updateCart);
router.get('/:cid/purchase',goToLogin, purchase);
router.post('/chargeTicket',goToLogin, stripeBuy)  
router.get('/:cid/purchases',goToLogin, isAdmin, getPurchase);
router.delete('/:cid/purchases', goToLogin,isAdmin, deletePurchase);
router.get('*', getCartError);