import express, { response } from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart';
import {VerifyTokenAndAdmin, VerifyTokenAndAuthorization, VerifyToken} from '../helper/verifyJson.js';

const orderRouter = express.Router();

//Create a order
orderRouter.post('/add', VerifyTokenAndAuthorization, async(req,res)=> {
    try{
        const newOrder = new Order(req.body)
        await newOrder.save();
        res.status(200).json(newOrder);
    }catch(err){
        res.status(500).json(err)
    }
})

//Update cart
// orderRouter.put('/update/increase-product/:id',VerifyTokenAndAuthorization, async(req,res) => {
//     const qDecrease = req.params.decrease;
//     const cartProducts = await Cart.findById(req.user._id)
//     const productIndex = cartProducts.products.findIndex((product) => product.productId == req.params.id)
//     const productQuantity = cartProducts.products[productIndex].quantity
//     try{
//         if(!cartProducts?.products.includes(req.params.id)){
//             await cartProducts.updateOne({$push:{products:req.params.id}})
//             res.status(200).json("Product added successfully")
//         }
//         else if(qDecrease && productQuantity == 1){
//             await cartProducts.updateOne({$pull:{products:req.params.id}})
//             res.status(200).json("Product is removed from cart")
//         }
//         else if(qDecrease && productQuantity > 1){
//             await cartProducts.updateOne({$inc:{quantity:-1}})
//             res.status(200).json('Product decreased successfully')
//         }
//         else{
//             await cartProducts.updateOne({$inc:{quantity:1}})
//             res.status(200).json("Quantity changes successfully")
//         }
//     }catch(err){
//         res.status(200).json(err)
//     }
// })

//Update Order
orderRouter.put('/:id', VerifyTokenAndAdmin, async(req,res)=> {
    try{
        await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        })
        res.status(200).json("Order has been updated successfully")
    }catch(err){
        res.status(500).json(err)
    }
})

//remove product from cart
// orderRouter.put('/remove-product/:id',VerifyTokenAndAuthorization,async(req,res)=> {
//     const cartProduct = await Cart.findById({userId:req.user._id})
//     try{
//         if(cartProduct.products.includes(req.params.id)){
//             await cartProduct.updateOne({$pull:{products:req.params.id}})
//             res.status(200).json("Product removed successfully")
//         }else{
//             res.status(200).json("This product is not in cart")
//         }
//     }catch(err){
//         res.status(500).json(err)
//     }
// })

//Delete user
orderRouter.delete('/:id',VerifyTokenAndAuthorization,async (req,res)=> {
    try{
         await Order.findByIdAndDelete(req.params.userId);
         res.status(200).json("Order deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get Order by id
orderRouter.get('/find/:id',VerifyToken,async (req,res)=> {
    try{
            const order = await User.findById(req.params.id)
            res.status(200).json(order)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all order
orderRouter.get('/all-carts',VerifyToken,async(req,res)=> {
    const query =req.query.new
    try{
        const orders = query ? await Order.find().sort({_id: -1}).limit(1) : await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Previous month income
orderRouter.get('/income',VerifyTokenAndAdmin, async(req,res)=> {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date.setMonth(lastMonth.getMonth()-1))
    try{
        const income = await Order.aggregate([
            {$match: {createdAt:{$gte: previousMonth}}},
            {
                $project:{
                    month:{$month: "$createdAt"},
                    sales:"$amount"
                }},
                {
                    $group:{
                        _id:'$month',
                        total:{$sum:"$sales"}
                    }
                }
            
        ])
        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err)
    }
})

export default orderRouter;