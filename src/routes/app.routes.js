import express from 'express';
import productsRoutes from './products.routes.js';
import cartsRoutes from './carts.routes.js';
import sessionsRoutes from './sessions.routes.js';
import viewsRoutes from './views.routes.js';
import chatRoutes from './chat.routes.js';
import mockRoutes from './mock.routes.js';
import loggerRoutes from './logger.routes.js'



const router = express.Router();

router.use('/', sessionsRoutes)
router.use('/api/products', productsRoutes);
router.use('/api/carts', cartsRoutes);
router.use('/api/sessions', sessionsRoutes);
router.use('/api/mockingproducts', mockRoutes)
router.use('/views', viewsRoutes);
router.use('/chat', chatRoutes);
router.use('/loggerTest', loggerRoutes);



export default router