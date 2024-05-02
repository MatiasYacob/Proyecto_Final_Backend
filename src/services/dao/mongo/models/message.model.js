import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
   user: String,
   message: String,
   timestamp: { type: Date, default: Date.now } // Agregar campo para fecha y hora
});

const Message = model('Message', MessageSchema);

export { Message };
