const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'InterviewAI API',
    timestamp: new Date().toISOString(),
    aiProvider: process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'fallback-engine'),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/performance', require('./routes/performanceRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/categories', require('./routes/questionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 & Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 InterviewAI Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🧠 AI Engine: ${process.env.GEMINI_API_KEY ? 'Google Gemini' : 'Intelligent CS Engine'}`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server alive in development
});

module.exports = app;
