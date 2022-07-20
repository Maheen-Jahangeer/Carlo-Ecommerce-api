import express from 'express';
import bcrypt from 'bcrypt';
import Products from '../models/Products.js';
import multer from 'multer';
import fs from 'fs';
import {VerifyTokenAndAdmin, VerifyTokenAndAuthorization} from '../helper/verifyJson.js';

const productsRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'src/images')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

//Add products
productsRouter.post('/add',VerifyTokenAndAdmin,upload.single('image'), async (req,res) => {
    try{
        const newProduct = await new Products({
            title:req.body.title,
            desc:req.body.desc,
            image:{
                data:fs.readFileSync('src/images/'+req.file.filename),
                contentType:'image/jpg'
            },
            categories:req.body.categories,
            color:req.body.color,
            size:req.body.size,
            price:req.body.price
        })
        await newProduct.save();
        res.status(200).json(newProduct);
    }catch(e) {
        res.status(500).json(e.message)
    }
})


//Update Products
productsRouter.put('/:id', VerifyTokenAndAdmin,upload.single('image'), async(req,res)=> {
    try{
        if(req.file){
            const title = req.body.title
            const desc = req.body.desc
            const image  = {
                data: fs.readFileSync('src/images/'+req.file.filename),
                contentType:'images/jpg'
            }
            const color =  req.body.color
            const size = req.body.size
            const price = req.body.price
            
            const updatedProducts = await Products.findByIdAndUpdate(req.params.id, {
                $set : {
                    title, desc, image, color, size, price
                }
            })
            res.status(200).json(updatedProducts);
        }
        const updatedProducts = await Products.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedProducts);
    }catch(err){
        res.status(500).json(err.message)}
})

//Delete Products
productsRouter.delete('/:id',VerifyTokenAndAdmin,async (req,res)=> {
    try{
         await Products.findByIdAndDelete(req.params.id);
         res.status(200).json("Products deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get Products by id
productsRouter.get('/find/:id',VerifyTokenAndAdmin,async (req,res)=> {
    try{
            const products = await Products.findById(req.params.id)
            res.status(200).json(products)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all Productss
productsRouter.get('/all-Productss',VerifyTokenAndAdmin,async(req,res)=> {
    const qNew =req.query.name
    const qCategories = req.query.categories;
    try{
        let products = [];
        if(qNew){
        products = await Products.find().sort({_id: -1}).limit(1) }
        else if(qCategories){
        products = await Products.find({categories: {
                $in:[qCategories]
            }})
        }
        else{
            products = await Products.find()
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err.message)
    }
})

export default productsRouter;