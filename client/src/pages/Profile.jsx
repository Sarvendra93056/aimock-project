import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Calendar,
  Save,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || 'Software Engineer',
    experienceLevel: user?.experienceLevel || 'Fresher',
    college: user?.college || '',
    branch: user?.branch || 'Computer Science and Engineering',
    graduationYear: user?.graduationYear || 2026,
    bio: user?.bio || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await authService.updateProfile(formData);
      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <User size={18} color="#38bdf8" />
          <span className="badge badge-primary">Account & Placement Preferences</span>
        </div>
        <h1 style={{ fontSize: '2.1rem' }}>Candidate Profile</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
          Keep your target job role, college details, and graduation year updated to receive tailored placement questions.
        </p>
      </div>

      <div className="card">
        {/* User Card Snapshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#000',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: 3 }}>
              <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>{user?.email}</span>
              <span className={`badge ${user?.role === 'admin' ? 'badge-purple' : 'badge-primary'}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="college"
                className="form-control"
                placeholder="e.g. Institute of Engineering & Technology"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch & Specialization</label>
              <input
                type="text"
                name="branch"
                className="form-control"
                value={formData.branch}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              className="form-control"
              value={formData.graduationYear}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary & Placement Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: 160 }}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
