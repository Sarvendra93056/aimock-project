import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  BookOpen,
  BarChart3,
  History,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Start Interview', path: '/interview/setup', icon: PlayCircle },
    { label: 'Resume Interview', path: '/interview/resume', icon: FileText, highlight: true },
    { label: 'Question Bank', path: '/question-bank', icon: BookOpen },
    { label: 'Performance', path: '/analytics', icon: BarChart3 },
    { label: 'History & Reports', path: '/history', icon: History },
    { label: 'Student Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Portal', path: '/admin', icon: ShieldCheck, admin: true });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 90,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: '#0b111e',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 95,
          transition: 'transform 0.3s ease',
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.4rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
            }}
          >
            <Sparkles size={18} color="#000" />
          </div>
          <div>
            <span style={{ fontSize: '1.18rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Interview<span style={{ color: '#38bdf8' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Placement Ready
            </span>
          </div>
        </div>

        {/* User Card Snapshot */}
        <div
          style={{
            padding: '1rem 1.25rem',
            margin: '0.85rem 1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: isAdmin ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Candidate'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 2 }}>
              <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-primary'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {isAdmin ? 'Admin' : user?.targetRole || 'Software Eng'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '0.5rem 0.85rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.65rem' }}>
            Main Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} style={{ color: 'inherit' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#c084fc',
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}
                    >
                      AI
                    </span>
                  )}
                  {item.admin && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}
                    >
                      Admin
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
