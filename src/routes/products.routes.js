import express from 'express';
import {
    getProductsController, 
    getProductByIdController, 
    addProductController, 
    deleteProductByIdController, 
    updateProductController,
} from '../controllers/products.controllers.js';
import { isAdmin, isLogged } from '../middlewares/auth.js';


const router = express.Router();

// Routes
    router.get( '/', isLogged, getProductsController);
    router.get('/:pid', isLogged, getProductByIdController);
    router.post('/',  addProductController);
    router.delete('/:pid', isLogged, isAdmin, deleteProductByIdController);
    router.put('/:pid', isLogged, isAdmin, updateProductController);



export default router;