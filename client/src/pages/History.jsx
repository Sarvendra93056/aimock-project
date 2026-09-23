import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  History as HistoryIcon,
  Search,
  Filter,
  PlayCircle,
  FileText,
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const History = () => {
  const [interviews, setInterviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchInterviews = async () => {
    try {
      const res = await interviewService.list();
      if (res.data.success) {
        setInterviews(res.data.interviews);
        setFiltered(res.data.interviews);
      }
    } catch (err) {
      showToast('Failed to fetch interview history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    let result = [...interviews];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (iv) =>
          iv.title.toLowerCase().includes(q) ||
          iv.jobRole.toLowerCase().includes(q) ||
          iv.interviewType.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== 'All') {
      result = result.filter((iv) => iv.jobRole === roleFilter);
    }

    if (statusFilter !== 'All') {
      result = result.filter((iv) => iv.status === statusFilter);
    }

    setFiltered(result);
  }, [search, roleFilter, statusFilter, interviews]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await interviewService.delete(id);
      showToast('Interview deleted.', 'success');
      setInterviews((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      showToast('Failed to delete interview.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <HistoryIcon size={18} color="#38bdf8" />
            <span className="badge badge-primary">Session Archive</span>
          </div>
          <h1 style={{ fontSize: '2.1rem' }}>Interview History & Reports</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
            Browse and review past mock interviews, filter by round type, and re-examine evaluations.
          </p>
        </div>

        <Link to="/interview/setup" className="btn btn-primary">
          <PlayCircle size={18} />
          <span>New Interview</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by title, role or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Job Roles</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Interviews Table / List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading interview history...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
            <FileText size={40} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
            <p style={{ color: '#cbd5e1', fontSize: '1rem', fontWeight: 600 }}>No mock interviews match your filters.</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>Try clearing the search or filters above.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Session Title</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((iv) => {
                  const score = iv.overallScore || 0;
                  const isCompleted = iv.status === 'completed';

                  return (
                    <tr key={iv._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{iv.title}</div>
                        {iv.isResumeBased && (
                          <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginTop: 3 }}>
                            Resume Based
                          </span>
                        )}
                      </td>
                      <td style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{iv.jobRole}</td>
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
                        {isCompleted ? (
                          <span
                            style={{
                              fontWeight: 700,
                              color: score >= 80 ? '#34d399' : (score >= 60 ? '#fbbf24' : '#f87171'),
                            }}
                          >
                            {score} / 100
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Draft</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
                          {iv.status}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {new Date(iv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isCompleted ? (
                            <Link to={`/interview/${iv._id}/report`} className="btn btn-secondary btn-sm">
                              Report
                            </Link>
                          ) : (
                            <Link to={`/interview/${iv._id}`} className="btn btn-primary btn-sm">
                              Resume
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(iv._id, iv.title)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: 6,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                            title="Delete Interview"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
