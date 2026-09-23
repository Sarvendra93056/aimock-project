import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Briefcase,
  Layers,
  Gauge,
  HelpCircle,
  Clock,
  ArrowRight,
  Code,
  Users,
  Compass,
  Shuffle,
  Check,
} from 'lucide-react';

const STANDARD_ROLES = [
  'Software Engineer',
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
];

const INTERVIEW_TYPES = [
  { id: 'Technical', label: 'Technical', icon: Code, desc: 'DSA, System Design, Language Core & Frameworks' },
  { id: 'HR', label: 'HR Round', icon: Users, desc: 'Company Culture, Motivation, Career Goals & Soft Skills' },
  { id: 'Behavioral', label: 'Behavioral', icon: Compass, desc: 'STAR Method, Conflict Handling & Team Leadership' },
  { id: 'Mixed', label: 'Comprehensive Mixed', icon: Shuffle, desc: 'Balanced blend of Tech, Problem Solving & HR' },
];

const DIFFICULTIES = [
  { id: 'Easy', label: 'Easy', desc: 'Core definitions, syntax, and foundational CS concepts' },
  { id: 'Medium', label: 'Medium', desc: 'Real-world problem solving, trade-offs, and multi-threading' },
  { id: 'Hard', label: 'Hard', desc: 'Distributed architectures, deep internals, and scale bottlenecks' },
];

export const InterviewSetup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobRole, setJobRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRole = isCustomRole ? customRole.trim() : jobRole;
    if (!selectedRole) {
      showToast('Please specify a job role.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      showToast('AI is formulating your personalized interview questions...', 'info');
      const res = await interviewService.create({
        jobRole: selectedRole,
        experienceLevel,
        interviewType,
        difficulty,
        totalQuestions: Number(totalQuestions),
        durationMinutes: Number(durationMinutes),
        title: `${selectedRole} (${difficulty}) - ${interviewType} Mock`,
      });

      if (res.data.success) {
        showToast('Interview session prepared! Good luck.', 'success');
        navigate(`/interview/${res.data.interview._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate interview. Please try again.';
      showToast(msg, 'error');
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={18} color="#38bdf8" />
          <span className="badge badge-primary">Dynamic AI Configuration</span>
        </div>
        <h1 style={{ fontSize: '2.2rem' }}>Configure Your Mock Interview</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
          Tailor the session to match the exact company profile, technical depth, and round format you want to practice.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Step 1: Job Role Selection */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <Briefcase size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem' }}>1. Target Job Role</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {STANDARD_ROLES.map((role) => {
              const isSelected = !isCustomRole && jobRole === role;
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setJobRole(role);
                    setIsCustomRole(false);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 10,
                    border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? '#38bdf8' : '#f8fafc',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{role}</span>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}

            {/* Custom Role Option */}
            <button
              type="button"
              onClick={() => setIsCustomRole(true)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 10,
                border: isCustomRole ? '2px solid #a855f7' : '1px dashed rgba(255, 255, 255, 0.2)',
                background: isCustomRole ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                color: isCustomRole ? '#c084fc' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.92rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>+ Custom Job Role</span>
              {isCustomRole && <Check size={16} />}
            </button>
          </div>

          {isCustomRole && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Enter Custom Job Role Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Cloud DevOps Engineer, iOS Swift Engineer, Machine Learning Engineer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                required={isCustomRole}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Step 2: Experience Level & Interview Type */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Experience Level */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Layers size={20} color="#818cf8" />
              <h3 style={{ fontSize: '1.2rem' }}>2. Experience Level</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { id: 'Fresher', label: 'Fresher / Campus Candidate', sub: 'College placements, internships, 0-1 years' },
                { id: 'Junior', label: 'Junior Engineer', sub: '1 - 2 years industry experience' },
                { id: 'Mid-level', label: 'Mid-Level Engineer', sub: '3 - 5 years industry experience' },
                { id: 'Senior', label: 'Senior Engineer', sub: '5+ years architecture & leadership' },
              ].map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: isSelected ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: isSelected ? '#818cf8' : '#f8fafc', fontSize: '0.9rem' }}>
                      {lvl.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{lvl.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interview Type */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Shuffle size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.2rem' }}>3. Interview Round Type</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {INTERVIEW_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = interviewType === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setInterviewType(t.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: isSelected ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <Icon size={18} color={isSelected ? '#c084fc' : '#94a3b8'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: isSelected ? '#c084fc' : '#f8fafc', fontSize: '0.9rem' }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Difficulty & Session Parameters */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Gauge size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.2rem' }}>4. Difficulty & Duration</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {DIFFICULTIES.map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#34d399' : '#f8fafc', fontSize: '1rem' }}>
                      {d.label}
                    </span>
                    <span className={`badge diff-${d.id.toLowerCase()}`}>{d.id}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.desc}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={15} /> Number of Questions
                </span>
                <span style={{ color: '#38bdf8' }}>{totalQuestions} questions</span>
              </label>
              <select
                className="form-control"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              >
                <option value={3}>3 Questions (Quick Sprint)</option>
                <option value={5}>5 Questions (Standard Mock)</option>
                <option value={8}>8 Questions (Thorough Assessment)</option>
                <option value={10}>10 Questions (Full Placement Round)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} /> Interview Duration
                </span>
                <span style={{ color: '#a855f7' }}>{durationMinutes} minutes</span>
              </label>
              <select
                className="form-control"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              >
                <option value={15}>15 Minutes (Express)</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={45}>45 Minutes (Extended)</option>
                <option value={60}>60 Minutes (Comprehensive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isGenerating}
            style={{ minWidth: 260 }}
          >
            {isGenerating ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #000',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                <span>Synthesizing Questions...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Launch Interview Room</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
