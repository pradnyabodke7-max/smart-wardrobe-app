const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} = require('../controllers/closetController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getItems);
router.post('/', upload.single('image'), addItem);
router.put('/:id', upload.single('image'), updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
