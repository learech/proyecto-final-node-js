import fs from 'fs';
// import { v4 as uuid} from uuid;
class ProductFsDao {

    constructor (path) {
        this.path = path;
    }

    async getAll() {
        try {
            if(fs.existsSync(this.path)){
                const fileToRead = await fs.promises.readFile(this.path, 'utf-8'); 
                const products = JSON.parse(fileToRead);
                return products;
            } else {
                await fs.promises.writeFile(this.path, '[]');
                const fileToRead = await fs.promises.readFile(this.path, 'utf-8'); 
                const products = JSON.parse(fileToRead);
                return products;
            }
        }
        catch(error) {
            throw new Error(error.message);
        }
    };

    async addProduct( prod ) {
        if(!prod.title || !prod.description || !prod.price || !prod.status || !prod.category || !prod.code || !prod.stock){
            return `Body format error`;
        };

        try {
            const products = await this.getProducts();
            const productCode = products.find(item => item.code === prod.code);
            let lastIndex = products.length - 1;
    
            if(productCode){ 
                return `Code error`;
            };
    
            const newProduct = {
                title: prod.title, 
                description: prod.description,
                price: +prod.price,
                status: prod.status?? true,
                category: prod.category,
                thumbnail: prod.thumbnail, 
                code: prod.code,
                stock: +prod.stock,
                id: products.length>0 ? products[lastIndex].id + 1 : 1,
            };
    
            products.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return {msg:`Product added successfully with id ${newProduct.id}`, payload: newProduct};

        }
        catch(error) {
            throw new Error(error.message);
        }
    }

    async getById( id ) {
        try {
            const products = await this.getProducts();
            const product = products.find(item => item.id === +id);
            return (product != undefined) ? product : null;
        }
        catch(error) {
            throw new Error(error.message);
        }
    }

    async delete( id ) {
        try {
            let products = await this.getProducts();

            const product = products.find(item => item.id === +id);
            if(product == undefined){
                return null
            }

            products = products.filter(item => item.id !== +id);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return `Product with id '${id}' was deleted`;
        }
        catch(error) {
            throw new Error(error.message);
        }
    }

    async update( id, prod ) {
        try{
            let products = await this.getProducts();

            const productIndex = products.findIndex(item => item.id === +id);

            if(productIndex === -1){
                return `ID error`
            }

            if(!prod.title || !prod.description || !prod.price || !prod.status || !prod.category || !prod.code || !prod.stock){
                return 'Body format error';
            };

            products[productIndex] = {...prod, id: id};

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return `Product with id '${id}' was updated`;

        }
        catch(error){
            throw new Error(error.message);
        }
    }

};

export {ProductFsDao};