import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
  firstName:{
      type:String,
      unique:false,
      required:true
  }, 
  lastName:{
      type:String,
      unique:false,
      required:true
  },
  email:{
      type:String,
      unique:true,
      required:true
  },
  age:{
      type:Number,
      unique:false,
      required:true,
      default:18
  },
  password:{
      type: String, 
      max: 100,
  },
  rol:{
      type:String,
      enum:['User','Admin','Premium'],
      default:'User'
  },
  cart: {
      type: String,
      required: false
    },
  last_connection:{ 
      type: String,
      required: false
    },
  documents: [{
      name: { 
          type: String,
          required: false 
         },
      reference: {
        type: String,
        required: false
         },
      _id: false 
     }] 
},{ versionKey: false })

const userModel = mongoose.model('User', userSchema)

export default userModel