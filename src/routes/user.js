import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import {VerifyTokenAndAdmin, VerifyTokenAndAuthorization} from '../helper/verifyJson.js';

const userRouter = express.Router();

//Update user
userRouter.put('/:id', VerifyTokenAndAuthorization, async(req,res)=> {
    console.log("Enteres here")
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        const{password, name,email} = updatedUser;
        const responseData = {
            name,
            email
        }
        res.status(200).json(responseData);
    }catch(err){
        res.status(500).json(err.message)}
})

//Delete user
userRouter.delete('/:id',VerifyTokenAndAdmin,async (req,res)=> {
    try{
         await User.findByIdAndDelete(req.params.id);
         res.status(200).json("User deleted successfully")
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get user by id
userRouter.get('/find/:id',VerifyTokenAndAdmin,async (req,res)=> {
    try{
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get all users
userRouter.get('/all-users',VerifyTokenAndAdmin,async(req,res)=> {
    const query =req.query.name
    try{
        const users = query ? await User.find().sort({_id: -1}).limit(1) : await User.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err.message)
    }
})

//Get status
userRouter.get('/status', VerifyTokenAndAdmin,async (req,res)=> {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data = await User.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:lastyear
                    }
                }},
                {
                    $project:{
                        month:{$month: '$createdAt'}
                    }
                },{
                    $group:{
                        _id:'$month',
                        total: {
                            $sum: 1
                        }
                    }
                }
        ])
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err.message)
    }
})

export default userRouter;