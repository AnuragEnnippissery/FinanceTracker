//import express from "express";
import Payment from "../Model/payment.model.js";
import mongoose from "mongoose";

//const router = express.Router();

// Weekly finance predictor
 export async function Prediction (req, res) {
  try {
    const userId = req.params.userId // from auth middleware

     if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    console.log("User ID:", userId);
    console.log("Four weeks ago:", fourWeeksAgo);

    const result = await Payment.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          date: { $gte: fourWeeksAgo }
        }
      },
      {
        $group: {
          _id: "$sub_category",
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          sub_category: "$_id",
          totalSpent: 1,
          averageWeekly: { $divide: ["$totalSpent", 4] }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Prediction Error:", err);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
};

//export default Prediction;
