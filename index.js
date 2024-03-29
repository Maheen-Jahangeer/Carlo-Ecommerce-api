import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';

import authRouter from './src/routes/auth.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
dotenv.config();

const options = {
    host:process.env.PORT,
    db:process.env.MONGODB
}

mongoose.connect(options.db,(err)=> {
    if(err){
        console.log("Database connection failed", err)
    }else{
        console.log("Database connection is success")
    }
})

app.use('/auth', authRouter);

app.listen(options.host, () =>{ 
    console.log(`Server is running on port ${options.host}`)
})
