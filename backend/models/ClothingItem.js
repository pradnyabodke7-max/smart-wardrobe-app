const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Accessory'],
    },
    brand: { type: String, trim: true, default: '' },
    fabric: { type: String, trim: true, default: '' },
    color: { type: String, trim: true, default: '' },
    imageUrl: { type: String, required: true },
    backImageUrl: { type: String, default: '' },
    sideImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClothingItem', clothingItemSchema);