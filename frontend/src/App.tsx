import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserSession } from './types';
import { getStoredUser, getAuthToken, clearAuthSession } from './api';
import { MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

/** Decode JWT payload and check if it is expired (client-side only). */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed token as expired
  }
}

function getValidStoredUser(): UserSession | null {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }
  return getStoredUser();
}

export const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(getValidStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Periodic token expiry check (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getAuthToken();
      if (token && isTokenExpired(token)) {
        clearAuthSession();
        setUser(null);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1 }}>
        {user ? (
          user.role === 'ROLE_ADMIN' ? (
            <AdminDashboard />
          ) : (
            <CitizenDashboard />
          )
        ) : (
          /* Landing Hero for Guests */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', border: '1px solid #bfdbfe' }}>
              <span className="badge badge-inprogress" style={{ marginBottom: '16px' }}>
                Smart India Hackathon 2025
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
                Crowdsourced Civic Issue Reporting & Resolution System
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto 28px' }}>
                Empowering citizens to report municipal issues with instant GPS geotagging, photos, and live SLA tracking while providing municipal authorities tools to coordinate field workers and resolve problems faster.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setIsAuthOpen(true)} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  Citizen Portal (Report Issues) <ArrowRight size={18} />
                </button>
                <button onClick={() => setIsAuthOpen(true)} className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                  Municipal Admin Portal
                </button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid-3">
              <div className="card">
                <div style={{ background: '#dbeafe', width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <MapPin size={24} color="#1d4ed8" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Geotagged Reporting</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Citizens pinpoint the exact GPS location, municipal area, and ward number with attached photographic proof.
                </p>
              </div>

              <div className="card">
                <div style={{ background: '#fef3c7', width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Clock size={24} color="#b45309" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Automated SLA Tracking</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Unresolved issues automatically escalate to priority status when approaching deadline limits (15-day SLA).
                </p>
              </div>

              <div className="card">
                <div style={{ background: '#d1fae5', width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <ShieldCheck size={24} color="#047857" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Municipal Worker Dispatch</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Administrators assign skilled field workers (electricians, masons, plumbers) and track resolution audit history.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'white' }}>
        Smart India Hackathon (SIH) 2025 • Civic Issue Reporting and Resolution System
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};
export default App;

