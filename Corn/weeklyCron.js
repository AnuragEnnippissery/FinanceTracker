import cron from "node-cron";
import User from "../Model/user.model.js";
import Payment from "../Model/payment.model.js";
import { sendEmailByEmail } from "../Utils/sendEmail.js";

// Runs every minute (for testing)
cron.schedule("0 16 * * MON", async () => {
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

    // Fetch weekly transactions
    const transactions = await Payment.find({
      owner: user._id,
      date: { $gte: weekAgo, $lte: now }
    });

    // Total spent
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    // --- NEW: Group by sub_category ---
    const subTotals = {};

    transactions.forEach(t => {
      if (!subTotals[t.sub_category]) {
        subTotals[t.sub_category] = 0;
      }
      subTotals[t.sub_category] += t.amount;
    });

    // Generate HTML for sub-category list
    let breakdownHTML = "<h3>Category Breakdown</h3><ul>";
    for (const [name, amount] of Object.entries(subTotals)) {
      breakdownHTML += `<li><strong>${name}</strong>: ₹${amount}</li>`;
    }
    breakdownHTML += "</ul>";

    const html = `
      <h2>Your Weekly Expense Report</h2>
      <p><strong>Total Spent:</strong> ₹${total}</p>
      ${breakdownHTML}
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
