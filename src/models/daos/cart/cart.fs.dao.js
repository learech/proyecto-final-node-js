import fs from 'fs';
import { v4 as uuid } from 'uuid';


class CartFsDao {

    constructor (path) {
        this.path = path;
    }

    async getAll() {
        try {
            if(fs.existsSync(this.path)){
                const fileToRead = await fs.promises.readFile(this.path, 'utf-8'); 
                const carts = JSON.parse(fileToRead);
                return carts;
            } else {
                await fs.promises.writeFile(this.path, '[]');
                const fileToRead = await fs.promises.readFile(this.path, 'utf-8'); 
                const carts = JSON.parse(fileToRead);
                return carts;
            }
        }
        catch(error) {
            throw new Error(error.message);
        }
    };

    async createCart() {
        try{
            const carts = await this.getCarts();
            const newCart = {
                id : uuid(),
                products: [],
            }

            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return `Cart added successfully with id ${newCart.id}`;
        }
        catch(error) {
            throw new Error(error.message)
        }
    };

    async getCartById( id ) {
        try {
            let carts = await this.getCarts();
            let cart = carts.find(item => item.id === id);
            return ( cart != undefined) ? cart : null;
        }
        catch(error) {
            throw new Error(error.message);
        }
    };

    async addToCart( cid, pid ) {
        try{
            let carts = await this.getCarts();
            let cartIndex = carts.findIndex(item => item.id === cid);
            
            if(cartIndex === -1){
                throw new Error(`CID error`);
            }
            
            let cart = carts[cartIndex]; 
            let prodInCartIndex = cart.products.findIndex(item => item.id === pid); 

            let prod = {
                id: pid,
                quantity: 1
            };

            if(prodInCartIndex === -1){
                cart.products.push(prod);
                carts[cartIndex] = cart;

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return `Product with id '${pid}' was added`;
            }
            else{
                cart.products[prodInCartIndex].quantity ++;
                carts[cartIndex] = cart;

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return `Product with id '${pid}' was added`;
            }
        }
        catch(error) {
            throw new Error(error.message);
        }
    };

    async removeFromCart( cid, pid ) {
        try{
            let carts = await this.getCarts();
            let cartIndex = carts.findIndex(item => item.id === cid);
            
            if(cartIndex === -1){
                throw new Error(`CID error`);
            }
            
            let cart = carts[cartIndex];
            let prodInCartIndex = cart.products.findIndex(item => item.id === pid);
            
            if(prodInCartIndex === -1){
                throw new Error(`PID error`);
            }
            
            if(prodInCartIndex >= 0){
                cart.products[prodInCartIndex].quantity > 1 ? cart.products[prodInCartIndex].quantity -- : cart.products.splice(prodInCartIndex, 1);
                carts[cartIndex] = cart;

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return `Product with id '${pid}' was deleted`;
            }
        }
        catch(error) {
            throw new Error(error.message);
        }
    };

}

export {CartFsDao}