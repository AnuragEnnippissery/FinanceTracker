import { createReminder } from "../Controller/reminder.controller.js";
export default function ReminderRoutes(app){
    app.post("/api/reminder/:userId",createReminder);
}