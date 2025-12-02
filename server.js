import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./Route/user.route.js";
import PaymentRoutes from "./Route/payment.route.js";
import dotenv from "dotenv";
import ReminderRoutes from "./Route/reminder.route.js";
import "./Corn/reminderCron.js";
import "./Corn/weeklyCron.js"
import PredictionRoutes from "./Route/prediction.routes.js";

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
UserRoutes(app);
PaymentRoutes(app);
ReminderRoutes(app);
PredictionRoutes(app);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
//console.log("EMAIL:", process.env.SENDER_EMAIL);
//console.log("PASS:", process.env.SENDER_PASSWORD);
