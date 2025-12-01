//import Reminder from "../models/Reminder.js";
import reminderModel from "../Model/reminder.model.js";

export async function createReminder(req, res) {
  try {
    const { userId, message, date } = req.body;

    const newReminder = await reminderModel.create({
      userId,
      message,
      date
    });

    res.status(201).json({ success: true, data: newReminder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
