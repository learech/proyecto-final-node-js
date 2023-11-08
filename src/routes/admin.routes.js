import express from 'express'
import { isAdmin, goToLogin } from "../middlewares/auth.middleware.js"
import { adminPanelRender, adminGetUsers, adminRolUserById, adminInactiveUsers, adminDelUserById, getError } from '../controller/admin.controller.js'

export const router = new express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));


router.get('/', goToLogin,isAdmin, adminPanelRender);
router.get('/panel', goToLogin,isAdmin,adminGetUsers);
router.put('/panel/:uid', adminRolUserById); // Sin middlewares para test
router.delete('/panel/:uid',goToLogin,isAdmin,adminDelUserById);
router.delete('/panel',goToLogin,isAdmin,adminInactiveUsers);
router.get('*',goToLogin,isAdmin,getError); 