import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import {VerifyJson, VerifyTokenAndAdmin, VerifyTokenAndAuthorization} from '../helper/verifyJson';

const userRouter = express.Router();

//Update user
userRouter.put('/:id', VerifyTokenAndAuthorization, async(req,res)=> {
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        const{password, ...other} = updatedUser;
        res.status(200).json(other);
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
userRouter.get('/:id',VerifyTokenAndAdmin,async (req,res)=> {
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

export default userRouter;