import { Router, json, urlencoded } from 'express'
import { goToLogin, isAdminPremium } from '../middlewares/auth.middleware.js'
import { mockProducts, mockUsers, mockGetError } from '../controller/mocks.controller.js'
export const router = new Router();

router.use(json()); 
router.use(urlencoded({ extended: true }));

router.get('/products',goToLogin,isAdminPremium, mockProducts);
router.get('/users',goToLogin, isAdminPremium, mockUsers); 
router.get('*', mockGetError);