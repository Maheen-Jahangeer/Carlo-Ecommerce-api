import mongoose from "mongoose";

const Cart =new  mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[
        {
            productId:{
                type:String
            },quantity:{
                type:Number,
                default:1
            }
        }
    ]
},
{
  timestamps:true  
})

export default mongoose.model('Cart', Cart);