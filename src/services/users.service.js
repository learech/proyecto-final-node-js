import { UserModel } from "../DAO/models/product.model.js";


export class UserService {

    async getAll() {
        const users = await UserModel.find({});
        return users
    }
}