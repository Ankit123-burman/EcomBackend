const express  = require('express')
const cors = require('cors');
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const userRoutes = require('./route/userRoute')
const productsRoutes = require('./route/ProductRoutes')
const cartRoutes = require('./route/CartRoute')
const checkoutRoutes = require("./route/CheckoutRoute")
const orderRoutes = require("./route/orderRoute")
const uploade = require("./route/upload")
const subscriberRoute = require("./route/SubscriberRoute")
const adminroutes = require("./route/adminroute")

const app = express();
app.use(express.json())
app.use(cors());

dotenv.config()

const PORT = process.env.PORT || 9000;

connectDB()

app.get("/",(req,res)=>{
    res.send("Welcome to the site")
})
// api routes
app.use("/api/users",userRoutes);
app.use("/api/products",productsRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploade);
app.use("/api",subscriberRoute);

//admin
app.use("/api/admin/users",adminroutes);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);   
})