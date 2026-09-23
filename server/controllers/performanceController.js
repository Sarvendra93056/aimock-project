const Interview = require('../models/Interview');
const Performance = require('../models/Performance');

// @desc    Get aggregate performance analytics for current user
// @route   GET /api/performance
// @access  Private
exports.getUserPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all completed interviews for this user
    const completedInterviews = await Interview.find({
      user: userId,
      status: 'completed',
    }).sort({ completedAt: 1 });

    const totalInterviews = completedInterviews.length;

    if (totalInterviews === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalInterviews: 0,
          averageScore: 0,
          highestScore: 0,
          technicalScore: 0,
          communicationScore: 0,
          problemSolvingScore: 0,
          strongAreas: [],
          weakAreas: [],
          scoreHistory: [],
          roleBreakdown: [],
          radarData: [
            { subject: 'Technical Depth', score: 0 },
            { subject: 'Communication', score: 0 },
            { subject: 'Problem Solving', score: 0 },
            { subject: 'Relevance', score: 0 },
            { subject: 'Completeness', score: 0 },
          ],
        },
      });
    }

    // Aggregations
    let totalScore = 0;
    let highestScore = 0;
    let totalTech = 0;
    let totalComm = 0;
    let totalProblemSolving = 0;

    const strongAreasCount = {};
    const weakAreasCount = {};
    const roleStats = {};

    const scoreHistory = completedInterviews.map((iv, idx) => {
      totalScore += iv.overallScore;
      if (iv.overallScore > highestScore) highestScore = iv.overallScore;
      totalTech += iv.technicalScore;
      totalComm += iv.communicationScore;
      totalProblemSolving += iv.problemSolvingScore;

      // Count strong areas
      (iv.strongAreas || []).forEach((area) => {
        strongAreasCount[area] = (strongAreasCount[area] || 0) + 1;
      });

      // Count weak areas
      (iv.weakAreas || []).forEach((area) => {
        weakAreasCount[area] = (weakAreasCount[area] || 0) + 1;
      });

      // Role stats
      if (!roleStats[iv.jobRole]) {
        roleStats[iv.jobRole] = { count: 0, totalScore: 0 };
      }
      roleStats[iv.jobRole].count += 1;
      roleStats[iv.jobRole].totalScore += iv.overallScore;

      const dateStr = iv.completedAt
        ? new Date(iv.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `Int ${idx + 1}`;

      return {
        id: iv._id,
        interviewNumber: idx + 1,
        date: dateStr,
        role: iv.jobRole,
        type: iv.interviewType,
        overallScore: iv.overallScore,
        technicalScore: iv.technicalScore,
        communicationScore: iv.communicationScore,
        problemSolvingScore: iv.problemSolvingScore,
      };
    });

    const averageScore = Math.round(totalScore / totalInterviews);
    const technicalScore = Math.round(totalTech / totalInterviews);
    const communicationScore = Math.round(totalComm / totalInterviews);
    const problemSolvingScore = Math.round(totalProblemSolving / totalInterviews);

    // Sort strong/weak areas by frequency
    const strongAreas = Object.keys(strongAreasCount)
      .sort((a, b) => strongAreasCount[b] - strongAreasCount[a])
      .slice(0, 5);

    const weakAreas = Object.keys(weakAreasCount)
      .sort((a, b) => weakAreasCount[b] - weakAreasCount[a])
      .slice(0, 5);

    // Role breakdown
    const roleBreakdown = Object.keys(roleStats).map((role) => ({
      role,
      interviewsCount: roleStats[role].count,
      averageScore: Math.round(roleStats[role].totalScore / roleStats[role].count),
    }));

    // Radar chart dataset
    const radarData = [
      { subject: 'Technical Depth', score: technicalScore },
      { subject: 'Communication', score: communicationScore },
      { subject: 'Problem Solving', score: problemSolvingScore },
      { subject: 'Relevance', score: Math.min(100, Math.round(averageScore * 1.02)) },
      { subject: 'Completeness', score: Math.min(100, Math.round(averageScore * 0.98)) },
    ];

    res.status(200).json({
      success: true,
      analytics: {
        totalInterviews,
        averageScore,
        highestScore,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        strongAreas,
        weakAreas,
        scoreHistory,
        roleBreakdown,
        radarData,
      },
    });
  } catch (error) {
    next(error);
  }
};
