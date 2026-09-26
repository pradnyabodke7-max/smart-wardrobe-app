const CalendarEntry = require('../models/CalendarEntry');

const getEntries = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { user: req.user._id };
    if (month) query.date = { $regex: `^${month}` };

    const entries = await CalendarEntry.find(query)
      .populate({ path: 'outfit', populate: { path: 'items' } })
      .sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addEntry = async (req, res) => {
  try {
    const { outfit, date, note } = req.body;
    if (!outfit || !date) {
      return res.status(400).json({ message: 'Outfit and date are required' });
    }

    const entry = await CalendarEntry.findOneAndUpdate(
      { user: req.user._id, date },
      { outfit, note, user: req.user._id, date },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate({ path: 'outfit', populate: { path: 'items' } });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await CalendarEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEntries, addEntry, deleteEntry };
