import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true },   // exact time chosen by user
  isSent: { type: Boolean, default: false } // prevents sending twice
});

export default mongoose.model('Reminder', ReminderSchema);
