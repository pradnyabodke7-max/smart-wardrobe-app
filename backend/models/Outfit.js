const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClothingItem',
        required: true,
      },
    ],
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Outfit', outfitSchema);
