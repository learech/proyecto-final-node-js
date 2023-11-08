import express from 'express'
import getLogger from '../controller/logger.controller.js'
import { goToLogin, isAdmin } from "../middlewares/auth.middleware.js"

export const router = new express.Router();

router.get('/', goToLogin,isAdmin, getLogger);