import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Clock,
  Mic,
  MicOff,
  Save,
  CheckCircle,
  AlertCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  Code,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const speechRecognitionRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  // Load Interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await interviewService.getById(id);
        if (res.data.success) {
          const iv = res.data.interview;
          if (iv.status === 'completed') {
            navigate(`/interview/${id}/report`, { replace: true });
            return;
          }

          setInterview(iv);

          // Populate answers
          const initialAns = {};
          (iv.answers || []).forEach((a) => {
            initialAns[a.questionIndex] = a.userAnswer || '';
          });
          setAnswers(initialAns);

          // Calculate time remaining based on durationMinutes and timeSpentSeconds
          const totalSecs = (iv.durationMinutes || 30) * 60;
          const spent = iv.timeSpentSeconds || 0;
          setTimeSpentSeconds(spent);
          setTimeLeftSeconds(Math.max(0, totalSecs - spent));
        }
      } catch (err) {
        showToast('Failed to load interview session.', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate, showToast]);

  // Countdown Timer
  useEffect(() => {
    if (loading || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitting]);

  // Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript) {
          setAnswers((prev) => {
            const current = prev[currentIndex] || '';
            const separator = current && !current.endsWith(' ') ? ' ' : '';
            return {
              ...prev,
              [currentIndex]: current + separator + transcript,
            };
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, [currentIndex]);

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      showToast('Speech recognition is not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      showToast('Voice dictation paused', 'info');
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
        showToast('Listening... Speak your answer now.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Debounced Autosave
  const triggerAutosave = useCallback(
    async (qIndex, text) => {
      setIsSaving(true);
      try {
        await interviewService.autosave(id, {
          questionIndex: qIndex,
          userAnswer: text,
          timeSpentSeconds,
        });
        setLastSaved(new Date());
      } catch (err) {
        console.warn('Autosave warning:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [id, timeSpentSeconds]
  );

  const handleAnswerChange = (val) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: val }));

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      triggerAutosave(currentIndex, val);
    }, 1500);
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  // Submit interview
  const handleSubmit = async (auto = false) => {
    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }

    setIsSubmitting(true);
    setShowSubmitModal(false);
    showToast(auto ? 'Time expired! Submitting interview...' : 'Submitting interview for AI evaluation...', 'info');

    try {
      const formattedAnswers = Object.keys(answers).map((key) => ({
        questionIndex: Number(key),
        questionText: interview.questions[Number(key)]?.questionText || '',
        userAnswer: answers[key],
      }));

      const res = await interviewService.submit(id, {
        answers: formattedAnswers,
        timeSpentSeconds,
      });

      if (res.data.success) {
        showToast('Interview successfully evaluated!', 'success');
        navigate(`/interview/${id}/report`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error submitting interview. Please try again.';
      showToast(msg, 'error');
      setIsSubmitting(false);
    }
  };

  if (loading || !interview) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem' }}>
        <div style={{ width: 34, height: 34, border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8' }}>Entering Interview Room...</span>
      </div>
    );
  }

  const currentQ = interview.questions[currentIndex] || {};
  const currentAnswer = answers[currentIndex] || '';
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  const answeredCount = Object.values(answers).filter((a) => a && a.trim().length > 0).length;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timerWarning = timeLeftSeconds < 300; // < 5 mins
  const timerCritical = timeLeftSeconds < 120; // < 2 mins

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Interview Header Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'rgba(15, 23, 42, 0.85)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {interview.jobRole} • {interview.interviewType}
          </div>
          <h2 style={{ fontSize: '1.25rem', marginTop: 2 }}>{interview.title}</h2>
        </div>

        {/* Live Timer & Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Autosave status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            {isSaving ? (
              <>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1s infinite' }} />
                <span>Saving to cloud...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check size={14} color="#10b981" />
                <span>Auto-saved</span>
              </>
            ) : null}
          </div>

          {/* Countdown Clock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: 10,
              background: timerCritical ? 'rgba(239, 68, 68, 0.15)' : (timerWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
              border: timerCritical ? '1px solid #ef4444' : (timerWarning ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)'),
              color: timerCritical ? '#ef4444' : (timerWarning ? '#f59e0b' : '#38bdf8'),
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
            }}
          >
            <Clock size={18} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-primary btn-sm"
            disabled={isSubmitting}
          >
            <Send size={15} />
            <span>Submit Interview</span>
          </button>
        </div>
      </div>

      {/* Main Room Layout: Left Navigation + Right Question Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
        {/* Left Question Stepper Sidebar */}
        <div className="card" style={{ height: 'fit-content', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Question Navigator</span>
            <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
              {answeredCount}/{interview.questions.length} Answered
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {interview.questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = answers[idx] && answers[idx].trim().length > 0;
              const isFlag = flagged[idx];

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isListening && speechRecognitionRef.current) speechRecognitionRef.current.stop();
                    setCurrentIndex(idx);
                  }}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 8,
                    border: isCurrent ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: isCurrent ? '#38bdf8' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Q{idx + 1}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• {q.category || 'General'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isFlag && <Flag size={13} color="#f59e0b" fill="#f59e0b" />}
                    {hasAnswer && <CheckCircle size={14} color="#10b981" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats Helper */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem', color: '#64748b' }}>
            Tip: You can use your microphone to dictate answers or type code snippets.
          </div>
        </div>

        {/* Right Question Prompt & Multi-Modal Answer Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-primary">Question {currentIndex + 1} of {interview.questions.length}</span>
                <span className={`badge diff-${(currentQ.difficulty || 'Medium').toLowerCase()}`}>
                  {currentQ.difficulty || 'Medium'}
                </span>
                <span className="badge badge-secondary">{currentQ.category || 'General'}</span>
              </div>

              <button
                type="button"
                onClick={toggleFlag}
                style={{
                  background: flagged[currentIndex] ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: flagged[currentIndex] ? '#fbbf24' : '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                <Flag size={14} fill={flagged[currentIndex] ? '#fbbf24' : 'none'} />
                <span>{flagged[currentIndex] ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            {/* Resume Project Deep Dive Banner if applicable */}
            {currentQ.projectContext && (
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 8,
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Sparkles size={15} />
                <span>Project Question Generated from Resume: <strong>{currentQ.projectContext}</strong></span>
              </div>
            )}

            <h3 style={{ fontSize: '1.35rem', lineHeight: 1.45, color: '#f8fafc' }}>
              {currentQ.questionText}
            </h3>
          </div>

          {/* Answer Workspace Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>Your Response</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {wordCount} words • {currentAnswer.length} chars
                </span>
              </div>

              {/* Action Toolbar: Speech-to-Text & Code Snippet Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                  title="Toggle Speech-to-Text Voice Input"
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} color="#38bdf8" />}
                  <span>{isListening ? 'Stop Listening' : 'Voice Dictate'}</span>
                </button>

                {/* Code mode toggle */}
                <button
                  type="button"
                  onClick={() => setIsCodeMode(!isCodeMode)}
                  className={`btn ${isCodeMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  title="Toggle Code Editor Font Mode"
                >
                  <Code size={15} />
                  <span>{isCodeMode ? 'Code Mode ON' : 'Code Mode'}</span>
                </button>
              </div>
            </div>

            {/* Answer Input Area */}
            <div style={{ position: 'relative' }}>
              <textarea
                className="form-control"
                rows={12}
                style={{
                  fontFamily: isCodeMode ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: isCodeMode ? '0.9rem' : '0.98rem',
                  lineHeight: 1.65,
                  minHeight: 280,
                  borderColor: isListening ? '#ef4444' : undefined,
                  boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.25)' : undefined,
                }}
                placeholder={
                  isCodeMode
                    ? '// Write your algorithmic solution, pseudocode, or architectural design here...'
                    : 'Articulate your thoughts clearly. Explain the underlying principle, mention any trade-offs, and provide a concrete production example...'
                }
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />

              {/* Voice Listening Ripple Animation */}
              {isListening && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    padding: '3px 8px',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    color: '#fca5a5',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  <span>Recording speech...</span>
                </div>
              )}
            </div>

            {/* Bottom Question Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="btn btn-secondary btn-sm"
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {currentIndex < interview.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="btn btn-accent btn-sm"
                  >
                    <Send size={15} />
                    <span>Review & Submit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Mock Interview"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Are you ready to submit your interview session for comprehensive AI grading?
          </p>

          <div
            style={{
              padding: '1rem',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                {answeredCount} / {interview.questions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Questions Answered</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>
                {Math.round(timeSpentSeconds / 60)} min
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Time Spent</div>
            </div>
          </div>

          {answeredCount < interview.questions.length && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem',
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.85rem',
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>
                You have {interview.questions.length - answeredCount} unanswered questions. Unanswered questions will receive zero points.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="btn btn-secondary"
            >
              Continue Interview
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
