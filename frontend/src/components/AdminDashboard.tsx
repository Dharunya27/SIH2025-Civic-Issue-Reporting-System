import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { Issue, IssueStatus, IssueCategory, Worker, AnalyticsData } from '../types';
import {
  ShieldAlert, CheckCircle, Clock, Users, Filter,
  RefreshCw, UserPlus, AlertOctagon, CheckSquare, AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // allIssues holds the raw full list from the server; issues is the filtered view
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters (all applied client-side so they compose correctly)
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityOnly, setPriorityOnly] = useState(false);

  // Status Update Modal state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [statusComment, setStatusComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Assign Worker Modal state
  const [assignIssue, setAssignIssue] = useState<Issue | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | ''>('');
  const [assigning, setAssigning] = useState(false);

  // Add Worker Form state
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerSkills, setWorkerSkills] = useState('');
  const [workerArea, setWorkerArea] = useState('Ranchi Municipal Corporation');
  const [addingWorker, setAddingWorker] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);

  const applyFilters = (raw: Issue[], status: string, category: string, priority: boolean) => {
    let result = raw;
    if (priority) {
      result = result.filter((i) => i.isUrgent);
    }
    if (status !== 'ALL') {
      result = result.filter((i) => i.status === status);
    }
    if (category !== 'ALL') {
      result = result.filter((i) => i.category === category);
    }
    return result;
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rawIssues, workersList, analyticsData] = await Promise.all([
        adminApi.getAllIssues(),
        adminApi.getWorkers(),
        adminApi.getAnalytics().catch(() => null),
      ]);
      const fetched = rawIssues || [];
      setAllIssues(fetched);
      // setIssues is handled by the filter useEffect that watches allIssues
      setWorkers(workersList || []);
      if (analyticsData) setAnalytics(analyticsData);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply all filters client-side whenever a filter changes (no extra network call)
  useEffect(() => {
    setIssues(applyFilters(allIssues, statusFilter, categoryFilter, priorityOnly));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, priorityOnly, allIssues]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setUpdatingStatus(true);
    try {
      await adminApi.updateStatus(selectedIssue.id, newStatus, statusComment);
      setSelectedIssue(null);
      setStatusComment('');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignIssue || !selectedWorkerId) return;
    setAssigning(true);
    try {
      await adminApi.assignWorker(assignIssue.id, Number(selectedWorkerId));
      setAssignIssue(null);
      setSelectedWorkerId('');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Worker assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingWorker(true);
    setWorkerError(null);
    try {
      await adminApi.createWorker({
        name: workerName.trim(),
        contact: workerPhone.trim(),
        skills: workerSkills.trim(),
        municipalArea: workerArea.trim(),
      });
      setShowAddWorker(false);
      setWorkerName('');
      setWorkerPhone('');
      setWorkerSkills('');
      loadAllData();
    } catch (err: any) {
      setWorkerError(err.message || 'Failed to create worker');
    } finally {
      setAddingWorker(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Analytics Cards */}
      <div className="grid-4">
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Area Issues</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{analytics?.totalIssues ?? allIssues.length}</h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Resolution</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309' }}>
            {analytics?.statusBreakdown?.PENDING ?? allIssues.filter(i => i.status === 'PENDING').length}
          </h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In Progress</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d4ed8' }}>
            {analytics?.statusBreakdown?.IN_PROGRESS ?? allIssues.filter(i => i.status === 'IN_PROGRESS').length}
          </h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved Successfully</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#047857' }}>
            {analytics?.statusBreakdown?.RESOLVED ?? allIssues.filter(i => i.status === 'RESOLVED').length}
          </h3>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPriorityOnly(false); }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPriorityOnly(false); }}
            >
              <option value="ALL">All Categories</option>
              <option value="ROAD">Road</option>
              <option value="STREET_LIGHT">Street Light</option>
              <option value="DUSTBIN_OVERFLOW">Dustbin Overflow</option>
              <option value="WATER_SUPPLY">Water Supply</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <button
            onClick={() => setPriorityOnly(!priorityOnly)}
            className={`btn btn-sm ${priorityOnly ? 'btn-danger' : 'btn-outline'}`}
          >
            <AlertOctagon size={14} /> Priority / SLA Alert
          </button>

          {/* Reset filters button — only visible when any filter is active */}
          {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || priorityOnly) && (
            <button
              onClick={() => { setStatusFilter('ALL'); setCategoryFilter('ALL'); setPriorityOnly(false); }}
              className="btn btn-sm btn-outline"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              ✕ Reset Filters
            </button>
          )}

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{issues.length}</strong> of <strong>{allIssues.length}</strong> issues
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setShowAddWorker(true); setWorkerError(null); }}
            className="btn btn-primary btn-sm"
          >
            <UserPlus size={14} /> Add Worker
          </button>
          <button onClick={loadAllData} className="btn btn-outline btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Category & Details</th>
              <th style={{ padding: '12px 16px' }}>Citizen Info</th>
              <th style={{ padding: '12px 16px' }}>Ward</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Assigned Worker</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No civic issues found matching the criteria.
                </td>
              </tr>
            ) : (
              issues.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{item.id}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-category">{item.category}</span>
                      {item.isUrgent && <span className="badge badge-urgent">Priority</span>}
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{item.description}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{item.user?.name || 'Citizen'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.user?.phoneNumber || ''}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>Ward {item.municipalWardNumber}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${item.status.toLowerCase().replace('_', '')}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {item.assignedWorker ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.assignedWorker.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.assignedWorker.contact || item.assignedWorker.phoneNumber}
                          {item.assignedWorker.skills ? ` • ${item.assignedWorker.skills}` : ''}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedIssue(item)}
                        className="btn btn-outline btn-sm"
                        title="Update Status"
                      >
                        <CheckSquare size={14} /> Status
                      </button>
                      <button
                        onClick={() => setAssignIssue(item)}
                        className="btn btn-outline btn-sm"
                        title="Assign Worker"
                      >
                        <Users size={14} /> Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Update Status for Issue #{selectedIssue.id}
            </h3>
            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Resolution Comment</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Work crew dispatched / Road patched successfully"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setSelectedIssue(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updatingStatus}>
                  {updatingStatus ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN WORKER MODAL */}
      {assignIssue && (
        <div className="modal-overlay" onClick={() => setAssignIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Assign Field Worker to Issue #{assignIssue.id}
            </h3>
            <form onSubmit={handleAssignWorker}>
              <div className="form-group">
                <label className="form-label">Select Field Worker</label>
                {workers.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--danger)', margin: '10px 0' }}>
                    No field workers registered yet. Please click "Add Worker" to register a worker first.
                  </p>
                ) : (
                  <select
                    className="form-select"
                    required
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(Number(e.target.value))}
                  >
                    <option value="">-- Choose a registered worker --</option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} {w.skills ? `(${w.skills})` : ''} - {w.contact || w.phoneNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setAssignIssue(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={assigning || !selectedWorkerId}>
                  {assigning ? 'Assigning...' : 'Assign Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WORKER MODAL */}
      {showAddWorker && (
        <div className="modal-overlay" onClick={() => setShowAddWorker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Register New Field Worker
            </h3>

            {workerError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{workerError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWorker}>
              <div className="form-group">
                <label className="form-label">Worker Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Ramesh Singh"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact / Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  required
                  placeholder="10-digit mobile number"
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Skills / Trade</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Electrician, Road Mason, Plumber"
                  value={workerSkills}
                  onChange={(e) => setWorkerSkills(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Municipal Area</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={workerArea}
                  onChange={(e) => setWorkerArea(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAddWorker(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={addingWorker}>
                  {addingWorker ? 'Registering Worker...' : 'Register Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
