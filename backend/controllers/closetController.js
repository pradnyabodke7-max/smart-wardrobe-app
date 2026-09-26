const ClothingItem = require('../models/ClothingItem');

const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const items = await ClothingItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addItem = async (req, res) => {
  try {
    const { name, category, brand, fabric, color } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: 'Name and category are required' });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'A photo of the item is required' });
    }

    const item = await ClothingItem.create({
      user: req.user._id,
      name,
      category,
      brand,
      fabric,
      color,
      imageUrl: req.file.path,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { name, category, brand, fabric, color } = req.body;
    if (name) item.name = name;
    if (category) item.category = category;
    if (brand !== undefined) item.brand = brand;
    if (fabric !== undefined) item.fabric = fabric;
    if (color !== undefined) item.color = color;
    if (req.file) item.imageUrl = req.file.path;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
