import env from '../../config/env.config.js';

import { CartMongoDAO } from '../dao/mongo/cart.mongo.dao.js';
import { ProductMongoDAO } from '../dao/mongo/products.mongo.dao.js';
import { MessagesMongoDAO } from '../dao/mongo/messages.mongo.dao.js';
import { TicketsMongoDAO } from '../dao/mongo/tickets.mongo.dao.js';

import { CartFsDao } from '../dao/fs/carts.fs.dao.js';
import { ProductFsDao } from '../dao/fs/producst.fs.dao.js';
import { MessagesFsDAO } from '../dao/fs/messages.fs.dao.js';
import { TicketsFsDAO } from '../dao/fs/tickets.fs.dao.js';
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