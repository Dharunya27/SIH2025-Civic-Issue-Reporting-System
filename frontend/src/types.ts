export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type IssueCategory = 'ROAD' | 'STREET_LIGHT' | 'DUSTBIN_OVERFLOW' | 'WATER_SUPPLY' | 'OTHERS';

export type IssueStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface UserSession {
  token: string;
  id: number;
  name: string;
  identifier: string; // voterId or govId
  role: Role;
  municipalArea?: string;
}

export interface Worker {
  id: number;
  name: string;
  contact: string;
  phoneNumber?: string;
  skills?: string;
  municipalArea?: string;
}

export interface IssueStatusHistory {
  id: number;
  status: IssueStatus;
  comment?: string;
  changedAt: string;
}

export interface Issue {
  id: number;
  description: string;
  photoUrl?: string;
  voiceNoteUrl?: string;
  latitude: number;
  longitude: number;
  municipalWardNumber: number;
  municipalArea: string;
  category: IssueCategory;
  status: IssueStatus;
  isUrgent: boolean;
  slaDeadline: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    phoneNumber: string;
  };
  assignedWorker?: Worker | null;
  statusHistory?: IssueStatusHistory[];
}

export interface AnalyticsData {
  totalIssues: number;
  statusBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}
