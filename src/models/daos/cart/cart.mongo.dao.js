import { logger } from "../../../middlewares/logger.js";
import { CartSchema } from "../../schemas/cart.schema.js";

class CartMongoDAO {

    async getAll() {
        try {
            const carts = await CartSchema.find({});
            return carts;
        }
        catch (error) {
            logger.error(error)
        }
    };
    
    async getById( cid ) {
        try {
            let cart = await CartSchema.findOne({ _id: cid });
            return cart;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async createCart() {
        try {
            let newCart = await CartSchema.create({});
            return newCart;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async addToCart( cid, pid ) {
        try {
            let res = await CartSchema.findOneAndUpdate(
                { _id: cid, 'products.product': pid},
                { $inc: { 'products.$.quantity': 1 } },
                { new: true}
            );

            if(!res) {
                res = await CartSchema.findOneAndUpdate(
                    { _id: cid },
                    { $push: { products: { product: pid, quantity: 1 } } },
                    { new: true }
                )
            }

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async addQtyToCart( cid, pid, qty) {
        try {
            let res = await CartSchema.findOneAndUpdate(
                { _id: cid, 'products.product': pid},
                { $inc: { 'products.$.quantity': +qty } },
                { new: true}
            );

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };
 
 
    async delete( cid, pid ) {
        try {
            let res = await CartSchema.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            );

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };


    async emptyCart( cid ) {
        try {
            let res = await CartSchema.findOneAndUpdate(
                { _id: cid },
                { products: [] },
                { new: true }
            );

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };


    async overwriteCart( cid, prods ) {
        try {
            let res = await CartSchema.findOneAndUpdate(
                { _id: cid },
                { products: prods },
                { new: true }
            );

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async deleteCartById(id) {
        try {
            const deletedCart = await CartSchema.deleteOne({ _id: id });
            return deletedCart;
        } catch (error) {
            console.log(error);
        }
    };

}

export {CartMongoDAO}