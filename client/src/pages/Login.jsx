import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide email and password', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'student') {
      setEmail('student@interviewai.com');
      setPassword('studentpassword123');
      showToast('Filled Demo Student credentials', 'info');
    } else {
      setEmail('admin@interviewai.com');
      setPassword('adminpassword123');
      showToast('Filled Demo Admin credentials', 'info');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 450, width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              }}
            >
              <Sparkles size={22} color="#000" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Interview<span style={{ color: '#38bdf8' }}>AI</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.6rem', marginTop: '1rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sign in to continue your placement preparation</p>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Quick Demo Autofill Bar */}
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 10,
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ 1-Click Instant Demo Login
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <UserCheck size={13} color="#10b981" />
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <Shield size={13} color="#a855f7" />
                Admin Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Password</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
