const mongoose = require("mongoose")
const dotenv = require("dotenv");
const Product = require("./models/Product")
const User = require("./models/User");
const Cart = require("./models/Cart")

const products = require('./Data/Productsdata')

dotenv.config();

//coneect to mongoDB
mongoose.connect(process.env.MONGO_URL_ENV);
//Function to seed data
const seedData = async () =>{
    try{
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a default admin user
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin",
        });

        //assinf the default user ID to each product

        const userID = createdUser._id;
        const sampleProducts = products.map((product)=>{
            return {...product,user:userID}
        });

        //Insert the product into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfuly");
        process.exit();
    }catch(error){
            console.error("Error seeding the data",error);
            process.exit(1);
        }
}

seedData()