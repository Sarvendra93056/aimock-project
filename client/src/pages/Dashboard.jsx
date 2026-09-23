import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { performanceService, interviewService } from '../services/api';
import {
  PlayCircle,
  FileText,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [perfRes, ivRes] = await Promise.all([
          performanceService.getAnalytics(),
          interviewService.list({ limit: 6 }),
        ]);

        if (perfRes.data.success) {
          setAnalytics(perfRes.data.analytics);
        }
        if (ivRes.data.success) {
          setRecentInterviews(ivRes.data.interviews);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">Campus Placement Portal</span>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{user?.college || 'B.Tech CSE'}</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
            Hello, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p style={{ maxWidth: 600, color: '#cbd5e1', fontSize: '0.96rem' }}>
            Your target placement role is <strong style={{ color: '#38bdf8' }}>{user?.targetRole || 'Software Engineer'}</strong>.
            Sharpen your fundamentals, practice behavioral rounds, or test your resume projects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/interview/setup" className="btn btn-primary">
            <PlayCircle size={18} />
            <span>Start New Interview</span>
          </Link>
          <Link to="/interview/resume" className="btn btn-secondary">
            <FileText size={18} style={{ color: '#a855f7' }} />
            <span>Resume Interview</span>
          </Link>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Interviews */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Sessions
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 4, color: '#f8fafc' }}>
                {analytics?.totalInterviews || 0}
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} color="#38bdf8" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} />
            <span>Placement readiness tracking active</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Average Score
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 4, color: '#38bdf8' }}>
                {analytics?.averageScore || 0}
                <span style={{ fontSize: '1.1rem', color: '#64748b' }}>/100</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color="#818cf8" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            Highest recorded: <strong style={{ color: '#fff' }}>{analytics?.highestScore || 0}</strong>
          </div>
        </div>

        {/* Technical Score */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Technical Score
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 4, color: '#10b981' }}>
                {analytics?.technicalScore || 0}
                <span style={{ fontSize: '1.1rem', color: '#64748b' }}>%</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={22} color="#10b981" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            Algorithms, System Design & Frameworks
          </div>
        </div>

        {/* Communication Score */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Communication Score
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 4, color: '#a855f7' }}>
                {analytics?.communicationScore || 0}
                <span style={{ fontSize: '1.1rem', color: '#64748b' }}>%</span>
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#c084fc" />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            Clarity, Structure & Articulation
          </div>
        </div>
      </div>

      {/* Middle Grid: Strong/Weak Areas & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Strong & Weak Areas Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#38bdf8" />
            <span>Placement Competency Analysis</span>
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} />
              <span>Demonstrated Strong Areas</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {analytics?.strongAreas && analytics.strongAreas.length > 0 ? (
                analytics.strongAreas.map((area, idx) => (
                  <span key={idx} className="badge badge-success" style={{ fontSize: '0.76rem', textTransform: 'none' }}>
                    {area}
                  </span>
                ))
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Complete your first mock interview to reveal strong areas.</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={15} />
              <span>Recommended Areas for Improvement</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {analytics?.weakAreas && analytics.weakAreas.length > 0 ? (
                analytics.weakAreas.map((area, idx) => (
                  <span key={idx} className="badge badge-warning" style={{ fontSize: '0.76rem', textTransform: 'none' }}>
                    {area}
                  </span>
                ))
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No critical weaknesses identified yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Launchpad Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Quick Preparation Actions</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Jump straight into targeted practice to maximize your interview conversion rate.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/interview/setup"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PlayCircle size={18} color="#38bdf8" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Configure Custom Mock</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Select role, difficulty, duration & types</div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </Link>

              <Link
                to="/interview/resume"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} color="#a855f7" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Upload Resume PDF</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Extract projects & test architecture choices</div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </Link>

              <Link
                to="/question-bank"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BookOpen size={18} color="#10b981" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Placement Question Bank</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Practice 13+ categories with instant AI grading</div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Interview Sessions</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Review previous attempts and question-by-question evaluations</p>
          </div>
          <Link to="/history" className="btn btn-outline btn-sm">
            <span>View Full History</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentInterviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <PlayCircle size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>You have not completed any mock interviews yet.</p>
            <Link to="/interview/setup" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Launch Your First Interview
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Session Title & Role</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((iv) => (
                  <tr key={iv._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{iv.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{iv.jobRole}</div>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                        {iv.interviewType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge diff-${iv.difficulty.toLowerCase()}`}>
                        {iv.difficulty}
                      </span>
                    </td>
                    <td>
                      {iv.status === 'completed' ? (
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: iv.overallScore >= 80 ? '#34d399' : (iv.overallScore >= 60 ? '#fbbf24' : '#f87171') }}>
                          {iv.overallScore} / 100
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Pending</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${iv.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {iv.status}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(iv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      {iv.status === 'completed' ? (
                        <Link to={`/interview/${iv._id}/report`} className="btn btn-secondary btn-sm">
                          View Report
                        </Link>
                      ) : (
                        <Link to={`/interview/${iv._id}`} className="btn btn-primary btn-sm">
                          Resume
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
