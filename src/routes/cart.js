import express from 'express';
import bcrypt from 'bcrypt';
import Cart from '../models/Cart.js';
import {VerifyTokenAndAdmin, VerifyTokenAndAuthorization, VerifyToken} from '../helper/verifyJson.js';

const cartRouter = express.Router();

//Create a cart
cartRouter.post('/add', VerifyToken, async(req,res)=> {
    try{
        const newCart = new Cart({
            userId:req.user._id,
            products:req.body.product
        })
        await newCart.save();
        res.status(200).json(newCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//Update cart
cartRouter.put('/update/increase-product/:id',VerifyTokenAndAuthorization, async(req,res) => {
    const qDecrease = req.params.decrease;
    const cartProducts = await Cart.findById(req.user._id)
    const productIndex = cartProducts.products.findIndex((product) => product.productId == req.params.id)
    const productQuantity = cartProducts.products[productIndex].quantity
    try{
        if(!cartProducts?.products.includes(req.params.id)){
            await cartProducts.updateOne({$push:{products:req.params.id}})
            res.status(200).json("Product added successfully")
        }
        else if(qDecrease && productQuantity == 1){
            await cartProducts.updateOne({$pull:{products:req.params.id}})
            res.status(200).json("Product is removed from cart")
        }
        else if(qDecrease && productQuantity > 1){
            await cartProducts.updateOne({$inc:{quantity:-1}})
            res.status(200).json('Product decreased successfully')
        }
        else{
            await cartProducts.updateOne({$inc:{quantity:1}})
            res.status(200).json("Quantity changes successfully")
        }
    }catch(err){
        res.status(200).json(err)
    }
})

//remove product from cart
cartRouter.put('/remove-product/:id',VerifyTokenAndAuthorization,async(req,res)=> {
    const cartProduct = await Cart.findById({userId:req.user._id})
    try{
        if(cartProduct.products.includes(req.params.id)){
            await cartProduct.updateOne({$pull:{products:req.params.id}})
            res.status(200).json("Product removed successfully")
        }else{
            res.status(200).json("This product is not in cart")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//Delete user
cartRouter.delete('/:userId',VerifyTokenAndAdmin,async (req,res)=> {
    try{
         await User.findByIdAndDelete(req.params.userId);
         res.status(200).json("Cart deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get cart by id
cartRouter.get('/find/:userId',VerifyTokenAndAdmin,async (req,res)=> {
    try{
            const cart = await User.findById(req.params.userId)
            res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all carts
cartRouter.get('/all-carts',VerifyTokenAndAdmin,async(req,res)=> {
    const query =req.query.new
    try{
        const carts = query ? await Cart.find().sort({_id: -1}).limit(1) : await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err.message)
    }
})

export default cartRouter;