const express = require("express")
const user = require("../models/User")
const {protect,admin} = require("../middleware/Authmiddleware");
const User = require("../models/User");

const router = express.Router();

//@router get /api/admmin/users
//desc get all users (admin only)
//access private/admin
router.get("/",protect,admin,async(req,res)=>{
    try{
        const users = await User.find({});
        res.json(users);

    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"})
    }
})
//@route post /api/admin/users
//@desc add a user (admin nonly)
//access private/admin
router.post("/",protect,admin,async(req,res)=>{
    const {name,email,password,role} = req.body;
    try{
        let user = await  User.findOne({email})
        if(user){
            return res.status(400).json({message:"user already exsist"})
        }
        user = new User({
            name,
            email,
            password,
            role:role||"customer",
        });
        await user.save()
        res.status(201).json({message:"User created successfully",user})
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server errror"})   
    }
})
//route put /api/admin/users/:id
//desc update user info {adminonly } - name email and role
//access privete admin
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

        }
        const updateUser = await user.save();
        res.json({message:"user updated ",user:updateUser})
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"})
        
    }
})


//route delete /api/admin/users/:id
//desc delete a user
//access private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"user deleted successfully"});

        }else{
            res.status(404).json({message:"userr nnot fond"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server err "})
    }
})

module.exports = router;