import { cartService } from '../controllers/carts.controllers.js';
import { productService } from '../controllers/products.controllers.js';
import { logger } from '../middlewares/logger.js';

const getUserViewsController = async (req, res) => {
    try {
        let user = {};
        req.session.user?
            user = {  
                email: req.session.user.email, 
                firstName: req.session.user.firstName, 
                lastName: req.session.user.lastName, 
                age: req.session.user.age,
                cartId: req.session.user.cartId,
                role: req.session.user.role, 
            } : user = {};
        res.status(200).render('home', { user });
    }
    catch(error) {
        logger.error(error);
        res.status(500).json({ success: false, result: error.message });
    }
};


const getProductsViewsController = async (req, res) => {
    try {
        const currentUrl = req.originalUrl
        let { page, limit, sort, category, stock } = req.query;
        sort = sort ? {price: sort} : null;
        let query = {}
        category ? query.category = category : null;
        stock ? query.stock = { $gt: +stock} : null;

        const user = {  
            email: req.session.user.email, 
            firstName: req.session.user.firstName, 
            lastName: req.session.user.lastName, 
            age: req.session.user.age,
            cartId: req.session.user.cartId,
            role: req.session.user.role, 
        }

        const queryResult = await productService.getProducts(query, limit, page, sort, currentUrl)

        return res.status(200).render('products', {
            success: true, 
            products: queryResult.products,
            pagination: queryResult.pagination,
            user: user,
        });
    }
    catch(error) {
        res.status(500).json({ success: false, result: error.message });
    }
};

const getCartByIdViewsController = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);

        const user = {  
            email: req.session.user.email, 
            firstName: req.session.user.firstName, 
            lastName: req.session.user.lastName, 
            age: req.session.user.age,
            cartId: req.session.user.cartId,
            role: req.session.user.role, 
        }

        const simplifiedCart = cart.products.map((item) => {
            return {
                id: item._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                total: item.product.price * item.quantity,
            };
        });

        return res.status(200).render('cart', { 
            cart: simplifiedCart,
            user: user,
        });
    }
    catch(error) {
        res.status(500).json({ success: false, result: error.message });
    }
};


export {
    getUserViewsController,
    getProductsViewsController,
    getCartByIdViewsController,
}