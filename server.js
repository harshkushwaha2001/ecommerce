import express from 'express'
import morgan from 'morgan';
import dotenv from 'dotenv'
import connectDB from './config/db.js';

import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors'
import path from "path";
import {fileURLToPath} from "url";

// gfh

dotenv.config()

// rest object
const app= express();

// dbconfig 

connectDB();

//es6 module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')))


// Routes

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);


// API--

// app.get('/',(req,res)=>{

//     res.send({
//         msg :" welcome to ecommerce"
//     })
// })

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
 }) 

const PORT =process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})