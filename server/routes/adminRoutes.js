const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  getAllInterviews,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/interviews', getAllInterviews);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
