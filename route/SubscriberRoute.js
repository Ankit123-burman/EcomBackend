const express = require("express")
const router = express.Router();
const Subscriber = require("../models/subscriber");

//@route POST /api/subscriber
//@desc handle newsletter subscription
//@access Public
router.post("/subscribe",async(req,res)=>{
    const {email}= req.body;
    if(!email){
        return res.status(400).json({message:"Email is requred"});

    }
    try{
        //check if the the email is already subsribed
        let subscriber = await Subscriber.findOne({email});
        
        if(subscriber){
            return res.status(400).json({message:"email is ready subscribe"})

        }

        // create a new subscriber
        subscriber = new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message:"Successfully subscribed"})
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"})
    }
})

module.exports = router