const Question = require('../models/Question');
const Category = require('../models/Category');
const aiService = require('../services/aiService');

const escapeRegex = (string) => (string ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// @desc    Get questions with filters & search
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, type, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.categoryName = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      const cleanSearch = escapeRegex(search);
      query.$or = [
        { questionText: { $regex: cleanSearch, $options: 'i' } },
        { idealAnswer: { $regex: cleanSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(cleanSearch, 'i')] } },
      ];
    }


    const skip = (Number(page) - 1) * Number(limit);
    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private (Admin)
exports.createQuestion = async (req, res, next) => {
  try {
    const { categoryName, role, difficulty, type, questionText, idealAnswer, keyPoints, tags } = req.body;

    if (!categoryName || !questionText || !idealAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Category, question text, and ideal answer are required.',
      });
    }

    const question = await Question.create({
      categoryName,
      role: role || 'Software Engineer',
      difficulty: difficulty || 'Medium',
      type: type || 'Technical',
      questionText,
      idealAnswer,
      keyPoints: Array.isArray(keyPoints) ? keyPoints : (keyPoints ? keyPoints.split(',').map((k) => k.trim()) : []),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      createdBy: req.user ? req.user.id : null,
    });

    // Update category question count
    await Category.findOneAndUpdate(
      { name: new RegExp(`^${escapeRegex(categoryName)}$`, 'i') },
      { $inc: { questionCount: 1 } },
      { upsert: false }
    );


    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Admin)
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const { categoryName, role, difficulty, type, questionText, idealAnswer, keyPoints, tags } = req.body;

    if (categoryName) question.categoryName = categoryName;
    if (role) question.role = role;
    if (difficulty) question.difficulty = difficulty;
    if (type) question.type = type;
    if (questionText) question.questionText = questionText;
    if (idealAnswer) question.idealAnswer = idealAnswer;
    if (keyPoints !== undefined) {
      question.keyPoints = Array.isArray(keyPoints) ? keyPoints : keyPoints.split(',').map((k) => k.trim());
    }
    if (tags !== undefined) {
      question.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Admin)
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const catName = question.categoryName;
    await question.deleteOne();

    await Category.findOneAndUpdate(
      { name: new RegExp(`^${escapeRegex(catName)}$`, 'i') },
      { $inc: { questionCount: -1 } }
    );


    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate practice answer for a single question
// @route   POST /api/questions/practice-evaluate
// @access  Private
exports.evaluatePracticeAnswer = async (req, res, next) => {
  try {
    const { questionId, userAnswer } = req.body;

    if (!questionId || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and user answer are required.',
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const result = await aiService.evaluateSinglePracticeAnswer({
      questionText: question.questionText,
      idealAnswer: question.idealAnswer,
      userAnswer,
    });

    res.status(200).json({
      success: true,
      evaluation: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories with stats
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
