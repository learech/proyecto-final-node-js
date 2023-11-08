import express from "express"
import { isAdminPremium, goToLogin } from "../middlewares/auth.middleware.js"
import { getWithQuerys, getProductById, addProduct, addManyProducts, deleteProduct, updateProduct, getProductError } from '../controller/products.controller.js'

export const router = new express.Router();

router.use(express.json());   
router.use(express.urlencoded({ extended: true }));

router.get("/", getWithQuerys); 
router.get("/:pid", isAdminPremium, getProductById);
// router.post("/",goToLogin, isAdminPrimium, addProduct);  
router.post("/",addProduct); // sin middlewares para test
router.post("/many",goToLogin,isAdminPremium, addManyProducts);
// router.delete("/:pid",goToLogin,isAdminPrimium, deleteProduct); 
router.delete("/:pid",deleteProduct); // sin middelewares para Test 
// router.put("/:id",goToLogin,isAdminPrimium,updateProduct);
router.put("/:id",updateProduct); // sin middlewares para Test
router.get("*", getProductError);