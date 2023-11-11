import { Schema, model } from 'mongoose';


const ticketSchema = new Schema(
    {
    code: { type: String, required: true, default: Date.now() },
    purchase_datetime: { type: Date, required: true, default: Date.now() },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, default: '' },
    products: {
        type: [
            {
                product: {
                    type: String,
                },
                id: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 0,
                },
                partialPrice: {
                    type: Number,
                    default: 0,
                },
                _id: false,
            },
        ],
        default: [],
    },
    },
    { versionKey: false}
);

// [
//     {
//         id: { type: Schema.Types.ObjectId, ref: 'products' },
//         quantity: { type: Number, required: true, default: 0 },
//         _id: false,
//     },
// ],



ticketSchema.pre('find', function () {
    this.populate('products.id');
});

ticketSchema.pre('findOne', function () {
    this.populate('products.id');
});


export const TicketSchema = model('tickets', ticketSchema);