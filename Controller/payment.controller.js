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
        const{category,sub_category,owner,mode,description,amount,date}=req.body;
        const newPayment =new PaymentModel({
            category,
            sub_category,
            owner,
            mode,
            description,
            amount,
            date: date ? new Date(date) : new Date() 
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
        //res.set("Cache-Control", "no-store");  // <-- add this
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

export async function GetDairy(req,res){
    try{
        const { userId } = req.params;
        const dairyData = await PaymentModel.find({owner: userId , sub_category: "dairy" }); 
         return res.status(200).json(dairyData);
    }
    catch(err){
         res.status(500).json({ message: err.message });
    }

}
export async function GetVegetable(req,res){
    try{
        const { userId } = req.params;
        const VegetableData = await PaymentModel.find({owner: userId , sub_category: "vegetable" }); 
         return res.status(200).json(VegetableData);
    }
    catch(err){
         res.status(500).json({ message: err.message });
    }

}
export async function GetSubCategory(req, res) {
    try {
        const { userId, sub_category } = req.params;

        const data = await PaymentModel.find({
            owner: userId,
            sub_category: sub_category.toLowerCase()   // normalize
        }).sort({ date: -1 });;

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
