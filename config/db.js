import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
     
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongodb database success : ${conn.connection.host}`)


    }catch(err){
        console.log("Error in mongo db : ",err);
    }
}

export default connectDB