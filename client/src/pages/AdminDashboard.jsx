import React, { useState, useEffect } from 'react';
import { adminService, questionService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  ShieldCheck,
  Users,
  PlayCircle,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Question Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    categoryName: 'Java',
    role: 'Software Engineer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: '',
    idealAnswer: '',
    tags: '',
  });

  const { showToast } = useToast();

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, ivRes, qRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getInterviews(),
        questionService.list({ limit: 100 }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (ivRes.data.success) setInterviews(ivRes.data.interviews);
      if (qRes.data.success) setQuestions(qRes.data.questions);
    } catch (err) {
      showToast('Failed to load admin telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateRole(userId, newRole);
      showToast(`User role updated to ${newRole}`, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      showToast('Failed to update role.', 'error');
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await questionService.update(editingQuestion._id, questionForm);
        showToast('Question updated successfully.', 'success');
      } else {
        await questionService.create(questionForm);
        showToast('Question added to Question Bank.', 'success');
      }
      setIsAddModalOpen(false);
      setEditingQuestion(null);
      setQuestionForm({
        categoryName: 'Java',
        role: 'Software Engineer',
        difficulty: 'Medium',
        type: 'Technical',
        questionText: '',
        idealAnswer: '',
        tags: '',
      });
      fetchAdminData();
    } catch (err) {
      showToast('Failed to save question.', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question from Question Bank?')) return;
    try {
      await questionService.delete(id);
      showToast('Question deleted.', 'success');
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      showToast('Failed to delete question.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem' }}>
        <div style={{ width: 34, height: 34, border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8' }}>Loading Admin Console...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1250, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={18} color="#a855f7" />
            <span className="badge badge-purple">System Administration</span>
          </div>
          <h1 style={{ fontSize: '2.1rem' }}>Admin Control Center</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
            Monitor platform usage, manage candidates, and maintain the central Question Bank.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingQuestion(null);
            setQuestionForm({
              categoryName: 'Java',
              role: 'Software Engineer',
              difficulty: 'Medium',
              type: 'Technical',
              questionText: '',
              idealAnswer: '',
              tags: '',
            });
            setIsAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add New Question</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Candidates</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: 6 }}>Campus students & admins</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Interviews</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>
            {stats?.totalInterviews || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>
            {stats?.completedInterviews || 0} completed & evaluated
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Platform Avg Score</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginTop: 4 }}>
            {stats?.averageScore || 0}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>Across all placement rounds</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Question Library</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a855f7', marginTop: 4 }}>
            {stats?.totalQuestions || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>Across 13 core categories</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Platform Logs', icon: PlayCircle },
          { id: 'users', label: 'Candidates', icon: Users },
          { id: 'questions', label: 'Question Bank Manager', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: 8,
                border: 'none',
                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: isSelected ? '#38bdf8' : '#94a3b8',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Platform Interview Logs */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Platform Interview Audit Logs</h3>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Session Title & Role</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv) => (
                  <tr key={iv._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{iv.user?.name || 'Candidate'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{iv.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{iv.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{iv.jobRole}</div>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                        {iv.interviewType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge diff-${iv.difficulty.toLowerCase()}`}>{iv.difficulty}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: iv.overallScore >= 80 ? '#34d399' : '#fbbf24' }}>
                        {iv.overallScore} / 100
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${iv.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {iv.status}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(iv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Candidate Management */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Registered Candidates & Roles</h3>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name & Email</th>
                  <th>Target Role</th>
                  <th>College & Branch</th>
                  <th>Interviews</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{u.targetRole}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{u.college || 'B.Tech'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.branch}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.interviewCount || 0}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Question Bank Manager */}
      {activeTab === 'questions' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Question Bank Repository ({questions.length})</h3>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setQuestionForm({
                  categoryName: 'Java',
                  role: 'Software Engineer',
                  difficulty: 'Medium',
                  type: 'Technical',
                  questionText: '',
                  idealAnswer: '',
                  tags: '',
                });
                setIsAddModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Add Question</span>
            </button>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Question Prompt</th>
                  <th>Difficulty</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id}>
                    <td>
                      <span className="badge badge-primary">{q.categoryName}</span>
                    </td>
                    <td style={{ maxWidth: 450, color: '#f8fafc', fontSize: '0.9rem' }}>
                      {q.questionText}
                    </td>
                    <td>
                      <span className={`badge diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{q.type}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setQuestionForm({
                              categoryName: q.categoryName,
                              role: q.role,
                              difficulty: q.difficulty,
                              type: q.type,
                              questionText: q.questionText,
                              idealAnswer: q.idealAnswer,
                              tags: q.tags?.join(', ') || '',
                            });
                            setIsAddModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Edit Question"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Delete Question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add New Question to Bank'}
        maxWidth={700}
      >
        <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={questionForm.categoryName}
                onChange={(e) => setQuestionForm({ ...questionForm, categoryName: e.target.value })}
              >
                {['Java', 'C++', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'DBMS', 'Operating Systems', 'Computer Networks', 'DSA', 'HR', 'Behavioral'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Difficulty</label>
              <select
                className="form-control"
                value={questionForm.difficulty}
                onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Question Text *</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Explain how the Event Loop works in Node.js..."
              value={questionForm.questionText}
              onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Ideal / Model Answer *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe the expected technical depth, key mechanisms, and time/space complexities..."
              value={questionForm.idealAnswer}
              onChange={(e) => setQuestionForm({ ...questionForm, idealAnswer: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Concurrency, Red-Black Tree, Java 8"
              value={questionForm.tags}
              onChange={(e) => setQuestionForm({ ...questionForm, tags: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingQuestion ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
