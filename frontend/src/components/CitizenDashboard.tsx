import React, { useState, useEffect } from 'react';
import { issuesApi } from '../api';
import { Issue, IssueCategory } from '../types';
import { PlusCircle, MapPin, Camera, AlertTriangle, Clock, RefreshCw, CheckCircle, Tag } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('ROAD');
  const [photoUrl, setPhotoUrl] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [latitude, setLatitude] = useState<number>(23.3441);
  const [longitude, setLongitude] = useState<number>(85.3096);
  const [municipalWardNumber, setMunicipalWardNumber] = useState<number>(12);
  const [municipalArea, setMunicipalArea] = useState('Ranchi Municipal Corporation');
  const [locating, setLocating] = useState(false);

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const data = await issuesApi.getMyIssues();
      setIssues(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
        setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
        setLocating(false);
      },
      (err) => {
        alert('Could not retrieve GPS location: ' + err.message);
        setLocating(false);
      }
    );
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await issuesApi.reportIssue({
        description,
        category,
        photoUrl: photoUrl || undefined,
        voiceNoteUrl: voiceNoteUrl || undefined,
        latitude,
        longitude,
        municipalWardNumber,
        municipalArea,
      });
      setSuccess('Civic issue reported successfully! Authorities have been notified.');
      setDescription('');
      setPhotoUrl('');
      setVoiceNoteUrl('');
      fetchMyIssues();
    } catch (err: any) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Report Issue Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <PlusCircle className="text-primary" size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Report a Civic Issue</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Submit road damage, overflowing bins, street light failures, or water leaks with geotagging.
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleReportIssue}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Issue Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
              >
                <option value="ROAD">🛣️ Road / Pothole Damage</option>
                <option value="STREET_LIGHT">💡 Street Light Failure</option>
                <option value="DUSTBIN_OVERFLOW">🗑️ Waste / Dustbin Overflow</option>
                <option value="WATER_SUPPLY">🚰 Water Supply / Pipe Leakage</option>
                <option value="OTHERS">⚠️ Other Civic Problems</option>
              </select>
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
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe the issue, exact landmarks, severity, etc."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Photo URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ward Number</label>
              <input
                type="number"
                className="form-input"
                min={1}
                required
                value={municipalWardNumber}
                onChange={(e) => setMunicipalWardNumber(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Location coordinates */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> GPS Geolocation Coordinates
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="btn btn-outline btn-sm"
                disabled={locating}
              >
                {locating ? 'Detecting...' : '📍 Use My Current GPS'}
              </button>
            </div>
            <div className="grid-2">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latitude</span>
                <input
                  type="number"
                  step="0.000001"
                  className="form-input"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Longitude</span>
                <input
                  type="number"
                  step="0.000001"
                  className="form-input"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting Report...' : 'Submit Civic Issue Report'}
          </button>
        </form>
      </div>

      {/* Reported Issues List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Reported Issues</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time tracking of issues you have submitted.
            </p>
          </div>
          <button onClick={fetchMyIssues} className="btn btn-outline btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>

        {issues.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>You haven't reported any issues yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {issues.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className={`badge badge-${item.status.toLowerCase().replace('_', '')}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="badge badge-category">
                    Ward {item.municipalWardNumber}
                  </span>
                </div>

                {item.photoUrl && (
                  <img
                    src={item.photoUrl}
                    alt="Issue"
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.category}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span>📍 {item.municipalArea} (Lat: {item.latitude}, Lng: {item.longitude})</span>
                  <span>📅 Reported on: {new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.slaDeadline && (
                    <span style={{ color: item.isUrgent ? 'var(--danger)' : 'var(--text-muted)' }}>
                      ⏱️ SLA Deadline: {new Date(item.slaDeadline).toLocaleDateString()}
                    </span>
                  )}
                  {item.assignedWorker && (
                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      👷 Assigned to: {item.assignedWorker.name} ({item.assignedWorker.phoneNumber})
                    </span>
                  )}
                </div>

                {/* Status timeline */}
                {item.statusHistory && item.statusHistory.length > 0 && (
                  <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <strong>Latest Update:</strong> {item.statusHistory[item.statusHistory.length - 1].comment || 'Status updated'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

