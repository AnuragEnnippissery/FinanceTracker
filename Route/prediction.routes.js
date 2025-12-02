import { Prediction } from "../Controller/prediction.controller.js";
import { AuthenticateUser } from "../Controller/user.controller.js";

export default function PredictionRoutes(app){
    app.get("/api/weekly/:userId",Prediction)
}