const Outfit = require('../models/Outfit');

const getOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find({ user: req.user._id })
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOutfit = async (req, res) => {
  try {
    const { name, items, notes } = req.body;

    if (!name || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'Outfit name and at least one item are required' });
    }

    const outfit = await Outfit.create({
      user: req.user._id,
      name,
      items,
      notes,
    });

    const populated = await outfit.populate('items');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOutfits, createOutfit, deleteOutfit };
