const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Mock Interview Session',
    },
    jobRole: {
      type: String,
      required: true,
      default: 'Software Engineer',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid-level', 'Senior'],
      default: 'Fresher',
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Mixed'],
      default: 'Technical',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    questions: [
      {
        questionIndex: { type: Number },
        questionText: { type: String, required: true },
        category: { type: String, default: 'General' },
        difficulty: { type: String, default: 'Medium' },
        type: { type: String, default: 'Technical' },
        idealAnswerHint: { type: String, default: '' },
        projectContext: { type: String, default: '' },
      },
    ],
    answers: [
      {
        questionIndex: { type: Number, required: true },
        questionText: { type: String, required: true },
        userAnswer: { type: String, default: '' },
        savedAt: { type: Date, default: Date.now },
        evaluation: {
          score: { type: Number, default: 0 },
          technicalScore: { type: Number, default: 0 },
          relevanceScore: { type: Number, default: 0 },
          completenessScore: { type: Number, default: 0 },
          communicationScore: { type: Number, default: 0 },
          problemSolvingScore: { type: Number, default: 0 },
          feedback: { type: String, default: '' },
          strengths: [{ type: String }],
          improvements: [{ type: String }],
          topicsToRevise: [{ type: String }],
          suggestedIdealAnswer: { type: String, default: '' },
        },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    problemSolvingScore: {
      type: Number,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    strongAreas: [{ type: String }],
    weakAreas: [{ type: String }],
    topicsToRevise: [{ type: String }],
    recommendations: [{ type: String }],
    isResumeBased: {
      type: Boolean,
      default: false,
    },
    resumeData: {
      fileName: { type: String },
      extractedSkills: [{ type: String }],
      extractedProjects: [
        {
          title: { type: String },
          techStack: [{ type: String }],
          description: { type: String },
        },
      ],
      experienceSummary: { type: String },
      educationSummary: { type: String },
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
