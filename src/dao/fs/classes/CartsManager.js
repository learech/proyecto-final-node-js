import fs from "fs";
import ProductManager from './ProductManager.js';

const productManager = new ProductManager('./src/dao/products.json');


class CartsManager {
    constructor(path) {
        this.path = path;
    }
    async find() {
        try {
            if (fs.existsSync(this.path)) {
                const cartsString = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(cartsString)
            }
            await fs.promises.writeFile(this.path, JSON.stringify([]));
            return [];
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('Archivo no encontrado');
            } else {
                throw err;
            }
        }

    }
    // verificar
    async create() {
        try {
            let carts = await this.readDataFile();
            let id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
            carts.push({
                id,
                products: []
            });
            let newCart = carts.find((cId) => cId.id === id);
            const cartsString = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, cartsString);
            console.log('Carrito creado exitosamente');
            return newCart
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async findOne(id) {
        try {
            let carts = await this.readDataFile()
            let checkId = carts.find((cId) => cId.id === id);
            if (!checkId) {
                throw new Error("id no válido, carrito no encontrado");
            }
            return checkId;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    //toDO merge methods deleteCart, deleteProductFromCart to updateOne
    async updateOne(productId, cartId) {
        try {
          let carts = await this.readDataFile();
          let productsFile = await productManager.readDataFile();
      
          // verificar si el producto existe
          let checkPId = productsFile.find((pId) => pId.id === productId);
          if (!checkPId) {
            throw new Error("Id no válido, producto no encontrado");
          }
      
          // agregar o actualizar producto en el carrito
          let foundCart = carts.find((c) => c.id === cartId);
          if (foundCart) {
            let findedProduct = foundCart.products.find((p) => p.id === productId);
            if (findedProduct) {
              findedProduct.quantity += 1;
            } else {
              foundCart.products.push({
                id: productId,
                quantity: 1,
              });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            console.log(`Producto ${productId} añadido exitosamente al carrito ${cartId}`);
          } else {
            throw new Error("id no válido, carrito no encontrado");
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
    async deleteCart(id) {
        try {
            let carts = await this.readDataFile();
            let index = carts.findIndex((cId) => cId.id === id);
            if (index === -1) {
                throw new Error('No se pudo borrar. No se encuentra');
            } else {
                carts.splice(index, 1);
            }
            const cartsString = JSON.stringify(carts);
            await fs.promises.writeFile(this.path, cartsString);
            console.log(`El carrito con id: ${id} fue borrado exitosamente`);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductFromCart(productId, cartId){
        try {
            let carts = await this.readDataFile();
            let productsFile = await productManager.readDataFile();
        
            let checkPId = productsFile.find((pId) => pId.id === productId);
            if (!checkPId) {
              throw new Error("id no válido, producto no encontrado");
            }
            let findedCart = carts.find((c) => c.id === cartId);
            if (findedCart) {
              let findedProduct = findedCart.products.find((p) => p.id === productId);
              if (findedProduct) {
                if(findedProduct.quantity === 1){
                    findedCart.products.splice(findedCart.products.indexOf(findedProduct), 1);
                }else{
                    findedProduct.quantity -= 1;
                }
              } else {
                throw new Error(`El producto con id: ${productId} no fue encontrado en el  carrito con id:${cartId}`)
              }
              await fs.promises.writeFile(this.path, JSON.stringify(carts));
              console.log(`El producto ${productId} fue eliminado exitosamente del carrito ${cartId}`);
            } else {
              throw new Error("id inválido, carrito no encontrado");
            }
          } catch (error) {
            throw new Error(error.message);
          }
    }
}
const cartManager = new CartsManager;

export default cartManager
