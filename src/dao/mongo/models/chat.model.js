import mongoose from 'mongoose' 

const ChatSchema = new mongoose.Schema({
  user: {
      type:String,
      unique:false,
      required:true,
    },
  message:{
      type:String,
      unique:false,
      required:true, 
  }
},{ versionKey: false });

const ChatModel= mongoose.model('message', ChatSchema)

export default ChatModel