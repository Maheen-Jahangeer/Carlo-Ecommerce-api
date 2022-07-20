import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/register',async(req,res)=> {
        const hashedPaassword = await bcrypt.hash(req.body.password,10)
        const newUser =new User({
            name:req.body.userName,
            email:req.body.email,
            password:hashedPaassword
        })
        try{
        const user = await newUser.save();
        res.status(200).json(user)}
    catch(e){
        res.status(500).json(e.message)
    }
})

authRouter.post('/login',async (req,res)=> {
    try{
        const user = await User.findOne({email:req.body.email})
        if(user){
            const currentUserPassword =  await bcrypt.compare(req.body.password, user?.password)
            if(currentUserPassword){
                const accessKey = await Jwt.sign({
                    id : user._id,
                    isAdmin : user.isAdmin
                }, process.env.JWTKEY)
                res.status(200).json({user, accessKey});    
            }else{
                res.status(401).json("Un authenticated")
            }
        }
        else{
            res.status(500).json("This user is not available")
        }
    }catch(e){
        res.status(500).json(e.message)
    }
})

export default authRouter;