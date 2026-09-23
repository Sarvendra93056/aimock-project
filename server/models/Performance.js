const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    technicalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    communicationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    problemSolvingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    strongAreas: [{ type: String }],
    weakAreas: [{ type: String }],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

performanceSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Performance', performanceSchema);
