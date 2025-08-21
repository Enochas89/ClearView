import mongoose from "mongoose"
const chatMessageSchema=new mongoose.Schema({
  project:{type:mongoose.Schema.Types.ObjectId,ref:"Project"},
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  text:String
},{timestamps:true})
export default mongoose.model("ChatMessage",chatMessageSchema)
