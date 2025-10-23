const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL_ENV);
        console.log("MongoDB Connected succssfuly");
    }catch(err){
        console.error("MongoDB connection faield",err);
        process.exit(1)
    }
}

module.exports = connectDB