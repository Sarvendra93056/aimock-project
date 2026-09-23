const multer = require('multer');
const path = require('path');

// Store uploaded files in memory buffer for immediate PDF text extraction
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext) || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents are allowed for resume analysis.'), false);
  }
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter,
});

module.exports = { uploadResume };
