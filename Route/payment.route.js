import { GetPaymentsByUser,InsertPayment, PaymentSummary,
    GetDairy,GetVegetable,GetSubCategory } from "../Controller/payment.controller.js";
import { AuthenticateUser } from "../Controller/user.controller.js";

export default function PaymentRoutes(app){
    app.post("/api/payment/add",InsertPayment),
    app.get("/api/payment/user/:userId",GetPaymentsByUser)
    app.get("/api/payment/user/summary/:userId",AuthenticateUser,PaymentSummary)
    app.get("/api/payment/dairy/:userId",GetDairy)
    app.get("/api/payment/vegetable/:userId",GetVegetable)
    app.get("/api/payment/:userId/:sub_category",AuthenticateUser,GetSubCategory)
}