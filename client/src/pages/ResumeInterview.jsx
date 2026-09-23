import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Briefcase,
  GraduationCap,
  Layers,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export const ResumeInterview = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      showToast('Please upload a PDF document (.pdf only).', 'error');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit.', 'error');
      return;
    }

    setFile(selected);
    showToast(`Selected "${selected.name}"`, 'success');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type !== 'application/pdf') {
        showToast('Please drop a valid PDF resume.', 'error');
        return;
      }
      setFile(dropped);
      showToast(`Selected "${dropped.name}"`, 'success');
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select or drop a PDF resume first.', 'error');
      return;
    }

    setIsUploading(true);
    showToast('Extracting projects and generating targeted interview questions...', 'info');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', jobRole);
      formData.append('difficulty', difficulty);
      formData.append('totalQuestions', totalQuestions);

      const res = await interviewService.uploadResume(formData);

      if (res.data.success) {
        showToast('Resume parsed and customized interview created!', 'success');
        setExtractedResult({
          parsedResume: res.data.parsedResume,
          interview: res.data.interview,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process resume. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles size={18} color="#a855f7" />
          <span className="badge badge-purple">AI Resume Engine</span>
        </div>
        <h1 style={{ fontSize: '2.1rem' }}>Resume-Targeted Mock Interview</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem' }}>
          Upload your PDF resume. Our parser will extract your exact projects, tech stack, and experience,
          then formulate questions specifically testing your architecture decisions and implementation choices.
        </p>
      </div>

      {!extractedResult ? (
        <form onSubmit={handleUploadAndAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* PDF Drag & Drop Zone */}
          <div
            className="card"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: file ? '2px solid #10b981' : '2px dashed rgba(255, 255, 255, 0.15)',
              background: file ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderRadius: 16,
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
            />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: file ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              {file ? <FileCheck size={28} color="#10b981" /> : <UploadCloud size={28} color="#a855f7" />}
            </div>

            {file ? (
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#34d399' }}>Resume File Loaded</h3>
                <p style={{ color: '#f8fafc', fontWeight: 600, marginTop: 4 }}>{file.name}</p>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Extraction
                </span>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
                  Drag & Drop your Resume PDF here
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
                  or click to browse documents from your computer
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
                  Supported format: PDF up to 5 MB
                </div>
              </div>
            )}
          </div>

          {/* Preferences for Resume Interview */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Interview Round Options</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Target Placement Role</label>
                <select className="form-control" value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interview Difficulty</label>
                <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy (Conceptual & Overview)</option>
                  <option value="Medium">Medium (Technical Trade-offs)</option>
                  <option value="Hard">Hard (Deep Internals & Scale)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Questions</label>
                <select className="form-control" value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))}>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions (Recommended)</option>
                  <option value={8}>8 Questions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-accent btn-lg"
              disabled={!file || isUploading}
              style={{ minWidth: 260 }}
            >
              {isUploading ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  <span>Analyzing Resume Projects...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze & Generate Interview</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Extracted Profile Preview & One-Click Launch */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
                <CheckCircle size={18} />
                <span>Resume Analysis Complete</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginTop: 4 }}>
                Ready to start your Project Deep-Dive Interview
              </h3>
            </div>

            <button
              onClick={() => navigate(`/interview/${extractedResult.interview._id}`)}
              className="btn btn-success btn-lg"
            >
              <span>Enter Interview Room</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Extracted Details Cards */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={18} color="#38bdf8" />
              <span>Extracted Technologies & Skills</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.5rem' }}>
              {extractedResult.parsedResume.extractedSkills.map((s, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.78rem', textTransform: 'none' }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Extracted Projects */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#a855f7" />
              <span>Detected Projects for Deep-Dive</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {extractedResult.parsedResume.extractedProjects.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.98rem' }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {p.techStack.map((tech, i) => (
                        <span key={i} className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.description && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
