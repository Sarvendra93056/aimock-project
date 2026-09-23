const { parseResumePDF } = require('../services/resumeParser');
const aiService = require('../services/aiService');
const Interview = require('../models/Interview');

// @desc    Upload PDF resume, extract projects/skills, and generate project-targeted interview
// @route   POST /api/interviews/resume-upload
// @access  Private
exports.uploadResumeAndGenerate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF resume file.',
      });
    }

    const {
      jobRole = 'Full Stack Developer',
      difficulty = 'Medium',
      experienceLevel = 'Fresher',
      totalQuestions = 5,
    } = req.body;

    // 1. Parse PDF buffer
    const parsedData = await parseResumePDF(req.file.buffer, req.file.originalname);

    // 2. Generate customized questions tailored directly to resume projects & skills
    const questions = await aiService.generateInterviewQuestions({
      jobRole,
      experienceLevel,
      interviewType: 'Technical',
      difficulty,
      totalQuestions: Number(totalQuestions) || 5,
      resumeData: parsedData,
    });

    const initialAnswers = questions.map((q, idx) => ({
      questionIndex: idx,
      questionText: q.questionText,
      userAnswer: '',
      evaluation: {
        score: 0,
        technicalScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        feedback: '',
        strengths: [],
        improvements: [],
        topicsToRevise: [],
        suggestedIdealAnswer: '',
      },
    }));

    // 3. Create Interview session linked with resume metadata
    const interview = await Interview.create({
      user: req.user.id,
      title: `Resume-Targeted Interview (${parsedData.fileName})`,
      jobRole,
      experienceLevel,
      interviewType: 'Technical',
      difficulty,
      totalQuestions: questions.length,
      durationMinutes: 30,
      status: 'in-progress',
      isResumeBased: true,
      resumeData: parsedData,
      questions,
      answers: initialAnswers,
    });

    res.status(201).json({
      success: true,
      message: 'Resume parsed and targeted interview generated successfully',
      parsedResume: {
        fileName: parsedData.fileName,
        extractedSkills: parsedData.extractedSkills,
        extractedProjects: parsedData.extractedProjects,
        educationSummary: parsedData.educationSummary,
        experienceSummary: parsedData.experienceSummary,
      },
      interview,
    });
  } catch (error) {
    next(error);
  }
};
