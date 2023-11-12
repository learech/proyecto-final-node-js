import { UserSchema } from "../services/dao/models/users.schema";


export class UserService {

    async getAll() {
        const users = await UserSchema.find({});
        return users
    }
}