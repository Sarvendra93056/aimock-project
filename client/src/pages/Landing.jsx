import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  FileText,
  BarChart3,
  Bot,
  Terminal,
  Zap,
  Shield,
  Layers,
  Code2,
} from 'lucide-react';

export const Landing = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '5.5rem 1.5rem 4rem',
          maxWidth: 1250,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle pill tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 9999,
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            marginBottom: '1.75rem',
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.02em' }}>
            Next-Gen AI Mock Interview Platform for Tech Placements
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            maxWidth: 960,
            margin: '0 auto 1.5rem',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          Crack Your Software Engineering Placements with <span className="gradient-text">Realistic AI Mock Interviews</span>
        </h1>

        <p
          style={{
            fontSize: '1.18rem',
            maxWidth: 720,
            margin: '0 auto 2.5rem',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          Generate dynamic role-specific questions, speak or type your answers under real timed pressure,
          and receive granular multi-rubric feedback across technical depth, communication, and problem solving.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>
            Start Free Mock Interview
            <ArrowRight size={18} />
          </Link>
          <Link to="/interview/resume" className="btn btn-secondary btn-lg" style={{ minWidth: 200 }}>
            <FileText size={18} style={{ color: '#8b5cf6' }} />
            Try Resume Deep-Dive
          </Link>
          <Link to="/question-bank" className="btn btn-outline btn-lg">
            <Code2 size={18} />
            Explore Question Bank
          </Link>
        </div>

        {/* Trust Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            padding: '1.5rem 2rem',
            background: 'rgba(17, 24, 39, 0.6)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>98.4%</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Placement Readiness Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7' }}>13+ Categories</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Java, React, Node, DSA, OS & HR</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>Live Voice + Text</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Speech-to-Text Recognition</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>AI Evaluation</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>5-Factor Rubric & Model Answers</div>
          </div>
        </div>
      </section>

      {/* Interactive Mock Interview Preview Card */}
      <section style={{ maxWidth: 1100, margin: '0 auto 5rem', padding: '0 1.5rem', width: '100%' }}>
        <div
          className="card pulsing-border"
          style={{
            background: 'linear-gradient(180deg, #111827 0%, #0c121e 100%)',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Terminal Window Header */}
          <div
            style={{
              padding: '0.85rem 1.5rem',
              background: 'rgba(0, 0, 0, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                InterviewAI Interactive Room — Question 2 of 5
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge diff-medium">Medium</span>
              <span className="badge badge-primary">Full Stack</span>
            </div>
          </div>

          {/* Card Body Simulation */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Technical Deep-Dive Prompt
              </span>
              <h3 style={{ fontSize: '1.35rem', marginTop: '0.35rem', color: '#f8fafc' }}>
                "In your resume, you listed an E-Commerce Platform built with React and Node.js. How did you design database transactions to prevent race conditions during high-volume flash sales?"
              </h3>
            </div>

            {/* Answer Display */}
            <div
              style={{
                background: '#090d16',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 12,
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Candidate Audio/Text Submission:</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>68 words • Transcribed via Web Speech API</span>
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.94rem', lineHeight: 1.6 }}>
                "To prevent overselling during flash sales, we implemented Optimistic Concurrency Control using a version key in MongoDB and an atomic decrement via <code>$inc</code> with a condition that stock must be greater than zero. For ultra-high traffic peaks, we staged requests in a Redis queue and processed them sequentially with atomic Lua scripts."
              </p>
            </div>

            {/* AI Evaluation Snapshot */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>92 / 100</span>
                  <span className="badge badge-success">Tier-1 Placement Ready</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 3 }}>
                  Strong architectural answer correctly utilizing atomic operations and Redis staging.
                </div>
              </div>
              <Link to="/register" className="btn btn-success btn-sm">
                Try Your Own Mock Session
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" style={{ maxWidth: 1250, margin: '0 auto 6rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Platform Highlights</span>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '0.75rem' }}>Engineered for Campus Placements</h2>
          <p style={{ maxWidth: 650, margin: '0 auto' }}>
            Every module matches what top engineering hiring managers look for in on-campus and off-campus recruitment drives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Dynamic Question Generation</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Select target role (Software Engineer, Java, Frontend, Backend, Full Stack, Data Analyst), difficulty, and interview type (Technical, HR, Behavioral). AI customizes fresh questions every session.
            </p>
          </div>

          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileText size={22} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Resume-Based Mock Interviews</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Upload your PDF resume. Our PDF parser extracts your exact academic projects, languages, and frameworks to formulate specific architecture and trade-off questions directly about your portfolio.
            </p>
          </div>

          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BarChart3 size={22} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Granular Rubric Scoring & Reports</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Get scored out of 100 with distinct metrics for Technical Correctness, Communication, and Problem Solving. Learn what you did well, what needs improvement, and view ideal model answers.
            </p>
          </div>

          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Terminal size={22} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Full CS Placement Question Bank</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Practice 13+ standard placement categories: Java, C++, JavaScript, React, Node.js, MongoDB, SQL, DBMS, Operating Systems, Computer Networks, DSA, and Behavioral with instant AI feedback.
            </p>
          </div>

          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Zap size={22} color="#ec4899" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live Speech-to-Text Dictation</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Practice speaking naturally like in real video rounds. Speak into your microphone and watch speech-to-text live transcription convert your speech into answers.
            </p>
          </div>

          <div className="card card-interactive">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={22} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Performance Analytics & Tracking</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Track score trajectory across dates using interactive Recharts. Identify frequent strong topics and targeted weak concepts with custom revision roadmaps.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#070a12',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>InterviewAI</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            AI-Powered Mock Interview Platform — Built with React, Node.js, Express & MongoDB.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#475569' }}>
            Crafted for B.Tech CSE Placement Excellence • © 2026 InterviewAI
          </div>
        </div>
      </footer>
    </div>
  );
};
