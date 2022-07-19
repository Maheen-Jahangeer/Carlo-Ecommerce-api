import mongoose from "mongoose";

const Products = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique
    },
    desc:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    categories:{
        type:Array,
        default:[]
    },
    size:{
        type:String
    },
    color:{
        type:String
    },
    price:{
        type:Number
    }
},
{
    timestamps:true
})

export default mongoose.model('Products', Products);