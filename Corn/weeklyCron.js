import cron from "node-cron";
import User from "../Model/user.model.js";
import Payment from "../Model/payment.model.js";
import { sendEmailByEmail } from "../Utils/sendEmail.js";

// Runs every minute (for testing)
// Change later to: "0 16 * * MON" for Monday 4 PM
cron.schedule("* * * * *", async () => {
  console.log("Cron: weekly report running...");

  const users = await User.find();

  for (const user of users) {
    if (!user.email) {
      console.log(`❌ Skipping user ${user._id}, no email`);
      continue;
    }

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const transactions = await Payment.find({
      owner: user._id,
      date: { $gte: weekAgo, $lte: now }
    });

    // Calculate total spent
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Simple HTML template (you can customize later)
    const html = `
      <h2>Your Weekly Expense Report</h2>
      <p><strong>Total Spent:</strong> ₹${total}</p>
    `;

    try {
      await sendEmailByEmail(
        user.email,
        "Weekly Expense Report",
        `Total spent: ₹${total}`,
        html
      );

      console.log(`📧 Weekly report sent to ${user.email}`);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }
  }
});
