import React, { useState, useEffect } from 'react';
import { performanceService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await performanceService.getAnalytics();
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        showToast('Failed to load performance analytics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem' }}>
        <div style={{ width: 34, height: 34, border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8' }}>Loading Performance Analytics...</span>
      </div>
    );
  }

  const {
    totalInterviews = 0,
    averageScore = 0,
    highestScore = 0,
    technicalScore = 0,
    communicationScore = 0,
    problemSolvingScore = 0,
    strongAreas = [],
    weakAreas = [],
    scoreHistory = [],
    roleBreakdown = [],
    radarData = [],
  } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">Skill Intelligence</span>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Placement Performance Telemetry</span>
        </div>
        <h1 style={{ fontSize: '2.1rem' }}>Placement Readiness Analytics</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
          Track your score evolution, competency radars, and topic mastery across all mock interview attempts.
        </p>
      </div>

      {/* Top 4 Metric Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Interviews Completed</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{totalInterviews}</div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: 6 }}>Tracked across campus drive standards</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Platform Average</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
            {averageScore} <span style={{ fontSize: '1.1rem', color: '#64748b' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>Highest score: <strong style={{ color: '#fff' }}>{highestScore}</strong></div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Technical Depth</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginTop: 4 }}>
            {technicalScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>DSA, Architecture & Frameworks</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Communication</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a855f7', marginTop: 4 }}>
            {communicationScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>Structure, Clarity & Articulation</div>
        </div>
      </div>

      {/* Chart 1: Score Improvement Over Time (Area Chart) */}
      <div className="card">
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Score Progression & Trend</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Trajectory of Overall, Technical, and Communication scores over time
          </p>
        </div>

        {scoreHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No interview history recorded yet. Complete sessions to populate analytics.
          </div>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={scoreHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="overallScore" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorOverall)" name="Overall Score" />
                <Area type="monotone" dataKey="technicalScore" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTech)" name="Technical Depth" />
                <Area type="monotone" dataKey="communicationScore" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorComm)" name="Communication" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Middle Grid: Radar Competency + Role Breakdown Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Radar Chart */}
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>5-Factor Competency Radar</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Holistic profile balance across evaluation rubrics</p>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis stroke="#64748b" domain={[0, 100]} />
                <Radar name="Candidate Competency" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Breakdown Bar Chart */}
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Performance by Job Role</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Average score per role tested</p>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={roleBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="role" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                />
                <Bar dataKey="averageScore" fill="#818cf8" radius={[6, 6, 0, 0]} name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strong & Weak Areas Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>Strongest Placement Areas</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {strongAreas.length > 0 ? (
              strongAreas.map((area, i) => (
                <span key={i} className="badge badge-success" style={{ fontSize: '0.8rem', textTransform: 'none' }}>
                  {area}
                </span>
              ))
            ) : (
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No data recorded yet.</span>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#fbbf24" />
            <span>Target Weak Areas</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {weakAreas.length > 0 ? (
              weakAreas.map((area, i) => (
                <span key={i} className="badge badge-warning" style={{ fontSize: '0.8rem', textTransform: 'none' }}>
                  {area}
                </span>
              ))
            ) : (
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No data recorded yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
