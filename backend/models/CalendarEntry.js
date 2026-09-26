const mongoose = require('mongoose');

const calendarEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    outfit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outfit',
      required: true,
    },
    date: { type: String, required: true },
    note: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

calendarEntrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CalendarEntry', calendarEntrySchema);
