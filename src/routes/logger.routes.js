import express from 'express';
import { getLoggerTesting } from '../controllers/logger.controllers.js';


const router = express.Router();

router.get('/', getLoggerTesting);

export default router;
