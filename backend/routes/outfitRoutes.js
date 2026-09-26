const express = require('express');
const router = express.Router();
const {
  getOutfits,
  createOutfit,
  deleteOutfit,
} = require('../controllers/outfitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getOutfits);
router.post('/', createOutfit);
router.delete('/:id', deleteOutfit);

module.exports = router;
