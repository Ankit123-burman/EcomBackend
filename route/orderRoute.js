const express = require("express");
const Order = require("../models/Order")
const {protect} = require("../middleware/Authmiddleware")

const router = express.Router();

//@route GET /api/order/my-orders
//@desc Get logged in user orders
//@access private
router.get("/my-orders",protect,async(req,res)=>{
    try{
        //find orders for the authenticated user
        console.log("Authenticated user:", req.user);
        const orders = await Order.find({user:req.user.id}).sort({
            createdAt:-1,
        })//sort by most recent orders
        res.json(orders);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"});

    }
});

//route get /api/orderes/:id
//@desc vget order details by id
//@access private
router.get("/:id",protect,async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        if(!order){
            return res.status(404).json({message:"order  not found"});

        }
        //return the full order details
        res.json(order);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server errror"})
    }
});
module.exports = router;