import PaymentModel from "../Model/payment.model.js";
import mongoose from "mongoose";

export async function GetPaymentsByUser(req, res) {
    try {
        const { userId } = req.params;
        //console.log("REQ PARAM userId =>", userId);
        const userPayments = await PaymentModel.find({ owner: userId });
        //console.log("Result =>", userPayments);
        return res.status(200).json(userPayments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



export async function InsertPayment(req,res){
    try{
        const{category,sub_category,owner,mode,description,amount}=req.body;
        const newPayment =new PaymentModel({
            category,
            sub_category,
            owner,
            mode,
            description,
            amount
        })
        await newPayment.save() //inserted into db
        res.status(200).json({message:"payment details added",newPayment})
    }
    catch(err){
        res.status(500).json({message:err})
    }
}

export async function PaymentSummary(req, res) {
    try {
        const { userId } = req.params;
        //console.log(userId)
        const summary = await PaymentModel.aggregate([
           { $match: { 
                    owner: new mongoose.Types.ObjectId(userId) 
                } 
            },
            {
                $group: {
                    _id: "$sub_category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
//console.log(summary)
        return res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

