import { faker } from '@faker-js/faker';


export class MockService {

    getAllMockProducts() {
        try {
            const products = [];

            const generateProduct = () => {
                return {
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price({ min: 100, max: 7000, dec: 0 }),
                    thumbnails: [faker.image.avatarGitHub()],
                    code: `a${faker.finance.pin(4)}`,
                    stock: faker.number.int({ max: 100 }),
                    category: faker.commerce.department(),
                    status: faker.datatype.boolean(),
                };
            };

            do {
                products.push(generateProduct());
            } while (products.length < 100);

            return { status: 200, result: { status: 'succes', payload: products } };

        } catch (error) {
            throw new Error(error.message);
        }
    }
}