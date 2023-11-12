import { logger } from "../../../middlewares/logger.js";
import { TicketSchema } from "../models/tickets.schema.js";

class TicketsMongoDAO {

    async getAll() {
        try {
            const tickets = await TicketSchema.find({});
            return tickets;
        } catch (error) {
            logger.error(error);
        }
    }

    async getById( tid ) {
        try {
            let ticket;
            ticket = await TicketSchema.findOne({ _id: tid });
            return ticket;
        } catch (error) {
            logger.error(error);
        }
    }

    async create( ticket ) {
        try {
            const newTicket = await TicketSchema.create(ticket);
            return newTicket;
        } catch (error) {
            logger.error(error);
        }
    }

    async update(tid, ticket) { 

    }

    async delete(tid) { 
        try {
            const deletedTicket = await TicketSchema.findOneAndDelete({_id: tid});
            return { success: true, message: 'Ticket deleted successfully', payload: deletedTicket };
        } catch (error) {
            logger.error(error);
        }
    }

}

export { TicketsMongoDAO }