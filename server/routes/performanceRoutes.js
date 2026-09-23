const express = require('express');
const router = express.Router();
const { getUserPerformance } = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserPerformance);

module.exports = router;
