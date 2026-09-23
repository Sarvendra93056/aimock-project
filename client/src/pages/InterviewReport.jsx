import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ScoreGauge } from '../components/ScoreGauge';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Printer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Code2,
  Layers,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';

export const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await interviewService.getReport(id);
        if (res.data.success) {
          setReport(res.data.report);

          // Confetti celebratory burst if overall score >= 75
          if (res.data.report.overallScore >= 75) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }
      } catch (err) {
        showToast('Failed to load interview report.', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate, showToast]);

  const toggleAccordion = (idx) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem' }}>
        <div style={{ width: 34, height: 34, border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8' }}>Generating Evaluation Report...</span>
      </div>
    );
  }

  const {
    jobRole,
    interviewType,
    difficulty,
    overallScore,
    technicalScore,
    communicationScore,
    problemSolvingScore,
    overallFeedback,
    strongAreas = [],
    weakAreas = [],
    topicsToRevise = [],
    recommendations = [],
    answers = [],
    timeSpentSeconds = 0,
    createdAt,
  } = report;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Comprehensive Evaluation</span>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Completed on {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem' }}>{report.title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <Link to="/interview/setup" className="btn btn-primary btn-sm">
            <RotateCcw size={15} />
            <span>Retake Interview</span>
          </Link>
        </div>
      </div>

      {/* Hero Score & Multi-Rubric Breakdown */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2.5rem',
          alignItems: 'center',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Circular Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <ScoreGauge score={overallScore} size={180} strokeWidth={14} label="Overall Score" />
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            Time Spent: <strong style={{ color: '#fff' }}>{Math.round(timeSpentSeconds / 60)} mins</strong>
          </div>
        </div>

        {/* Breakdown Meters & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
              Placement Performance Review
            </span>
            <p style={{ fontSize: '1.02rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {overallFeedback || 'Great work completing your mock interview session.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            {/* Technical */}
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Technical Depth
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                {technicalScore} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 100</span>
              </div>
            </div>

            {/* Communication */}
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Communication
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7', marginTop: 2 }}>
                {communicationScore} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 100</span>
              </div>
            </div>

            {/* Problem Solving */}
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Problem Solving
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: 2 }}>
                {problemSolvingScore} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths, Improvements, and Topics to Revise */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Strengths & Weaknesses */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#38bdf8" />
            <span>Placement Interview Highlights</span>
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} />
              <span>What You Did Well</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {strongAreas.length > 0 ? (
                strongAreas.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>Structured explanations and prompt participation.</li>
              )}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} />
              <span>What Needs Improvement</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {weakAreas.length > 0 ? (
                weakAreas.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>Maintain depth across complex edge cases and time complexities.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Revision Topics & Actionable Roadmap */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="#a855f7" />
            <span>Targeted Topics to Revise</span>
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {topicsToRevise.map((topic, i) => (
              <span key={i} className="badge badge-warning" style={{ fontSize: '0.78rem', textTransform: 'none' }}>
                {topic}
              </span>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lightbulb size={16} />
              <span>Personalized Recommendations</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Question-by-Question Detailed Accordion Review */}
      <div className="card">
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Question-by-Question Feedback & Model Answers</h3>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Compare your submitted answers directly against AI evaluations, constructive feedback, and ideal placement model answers.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {answers.map((ans, idx) => {
            const isExpanded = expandedQuestions[idx];
            const evalData = ans.evaluation || {};
            const score = evalData.score || 0;

            return (
              <div
                key={idx}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden',
                }}
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.96rem' }}>
                      {ans.questionText}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: score >= 80 ? '#34d399' : (score >= 60 ? '#fbbf24' : '#f87171'),
                        fontSize: '0.95rem',
                      }}
                    >
                      {score} / 100
                    </span>
                    {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* User Answer */}
                    <div style={{ background: '#090d16', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                        Your Submitted Response
                      </div>
                      <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {ans.userAnswer || '(No answer provided)'}
                      </p>
                    </div>

                    {/* AI Feedback & Score Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.35rem' }}>
                          AI Evaluation Feedback
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {evalData.feedback || 'Evaluated based on standard CS rubric criteria.'}
                        </p>
                      </div>

                      {/* Model Ideal Answer */}
                      <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '0.35rem' }}>
                          Ideal Model Placement Answer
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {evalData.suggestedIdealAnswer || 'Focus on precise terminology, data flow, and complexity analysis.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
