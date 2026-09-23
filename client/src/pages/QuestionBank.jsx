import React, { useState, useEffect } from 'react';
import { questionService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Send,
  Code2,
  Tag,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Java',
  'C++',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'SQL',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'DSA',
  'HR',
  'Behavioral',
];

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Practice Modal State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const { showToast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await questionService.list({
        category: selectedCategory,
        difficulty: difficultyFilter,
        search,
        limit: 50,
      });

      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      showToast('Failed to load questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, difficultyFilter, search]);

  const handleOpenPractice = (q) => {
    setActiveQuestion(q);
    setPracticeAnswer('');
    setEvaluationResult(null);
  };

  const handleEvaluatePractice = async (e) => {
    e.preventDefault();
    if (!practiceAnswer.trim()) {
      showToast('Please type an answer to practice.', 'error');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await questionService.evaluatePractice({
        questionId: activeQuestion._id,
        userAnswer: practiceAnswer,
      });

      if (res.data.success) {
        setEvaluationResult(res.data.evaluation);
        showToast('Answer evaluated by AI!', 'success');
      }
    } catch (err) {
      showToast('Evaluation failed. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <BookOpen size={18} color="#38bdf8" />
          <span className="badge badge-primary">Placement Knowledge Base</span>
        </div>
        <h1 style={{ fontSize: '2.1rem' }}>Placement Question Bank</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
          Explore high-yield campus interview questions across 13 core computer science categories and practice individual answers with instant AI scoring.
        </p>
      </div>

      {/* Category Pills Scroller */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 9999,
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#38bdf8' : '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search questions by concept or tags (e.g. Red-Black tree, Deadlock, B+ Tree)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 180 }}
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Question Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading question bank...</div>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <HelpCircle size={40} style={{ opacity: 0.35, color: '#94a3b8', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>No questions found</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
            Try adjusting your search terms or selecting another category.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {questions.map((q) => (
            <div
              key={q._id}
              className="card card-interactive"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{q.categoryName}</span>
                  <span className={`badge diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>

                <h3 style={{ fontSize: '1.08rem', lineHeight: 1.5, color: '#f8fafc', marginBottom: '0.75rem' }}>
                  {q.questionText}
                </h3>

                {/* Tags */}
                {q.tags && q.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {q.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.72rem', color: '#64748b', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 4 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => handleOpenPractice(q)}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color="#38bdf8" />
                    <span>Practice This Question</span>
                  </span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Practice Modal with AI Grading */}
      <Modal
        isOpen={!!activeQuestion}
        onClose={() => setActiveQuestion(null)}
        title="Practice Question & Instant AI Evaluation"
        maxWidth={720}
      >
        {activeQuestion && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-primary">{activeQuestion.categoryName}</span>
              <span className={`badge diff-${activeQuestion.difficulty.toLowerCase()}`}>
                {activeQuestion.difficulty}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', lineHeight: 1.5 }}>
              {activeQuestion.questionText}
            </h3>

            {!evaluationResult ? (
              <form onSubmit={handleEvaluatePractice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Your Practice Answer</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Type your explanation or solution here..."
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setActiveQuestion(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isEvaluating}>
                    {isEvaluating ? 'Evaluating with AI...' : 'Submit for AI Grading'}
                    <Sparkles size={15} />
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Score Banner */}
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 10,
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>AI Score</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
                      {evaluationResult.score} / 100
                    </div>
                  </div>
                  <p style={{ maxWidth: 420, fontSize: '0.88rem', color: '#cbd5e1' }}>
                    {evaluationResult.feedback}
                  </p>
                </div>

                {/* Model Answer */}
                <div style={{ padding: '1rem', background: '#090d16', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', marginBottom: 4 }}>
                    Ideal Placement Answer:
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {activeQuestion.idealAnswer}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEvaluationResult(null);
                      setPracticeAnswer('');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
