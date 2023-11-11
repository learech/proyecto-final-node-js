import { TicketsDAO } from "../models/daos/app.daos.js";
import { ProductService } from "./product.service.js";
import { CartService } from "./cart.service.js";

const ticketsDAO = new TicketsDAO();

export class TicketService {

    async createTicket ( ticket ) {
        try {
            const newTicket = await ticketsDAO.create( ticket );
            return newTicket;
        }
        catch(error) {

        }
    }
}