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

const photoFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'backImage', maxCount: 1 },
  { name: 'sideImage', maxCount: 1 },
]);

router.get('/', getItems);
router.post('/', photoFields, addItem);
router.put('/:id', photoFields, updateItem);
router.delete('/:id', deleteItem);

module.exports = router;