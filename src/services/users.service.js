import { UserMethods } from '../dao/factory.js'

export class UserService{ 
  async getAll(){
      try {
          const users = await UserMethods.find() 
          return users;
      } catch (error) {
          throw new Error(error.message);
      }
  }
  async getById(_id) { 
      const user = await UserMethods.findOne({ _id: _id });
      return user;
    }
    async getByEmail(email) { 
      const user = await UserMethods.findOneEmail(email);
      return user;
    }
    async createOne(data) {
      const user = await UserMethods.createOne(data);
      return user;
    }
    async createMany(data) {
      const result = await UserMethods.createMany(data);
      return result;
  } 
    async deletedOne(_id) {
      const deleted = await UserMethods.deletedOne({ _id: _id }); 
      return deleted;
    }
    async updateOne(_id,data) {
      const userUpDate = await UserMethods.updateOne({ _id: _id },data);
      return userUpDate;
    } 
}