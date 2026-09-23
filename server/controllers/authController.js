const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, targetRole, experienceLevel, college, branch, graduationYear } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetRole: targetRole || 'Software Engineer',
      experienceLevel: experienceLevel || 'Fresher',
      college: college || '',
      branch: branch || 'Computer Science and Engineering',
      graduationYear: graduationYear || 2026,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, targetRole, experienceLevel, bio, college, branch, graduationYear } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (targetRole) user.targetRole = targetRole;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (bio !== undefined) user.bio = bio;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (graduationYear) user.graduationYear = graduationYear;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};
