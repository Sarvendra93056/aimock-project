const Interview = require('../models/Interview');
const Performance = require('../models/Performance');
const aiService = require('../services/aiService');

// @desc    Create new interview and generate questions
// @route   POST /api/interviews
// @access  Private
exports.createInterview = async (req, res, next) => {
  try {
    const {
      jobRole = 'Software Engineer',
      experienceLevel = 'Fresher',
      interviewType = 'Technical',
      difficulty = 'Medium',
      totalQuestions = 5,
      durationMinutes = 30,
      title,
    } = req.body;

    const questions = await aiService.generateInterviewQuestions({
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      totalQuestions,
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

    const interview = await Interview.create({
      user: req.user.id,
      title: title || `${jobRole} - ${interviewType} Mock Interview`,
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      totalQuestions: questions.length,
      durationMinutes: Number(durationMinutes) || 30,
      status: 'in-progress',
      questions,
      answers: initialAnswers,
    });

    res.status(201).json({
      success: true,
      message: 'Interview session generated successfully',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's interviews list with statistics
// @route   GET /api/interviews
// @access  Private
exports.getUserInterviews = async (req, res, next) => {
  try {
    const { role, type, status, limit = 50 } = req.query;
    const query = { user: req.user.id };

    if (role) query.jobRole = role;
    if (type) query.interviewType = type;
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview by ID
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Ensure user owns this interview or is admin
    if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this interview',
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Autosave answer for an in-progress question
// @route   PUT /api/interviews/:id/autosave
// @access  Private
exports.autosaveAnswer = async (req, res, next) => {
  try {
    const { questionIndex, userAnswer, timeSpentSeconds } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview is already completed and cannot be modified.',
      });
    }

    if (timeSpentSeconds !== undefined) {
      interview.timeSpentSeconds = Number(timeSpentSeconds);
    }

    // Update answer
    const answerEntry = interview.answers.find((a) => a.questionIndex === Number(questionIndex));
    if (answerEntry) {
      answerEntry.userAnswer = userAnswer || '';
      answerEntry.savedAt = new Date();
    } else {
      const qText = interview.questions[questionIndex]?.questionText || `Question ${questionIndex + 1}`;
      interview.answers.push({
        questionIndex: Number(questionIndex),
        questionText: qText,
        userAnswer: userAnswer || '',
        savedAt: new Date(),
      });
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Draft answer auto-saved',
      savedAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit interview for full AI evaluation
// @route   POST /api/interviews/:id/submit
// @access  Private
exports.submitInterview = async (req, res, next) => {
  try {
    const { answers: submittedAnswers, timeSpentSeconds } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (timeSpentSeconds !== undefined) {
      interview.timeSpentSeconds = Number(timeSpentSeconds);
    }

    // Merge any answers sent in the submit payload
    if (Array.isArray(submittedAnswers) && submittedAnswers.length > 0) {
      submittedAnswers.forEach((sub) => {
        const existing = interview.answers.find((a) => a.questionIndex === sub.questionIndex);
        if (existing) {
          existing.userAnswer = sub.userAnswer;
        } else {
          interview.answers.push({
            questionIndex: sub.questionIndex,
            questionText: sub.questionText || interview.questions[sub.questionIndex]?.questionText || '',
            userAnswer: sub.userAnswer || '',
          });
        }
      });
    }

    // Evaluate answers via AI service
    const evaluationResults = await aiService.evaluateInterviewAnswers({
      jobRole: interview.jobRole,
      difficulty: interview.difficulty,
      interviewType: interview.interviewType,
      questions: interview.questions,
      answers: interview.answers,
    });

    // Populate answers with detailed evaluations
    interview.answers.forEach((ans) => {
      const evaluated = evaluationResults.evaluatedAnswers?.find((e) => e.questionIndex === ans.questionIndex);
      if (evaluated) {
        ans.evaluation = {
          score: evaluated.score,
          technicalScore: evaluated.technicalScore,
          relevanceScore: evaluated.relevanceScore,
          completenessScore: evaluated.completenessScore,
          communicationScore: evaluated.communicationScore,
          problemSolvingScore: evaluated.problemSolvingScore,
          feedback: evaluated.feedback,
          strengths: evaluated.strengths || [],
          improvements: evaluated.improvements || [],
          topicsToRevise: evaluated.topicsToRevise || [],
          suggestedIdealAnswer: evaluated.suggestedIdealAnswer || '',
        };
      }
    });

    interview.overallScore = evaluationResults.overallScore;
    interview.technicalScore = evaluationResults.technicalScore;
    interview.communicationScore = evaluationResults.communicationScore;
    interview.problemSolvingScore = evaluationResults.problemSolvingScore;
    interview.overallFeedback = evaluationResults.overallFeedback;
    interview.strongAreas = evaluationResults.strongAreas || [];
    interview.weakAreas = evaluationResults.weakAreas || [];
    interview.topicsToRevise = evaluationResults.topicsToRevise || [];
    interview.recommendations = evaluationResults.recommendations || [];
    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    // Create a Performance history record for analytics
    await Performance.create({
      user: req.user.id,
      interview: interview._id,
      jobRole: interview.jobRole,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      overallScore: interview.overallScore,
      technicalScore: interview.technicalScore,
      communicationScore: interview.communicationScore,
      problemSolvingScore: interview.problemSolvingScore,
      strongAreas: interview.strongAreas,
      weakAreas: interview.weakAreas,
      date: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Interview evaluated and completed successfully',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed interview report
// @route   GET /api/interviews/:id/report
// @access  Private
exports.getInterviewReport = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview report not found',
      });
    }

    if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report',
      });
    }

    res.status(200).json({
      success: true,
      report: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private
exports.deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview',
      });
    }

    await interview.deleteOne();
    await Performance.deleteMany({ interview: interview._id });

    res.status(200).json({
      success: true,
      message: 'Interview and associated records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
