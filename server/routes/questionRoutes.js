const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  evaluatePracticeAnswer,
  getCategories,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getQuestions);
router.get('/categories', getCategories);
router.post('/practice-evaluate', protect, evaluatePracticeAnswer);
router.get('/:id', getQuestionById);

// Admin-only question management
router.post('/', protect, authorize('admin'), createQuestion);
router.put('/:id', protect, authorize('admin'), updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);

module.exports = router;
