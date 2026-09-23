const express = require('express');
const router = express.Router();
const {
  createInterview,
  getUserInterviews,
  getInterviewById,
  autosaveAnswer,
  submitInterview,
  getInterviewReport,
  deleteInterview,
} = require('../controllers/interviewController');
const { uploadResumeAndGenerate } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/', createInterview);
router.get('/', getUserInterviews);
router.post('/resume-upload', uploadResume.single('resume'), uploadResumeAndGenerate);
router.get('/:id', getInterviewById);
router.put('/:id/autosave', autosaveAnswer);
router.post('/:id/submit', submitInterview);
router.get('/:id/report', getInterviewReport);
router.delete('/:id', deleteInterview);

module.exports = router;
