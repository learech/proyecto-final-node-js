import { CartsDAO, ProductsDAO } from "../models/daos/app.daos.js";
import { TicketService } from "../services/ticket.service.js";

const cartDAO = new CartsDAO();
const productDAO = new ProductsDAO();
const ticketService = new TicketService;

export class CartService {

    async getCarts() {
        try {
            const carts = await cartDAO.getAll();
            return carts
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async saveCart() {
        try {
            let newCart = await cartDAO.createCart();
            return newCart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async getCartById( cid ) {
        try {
            let cart = await cartDAO.getById( cid );
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async deleteCartById( cid ) {
        try {
            let cart = await cartDAO.deleteCartById( cid );
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async addToCart( cid, pid ) {
        try {
            let res = await cartDAO.addToCart( cid, pid); 

            return res;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async addQtyToCart( cid, pid, qty ) {
        try {
            const cart = await cartDAO.getById( cid );
            const productInCart = cart.products.find((item) => item.product._id.toString() === pid);

            let res;
            if ((productInCart.quantity + qty) >= 1) {
                res = await cartDAO.addQtyToCart( cid, pid, qty )
                return res;
            } 
            
            if ((productInCart.quantity + qty) === 0) {
                // HACER EL REMOVE ACA
                res = await cartDAO.delete( cid, pid )
                return res;
            } else {
                return `I'm sorry, we can't subtract that amount, there are only ${productInCart.quantity} units of this products left in the cart`
            }
            
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async removeFromCart( cid, pid ) {
        try {
            let res = await cartDAO.delete( cid, pid )

            return res;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async emptyCartById( cid ) {
        try {
            let cart = await cartDAO.emptyCart( cid );
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };


    async overwriteCartById( cid, prods ) {
        try {
            let cart = await cartDAO.overwriteCart( cid, prods);
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async purchaseCart( cid, infoUser ) {
        try {
            let cart = await cartDAO.getById( cid );
            if( cart ) {
                const productsInCartIds = cart.products.map( product => product.product._id);
                const productsInCartQty = cart.products.map(product => product.quantity);
                const productsInCartData = await productDAO.getArrProductsById(productsInCartIds);

                let amount = 0;
                let prodOutStock = [];
                let prodStock = [];

                productsInCartData.map(( prod, index ) => {
                    if( productsInCartQty[index] > prod.stock) {
                        prodOutStock.push({
                            title: prod.title,
                            _id: prod._id,
                            stock: prod.stock,
                            quantity: productsInCartQty[index],
                        });
                    }
                    else {
                        let newStock = prod.stock - (productsInCartQty[index]);
                        let productInCartPrice = prod.price * (productsInCartQty[index]);

                        amount += productInCartPrice;

                        prodStock.push({
                            title: prod.title,
                            _id: prod.id,
                            stock: newStock,
                            quantity: productsInCartQty[index],
                            partialPrice: prod.price * productsInCartQty[index],
                        });
                    };
                });

                if(prodStock.length === 0) {
                    return {
                        status: 400,
                        result: {
                            status: 'error',
                            error: 'Cart is empty'
                        },
                    };
                };

                const ticket = await ticketService.createTicket({
                    amount,
                    purchaser: infoUser.email,
                    products: prodStock.map((prod) => ({
                        product: prod.title,
                        id: prod._id,
                        quantity: prod.quantity,
                        partialPrice: prod.partialPrice,
                    }))
                });

                prodStock.map( async (prod) => {
                    await productDAO.updateStock(prod._id, -prod.quantity);
                });

                return {
                    ticket,
                    prodOutStock,
                    prodStock
                };
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    };

    async updateCartAfterPurchase( cid, prodStock ) {
        try {
            prodStock.map( async (prod) => {
                await cartDAO.delete( cid, prod._id )
            });

        }
        catch (error) {
            throw new Error(error.message);
        }
    };

}
