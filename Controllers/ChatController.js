import Chat from "../Models/chatModel.js";

class allChats {
  constructor() {}

  static deleteAllChats = async (req, res) => {

    const { room } = req.params;
    try {
        const result = await Chat.deleteMany({ room });
        res.status(200).json({ message: "Chats deleted successfully", result });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chats", error });
    }
   
  };

   static deletSingleChat = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Chat.findByIdAndDelete(id);
      if (result) {
        res.json({ success: true, message: "Delete successful" });
      } else {
        res.status(404).json({ success: false, message: "Chat not found" });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  static savechat = async(req , res)=>{
    const { username, message, avatar, room } = req.body;

  try {
    const newChat = new Chat({
      username,
      message,
      avatar,
      room,
    });
    
    const savedChat = await newChat.save();
    res.json(savedChat);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }

  }
  
}


export default allChats
