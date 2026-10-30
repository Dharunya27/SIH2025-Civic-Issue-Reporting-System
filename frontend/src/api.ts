import { Issue, IssueCategory, IssueStatus, Worker, AnalyticsData } from './types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('civic_token');
}

export function setAuthSession(session: any) {
  localStorage.setItem('civic_token', session.token);
  localStorage.setItem('civic_user', JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem('civic_token');
  localStorage.removeItem('civic_user');
}

export function getStoredUser(): any | null {
  const user = localStorage.getItem('civic_user');
  return user ? JSON.parse(user) : null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Auto-clear stale session on 401 Unauthorized
    if (response.status === 401) {
      clearAuthSession();
    }
    const errorMsg = typeof data === 'object' && data?.message
      ? data.message
      : (typeof data === 'string' && data ? data : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data as T;
}

// Authentication
export const authApi = {
  registerUser: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  loginUser: (data: { voterId: string; password: string }) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  registerAdmin: (data: any) => request<any>('/admin/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  loginAdmin: (data: { govId: string; password: string }) => request<any>('/admin/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

// Citizen Issues
export const issuesApi = {
  reportIssue: (data: Partial<Issue>) => request<Issue>('/issues', { method: 'POST', body: JSON.stringify(data) }),
  getMyIssues: () => request<Issue[]>('/issues/my-issues', { method: 'GET' }),
};

// Admin Operations
export const adminApi = {
  getAllIssues: () => request<Issue[]>('/admin/issues', { method: 'GET' }),
  getIssuesByCategory: (cat: IssueCategory) => request<Issue[]>(`/admin/issues/category/${cat}`, { method: 'GET' }),
  getIssuesByStatus: (status: IssueStatus) => request<Issue[]>(`/admin/issues/status/${status}`, { method: 'GET' }),
  getIssuesByWard: (ward: number) => request<Issue[]>(`/admin/issues/ward/${ward}`, { method: 'GET' }),
  getPriorityIssues: () => request<Issue[]>('/admin/issues/priority', { method: 'GET' }),
  updateStatus: (issueId: number, status: IssueStatus, comment?: string) =>
    request<Issue>(`/admin/issues/${issueId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comment }),
    }),
  assignWorker: (issueId: number, workerId: number) =>
    request<Issue>(`/admin/issues/${issueId}/assign?workerId=${workerId}`, {
      method: 'POST',
      body: JSON.stringify({ workerId }),
    }),
  getWorkers: () => request<Worker[]>('/admin/issues/workers', { method: 'GET' }),
  createWorker: (data: Omit<Worker, 'id'>) =>
    request<Worker>('/admin/issues/workers', { method: 'POST', body: JSON.stringify(data) }),
  getAnalytics: () => request<AnalyticsData>('/admin/analytics', { method: 'GET' }),
};

