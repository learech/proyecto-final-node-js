import fs from "fs";


class ProductManager {
    constructor(path) {
        this.path = path;
    }
    async getAll() {
        try {
            if (fs.existsSync(this.path)) {
                const productsString = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(productsString)
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
    async create(product) {
        try {
            let products = await this.readDataFile()
            let checkCode = products.some((pCode) => pCode.code === product.code);
            if (checkCode) {
                throw new Error('Ya existe un producto con ese código');
            }
            if (!product.code || !product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.category) {
                throw new Error('Campos vacíos. Por favor completa todos los espacios requeridos.');
            }
            let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            products.push({ id, ...product, status: true});
            const productsString = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, productsString);
            console.log('Producto añadido exitosamente.');
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async findOne(id) {
        try {
            let products = await this.readDataFile()
            let checkId = products.find((pId) => pId.id === id);
            if (!checkId) {
                throw new Error("id no válido, no encontrado.")
            }
            return checkId;
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async updateOne(id, product) {
        try {
            let products = await this.readDataFile()
            if (!product.code || !product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.category) {
                throw new Error('Campos vacíos. Por favor completa todos los espacios requeridos.');
            }
            let index = products.findIndex((pId) => pId.id === id);
            if (index === -1) {
                throw new Error('No encontrado.')
            } else {
                delete product.id;
                products.splice(index, 1, {
                    id,
                    ...product,
                    status: true
                });

            }
            const productsString = JSON.stringify(products);
            await fs.promises.writeFile(this.path, productsString);
            console.log(`El producto con id: ${id} fue actualizado exitosamente.`);
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async deleteProduct(id) {
        try {
            let products = await this.readDataFile()
            let index = products.findIndex((pId) => pId.id === id);
            if (index === -1) {
                throw new Error('No se pudo eliminar. No se encuentra.')
            } else {
                products.splice(index, 1);
            }
            const productsString = JSON.stringify(products);
            await fs.promises.writeFile(this.path, productsString);
            console.log(`El producto con id: ${id} fue eliminado exitosamente.`);
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
const productManager = new ProductManager;

export default productManager
