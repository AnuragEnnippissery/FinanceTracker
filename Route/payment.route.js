import { GetPaymentsByUser,InsertPayment, PaymentSummary } from "../Controller/payment.controller.js";

export default function PaymentRoutes(app){
    app.post("/api/payment/add",InsertPayment),
    app.get("/api/payment/user/:userId",GetPaymentsByUser)
    app.get("/api/payment/user/summary/:userId",PaymentSummary)
}