import React, { useState } from 'react';
import { authApi, setAuthSession, clearAuthSession } from '../api';
import { UserSession } from '../types';
import { X, User, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

type AuthMode = 'citizen_login' | 'citizen_register' | 'admin_login' | 'admin_register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('citizen_login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Citizen Form state
  const [voterId, setVoterId] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [state, setState] = useState('Jharkhand');
  const [district, setDistrict] = useState('Ranchi');
  const [municipalArea, setMunicipalArea] = useState('Ranchi Municipal Corporation');

  // Admin Form state
  const [govId, setGovId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminMunicipalArea, setAdminMunicipalArea] = useState('Ranchi Municipal Corporation');

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleSwitchTab = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    clearAuthSession(); // Clear any stale token before fresh login
    try {
      const res = await authApi.loginUser({ voterId, password: citizenPassword });
      const session: UserSession = {
        token: res.token,
        id: res.id,
        name: res.name || voterId,
        identifier: voterId,
        role: 'ROLE_USER',
      };
      setAuthSession(session);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Citizen login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCitizenRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.registerUser({
        voterId,
        name: citizenName,
        email: citizenEmail,
        phoneNumber: citizenPhone,
        password: citizenPassword,
        state,
        district,
        municipalArea,
      });
      setSuccessMsg('Registration successful! Please login with your Voter ID.');
      setMode('citizen_login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    clearAuthSession(); // Clear any stale token before fresh login
    try {
      const res = await authApi.loginAdmin({ govId, password: adminPassword });
      const session: UserSession = {
        token: res.token,
        id: res.id,
        name: res.name || govId,
        identifier: govId,
        role: 'ROLE_ADMIN',
        municipalArea: res.workingMunicipalArea || adminMunicipalArea,
      };
      setAuthSession(session);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.registerAdmin({
        govId,
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: adminPassword,
        workingMunicipalArea: adminMunicipalArea,
      });
      setSuccessMsg('Admin registered successfully! You can now log in.');
      setMode('admin_login');
    } catch (err: any) {
      setError(err.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {mode.startsWith('citizen') ? 'Citizen Portal' : 'Administrator Portal'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="tabs-nav" style={{ marginBottom: '16px' }}>
          <button
            className={`tab-btn ${mode === 'citizen_login' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('citizen_login')}
          >
            <User size={15} style={{ display: 'inline', marginRight: 4 }} /> Citizen Login
          </button>
          <button
            className={`tab-btn ${mode === 'citizen_register' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('citizen_register')}
          >
            Register Citizen
          </button>
          <button
            className={`tab-btn ${mode === 'admin_login' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('admin_login')}
          >
            <Shield size={15} style={{ display: 'inline', marginRight: 4 }} /> Admin Login
          </button>
          <button
            className={`tab-btn ${mode === 'admin_register' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('admin_register')}
          >
            Register Admin
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* CITIZEN LOGIN */}
        {mode === 'citizen_login' && (
          <form onSubmit={handleCitizenLogin}>
            <div className="form-group">
              <label className="form-label">Voter ID (Gov. ID)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ABC1234567"
                required
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={citizenPassword}
                onChange={(e) => setCitizenPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In as Citizen'}
            </button>
          </form>
        )}

        {/* CITIZEN REGISTER */}
        {mode === 'citizen_register' && (
          <form onSubmit={handleCitizenRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Voter ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ABC1234567"
                  required
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajesh Kumar"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit number"
                  required
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="citizen@example.com"
                  value={citizenEmail}
                  onChange={(e) => setCitizenEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Municipal Area</label>
              <input
                type="text"
                className="form-input"
                required
                value={municipalArea}
                onChange={(e) => setMunicipalArea(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={citizenPassword}
                onChange={(e) => setCitizenPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Registering...' : 'Complete Citizen Registration'}
            </button>
          </form>
        )}

        {/* ADMIN LOGIN */}
        {mode === 'admin_login' && (
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label className="form-label">Government ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GOV-ADMIN-01"
                required
                value={govId}
                onChange={(e) => setGovId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>
        )}

        {/* ADMIN REGISTER */}
        {mode === 'admin_register' && (
          <form onSubmit={handleAdminRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Government ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. GOV-ADMIN-01"
                  required
                  value={govId}
                  onChange={(e) => setGovId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Officer Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Inspector Verma"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Working Municipal Area</label>
              <input
                type="text"
                className="form-input"
                required
                value={adminMunicipalArea}
                onChange={(e) => setAdminMunicipalArea(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register Administrator'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

