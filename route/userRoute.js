const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const router = express.Router()

//@route Post /api/users/register
//@desc register a new user
//@access public
router.post("/register",async (req,res)=>{
    const {name,email,password}  =req.body;
    try{
       //registertion logic
       let user = await User.findOne({email});

       if(user) return res.status(400).json({message:"User already exists"});

       user = new User({name,email,password});
       await user.save();

       //create jwt payload
       const payload = {user:{id:user.id,role:user.role}};
       //sign and return the token along with user data
       jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
        if(err) throw err;
        //send the user and token in response
        res.status(201).json({
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            token,
        })
       })

    }catch(error){
        console.log(error);
        res.send(500).send("server error")
    }
});

//@route POST/ api/user/login
//@description auth user
//@access public
router.post("/login",async(req,res)=>{
    const{email,password} = req.body;
    try{
        let user = await User.findOne({email});

        if(!user) return res.status(400).json({message:"Invalid Credentials"});
        const isMatch = await user.matchPassword(password);

        if(!isMatch)
            return res.status(400).json({message:"Invalid Credentials"});
         const payload = {user:{id:user.id,role:user.role}};
       //sign and return the token along with user data
       jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
        if(err) throw err;
        //send the user and token in response
        res.json({
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            token,
        })
       })
    }catch(error){
        console.error(error);
        res.status(500).send("server error")
        
    }

})


module.exports = router