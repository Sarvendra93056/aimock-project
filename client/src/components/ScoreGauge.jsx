import React from 'react';

export const ScoreGauge = ({ score = 0, size = 160, strokeWidth = 12, label = 'Overall Score' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // Green (80+)
  let gradeText = 'Excellent';
  let badgeColor = 'rgba(16, 185, 129, 0.15)';
  let textColor = '#34d399';

  if (clampedScore < 60) {
    strokeColor = '#ef4444'; // Red (<60)
    gradeText = 'Needs Work';
    badgeColor = 'rgba(239, 68, 68, 0.15)';
    textColor = '#f87171';
  } else if (clampedScore < 80) {
    strokeColor = '#f59e0b'; // Amber (60-79)
    gradeText = 'Proficient';
    badgeColor = 'rgba(245, 158, 11, 0.15)';
    textColor = '#fbbf24';
  }

  return (
    <div className="score-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="score-gauge-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="score-gauge-val"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>
      <div className="score-gauge-content">
        <span style={{ fontSize: size * 0.26, fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff', lineHeight: 1 }}>
          {clampedScore}
        </span>
        <span style={{ fontSize: size * 0.085, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: size * 0.075,
            fontWeight: 700,
            color: textColor,
            background: badgeColor,
            padding: '2px 8px',
            borderRadius: 9999,
            marginTop: 4,
          }}
        >
          {gradeText}
        </span>
      </div>
    </div>
  );
};
