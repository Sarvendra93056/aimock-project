const User = require('../models/User');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Category = require('../models/Category');

// @desc    Get platform-wide admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });
    const totalQuestions = await Question.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Calculate platform average score
    const avgScoreResult = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } },
    ]);
    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Interviews by role
    const roleStats = await Interview.aggregate([
      { $group: { _id: '$jobRole', count: { $sum: 1 }, avgScore: { $avg: '$overallScore' } } },
      { $sort: { count: -1 } },
    ]);

    // Recent platform interviews
    const recentInterviews = await Interview.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalInterviews,
        completedInterviews,
        averageScore,
        totalQuestions,
        totalCategories,
        roleStats: roleStats.map((r) => ({
          role: r._id,
          count: r.count,
          avgScore: Math.round(r.avgScore || 0),
        })),
        recentInterviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with interview counts
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const interviewCount = await Interview.countDocuments({ user: u._id });
        const completedCount = await Interview.countDocuments({ user: u._id, status: 'completed' });
        return {
          ...u.toObject(),
          interviewCount,
          completedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews across platform
// @route   GET /api/admin/interviews
// @access  Private (Admin)
exports.getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user/admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user or admin.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
