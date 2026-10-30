import React from 'react';
import { UserSession } from '../types';
import { Landmark, LogOut, User as UserIcon, Shield, ExternalLink } from 'lucide-react';

interface NavbarProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout }) => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Landmark size={28} />
          <div>
            <span>CivicConnect</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block' }}>
              SIH 2025 Civic Issue Resolution Portal
            </span>
          </div>
        </div>

        <div className="nav-actions">
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            title="Open Swagger REST API Docs"
          >
            <ExternalLink size={14} /> Swagger API
          </a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.role === 'ROLE_ADMIN' ? '🛡️ Admin' : '👤 Citizen'} • {user.identifier}
                </span>
              </div>
              <button onClick={onLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary btn-sm">
              <UserIcon size={16} /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

