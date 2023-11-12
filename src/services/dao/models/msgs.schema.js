//@ts-check
import { Schema, model } from "mongoose";

const msgSchema = new Schema({
    email: { type: String, required: true, max: 100 },
    message: { type: String, required: true, max: 300 },
});

export const MsgsSchema = model('messages', msgSchema);