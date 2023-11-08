import { Router } from 'express'
import { goToLogin, isUserPremium, isAdminPremium } from "../middlewares/auth.middleware.js"
import { productsView, cartView, chatView, RealTimeProductsView, getViewsError } from '../controller/views.controller.js'

export const router = Router();

router.get('/products', productsView);
router.get('/cart', goToLogin, isUserPremium, cartView);
router.get("/chat", goToLogin, isUserPremium, chatView);
router.get("/realTimeProducts", goToLogin, isAdminPremium, RealTimeProductsView); 
router.get('*', getViewsError); 
