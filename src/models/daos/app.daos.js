import env from '../../config/env.config.js';

import { CartMongoDAO } from './cart/cart.mongo.dao.js';
import { ProductMongoDAO } from './products/products.mongo.dao.js';
import { MessagesMongoDAO } from './messages/messages.mongo.dao.js';
import { TicketsMongoDAO } from './tickets/tickets.mongo.dao.js';

import { CartFsDao } from './cart/cart.fs.dao.js';
import { ProductFsDao } from './products/products.fs.dao.js';
import { MessagesFsDAO } from './messages/messages.fs.dao.js';
import { TicketsFsDAO } from './tickets/tickets.fs.dao.js';
import { logger } from '../../middlewares/logger.js';

let MessagesDAO;
let CartsDAO;
let ProductsDAO;
let TicketsDAO;

switch (env.PERSISTENCE) {
  case 'MONGO':
    logger.info('Persistance with MongoDB');

    MessagesDAO = MessagesMongoDAO;
    CartsDAO = CartMongoDAO
    ProductsDAO = ProductMongoDAO
    TicketsDAO = TicketsMongoDAO;
    break;

  case 'FS':
    logger.info('Persistance with FileSystem');

    MessagesDAO = MessagesFsDAO;
    CartsDAO = CartFsDao;
    ProductsDAO = ProductFsDao;
    TicketsDAO = TicketsFsDAO;
    break;

  default:
    throw new Error('Invalid persistence type');
}

export { 
    MessagesDAO,
    CartsDAO,
    ProductsDAO,
    TicketsDAO,
}