import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu, Sparkles, Plus, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            backgroundColor: 'rgba(11, 17, 30, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="btn btn-secondary btn-icon"
              style={{ display: 'none' }}
              id="mobile-menu-btn"
            >
              <Menu size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Placement Candidate:</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>{user?.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/interview/setup" className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Start Interview</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #mobile-menu-btn { display: inline-flex !important; }
          aside {
            position: fixed !important;
            transform: translateX(${mobileOpen ? '0' : '-100%'});
          }
        }
      `}</style>
    </div>
  );
};
