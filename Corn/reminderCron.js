import cron from "node-cron";
import Reminder from "../Model/reminder.model.js";
import User from "../Model/user.model.js";
import { sendEmailByEmail } from "../Utils/sendEmail.js";

cron.schedule("* * * * *", async () => {
  console.log("Cron: checking reminders...");

  const now = new Date();

  const reminders = await Reminder.find({
    isSent: false,
    date: { $lte: now }
  });

  for (const reminder of reminders) {
    const user = await User.findById(reminder.userId);
    if (!user || !user.email) {
      console.log("❌ Email sending failed: user has no email");
      continue;
    }

    await sendEmailByEmail(
      user.email,
      "Reminder",
      reminder.message,
      `<p>${reminder.message}</p>`
    );

    reminder.isSent = true;
    await reminder.save();
  }
});
