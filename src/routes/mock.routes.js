import express from 'express';
import { getMockingProducts } from '../controllers/mock.controllers.js';

const router = express.Router();

router.get('/', getMockingProducts);

export default router;