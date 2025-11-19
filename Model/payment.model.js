import mongoose from "mongoose";
//import UserModel from "./user.model";

let PaymentSchema =new mongoose.Schema({
    
    category:{
        type:String,
        required:true
    },
    sub_category:{
        type:String,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // links to the User model
        required: true,
    },
    date:{
        type:Date,
        default: Date.now
    },
    mode:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:Number,
        required:true
    },
})

let PaymentModel=new mongoose.model("Payment",PaymentSchema);
export default PaymentModel;