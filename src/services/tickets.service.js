import { TicketMethods } from '../dao/factory.js'
import ProductService from '../services/products.service.js'
const productService = new ProductService();

export class TicketService {

  async createTicket(ticket) {
      const newTk = await TicketMethods.create(ticket);
      return newTk
  }
 
  async updateStock(prodStock) {
      prodStock.map(async (prod, index) => {
          await productService.updateStockProduct(prod.idProduct, prod.stock)
          console.log("Stock de productos modificado",prodStock);
  
      })
  }
  async getTickets() {
      const newTk = await TicketMethods.getAll();
      return newTk

  }
  async deletePurchase() {
      const newTk = await TicketMethods.deletePurchase();
      return newTk

  }
}
