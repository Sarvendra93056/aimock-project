import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, User, Mail, Lock, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Software Engineer',
    experienceLevel: 'Fresher',
    college: '',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(formData);
      showToast(`Account created successfully! Welcome, ${res.user.name}.`, 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
      }}
    >
      <div style={{ maxWidth: 540, width: '100%' }}>
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
          <h2 style={{ fontSize: '1.6rem', marginTop: '1rem' }}>Create Student Profile</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Get personalized mock interviews tailored to your branch & role</p>
        </div>

        {/* Register Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="e.g. Sarvendra Singh"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password * (min. 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Target Role & Experience */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Placement Role</label>
                <select
                  name="targetRole"
                  className="form-control"
                  value={formData.targetRole}
                  onChange={handleChange}
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  name="experienceLevel"
                  className="form-control"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                >
                  <option value="Fresher">Fresher (0-1 yrs)</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid-level">Mid-level (3-5 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                </select>
              </div>
            </div>

            {/* College & Branch */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  name="college"
                  className="form-control"
                  placeholder="e.g. IET Lucknow / IIT / NIT"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  name="branch"
                  className="form-control"
                  placeholder="e.g. CSE / IT / ECE"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
