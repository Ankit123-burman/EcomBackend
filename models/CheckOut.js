const mongoose = require('mongoose')
const checkoutitemSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        require:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true, 
    },
    price:{
        type:Number,
        require:true,
    },
},
 {id:false}
)

const checkoutSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    checkoutItem: [checkoutItemSchema],
    shippingAddress:{
        address:{type:String,required:true},
        city:{type:String, required:true},
        postalCode:{type:String, required:true},
        country:{type:String, required:true},
    },
    PaymentMethod:{
        type:String,
        required:true,
    },
    totalPrice:{
        type:Number,
        require:true,
    },
    isPaid:{
        type:Boolean,
        default: false,
    },
    paidAt:{
        type:Date,
    },
    paymentStatus:{
        type:String,
        default:"pending"
    },
    PaymentDetails:{
        type:mongoose.Schema.Types.Mixed,
    },
    isFinalized:{
        type:Boolean,
        default:false,
    },
    finalizedAt:{
        type:Date,
    },

},
{timestamps:true}
)

module.exports = mongoose.model("Checkout",checkoutSchema)
