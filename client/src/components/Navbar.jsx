import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Terminal, ArrowRight, UserCheck } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
            }}
          >
            <Sparkles size={20} color="#000" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Interview<span style={{ color: '#38bdf8' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
              Mock Interview Platform
            </span>
          </div>
        </Link>

        {/* Public Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/#features" style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
            Features
          </Link>
          <Link to="/#how-it-works" style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
            How It Works
          </Link>
          <Link to="/#faq" style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
            Curriculum
          </Link>
        </nav>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary btn-sm"
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
