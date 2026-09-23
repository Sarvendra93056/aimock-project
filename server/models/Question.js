const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'Software Engineer',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    type: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'System Design'],
      default: 'Technical',
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    idealAnswer: {
      type: String,
      required: [true, 'Ideal answer is required'],
    },
    keyPoints: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isSystemSeeded: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ categoryName: 1, difficulty: 1, type: 1 });
questionSchema.index({ questionText: 'text', idealAnswer: 'text' });

module.exports = mongoose.model('Question', questionSchema);
