import { logger } from "../../../middlewares/logger.js";
import { ProductsSchema } from "../../schemas/product.schema.js";

class ProductMongoDAO {
    async getAll( query, params ) {
        try {
            const products = await ProductsSchema.paginate( query, params );
            return products;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async getById( id ) {
        try {
            const product = await ProductsSchema.findOne({ _id: id });
            return product
        }
        catch (error) {
            logger.error(error)
        }
    };

    async addProduct( prod ) {
        try {
            let newProduct = await ProductsSchema.create(prod);
            return newProduct;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async delete( pid ) {
        try {
            const product = await ProductsSchema.deleteOne({ _id: pid });
            return product
        }
        catch (error) {
            logger.error(error)
        }
    };

    async update( pid, prod ) {
        try {
            const updatedProduct = await ProductsSchema.findOneAndUpdate({ _id: pid }, prod, { new: true });
            return updatedProduct
        }
        catch (error) {
            logger.error(error)
        }
    };

    async updateStock( pid, stock ) {
        try {
            let res = await ProductsSchema.findOneAndUpdate(
                { _id: pid},
                { $inc: { stock: stock } },
                { new: true}
            );

            return res;
        }
        catch (error) {
            logger.error(error)
        }
    };

    async getArrProductsById( arr ) {
        try {
            const productsData = [];
            
            for ( let id of arr) {
                const product = await this.getById(id);
                productsData.push(product);
            }
            return productsData;
        } 
        catch (error) {
            logger.error(error);
        }
    }

};

export {ProductMongoDAO}