class MessageRepository {
    constructor(MessageManager) {
      this.MessageManager = MessageManager;
    }
  
    addMessage = (messageData) => {
      return this.MessageManager.addMessage(messageData);
    }
  
    getAllMessages = () => {
        return this.MessageManager.getAllMessages();
      }
  
   
  }
  
  export default MessageRepository ;
  