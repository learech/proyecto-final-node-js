import { persistence } from '../config/env.config.js'
import MongoSingleton from '../config/mongodb-singleton.js'
import cartModel from './mongo/classes/carts.dao.js'
import productModel from './mongo/classes/products.dao.js'
import chatModel from './mongo/classes/chat.dao.js'
import ticketModel from './mongo/classes/tickets.dao.js'
import userModel from './mongo/classes/users.dao.js'
import cartManager from './fs/classes/CartsManager.js'
import productManager from './fs/classes/ProductManager.js'

let  CartMethods;
let  ProductMethods;
let  ChatMethods;
let  TicketMethods;
let  UserMethods;

async function initializeMongoService() {
  console.log("Iniciando servicio para MongoDB");
  try {
      await MongoSingleton.getInstance();

  } catch (error) {
      console.error("Error al iniciar MongoDB:", error);
      process.exit(1); // Salir con código de error
  }
}


switch (persistence) {
    case 'MONGO':
      console.log('Persistence with Mongo')

      initializeMongoService()
      CartMethods = cartModel; 
      ProductMethods = productModel;
      ChatMethods = chatModel;
      TicketMethods = ticketModel;
      UserMethods = userModel; 
  
      break;
    case 'FS':
      console.log('Persistence with FileSystem');
      
      CartMethods = cartManager;
     
      ProductMethods = productManager;
  
      break;
    default:
      console.error("Persistencia no válida en la configuración:", config.persistence);
      process.exit(1);    
}

  export default {
    CartMethods,
    ProductMethods,
    ChatMethods,
    TicketMethods,
    UserMethods
  }