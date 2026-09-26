const express = require('express');
const router = express.Router();
const {
  getEntries,
  addEntry,
  deleteEntry,
} = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getEntries);
router.post('/', addEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
