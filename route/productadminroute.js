const express = require('express')
const Product = require("../models/Product");
const {protect,admin} = require("../middleware/Authmiddleware");
const Order = require('../models/Order');


//route get /api/admin/products
//desc get all products (admin only)
//access private/admin

const router = express.Router();

router.get("/",protect,admin,async(req,res)=>{
    try{
        const products = await Product.find({});
        res.json(products) 
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})


//route PUt /api/admin/orders/:id
//desc update order status
//access private/admin
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = 
               req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = 
               req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updateOrder = await order.save();
            res.json(updateOrder);
        }else{
            res.status(404).json({message:"order not found"})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({message:"server error"})
    }
})

//route delete /api/admin/orders/:id
//desc delete an order
//access private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message:"order removed"});

        }else{
            res.status(404).json({message:"Order not found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:"serverr eerror"})   
    }
})

module.exports = router