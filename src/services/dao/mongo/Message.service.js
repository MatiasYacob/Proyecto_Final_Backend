
import { Message } from "./models/message.model.js";
class MessageManager {
    constructor() {}

    async addMessage(messageData) {
        try {
            const newMessage = new Message(messageData);
            await newMessage.save();
            console.log('Message agregado exitosamente.');
            return newMessage;
        } catch (error) {
            console.error('Error al agregar el Message:', error);
            return null;
        }
    }

    async getAllMessages() {
        try {
            const messages = await Message.find().sort({ timestamp: 'asc' });
            return messages;
        } catch (error) {
            console.error('Error al obtener todos los mensajes:', error);
            return null;
        }
    }
}

export default MessageManager;
