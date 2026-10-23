export type EmergencyType = 'Fire' | 'Medical' | 'Police' | 'Accident' | 'Flood' | 'Crime';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Active' | 'Responding' | 'Resolved';
export type TeamType = 'POLICE' | 'FIRE & RESCUE' | 'AMBULANCE';
export type TeamStatus = 'AVAILABLE' | 'DISPATCHED' | 'RESPONDING' | 'BUSY' | 'OFFLINE';
export type AlertType = 'CRITICAL' | 'WARNING' | 'INFORMATION';

export interface Incident {
  id: string;
  type: EmergencyType;
  location: string;
  severity: SeverityLevel;
  time: string;
  assignedTeam: string;
  status: IncidentStatus;
  coordinates: { x: number; y: number }; // Percentage 0-100 on simulated map
  description: string;
  reportedBy: string;
  casualties: number;
  priorityScore: number;
}

export interface ResponseTeam {
  id: string;
  name: string;
  type: TeamType;
  location: string;
  status: TeamStatus;
  currentAssignment: string;
  personnelCount: number;
  eta: string;
  contactFreq: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  time: string;
  status: 'unread' | 'read';
  sector: string;
}

export interface DashboardStats {
  activeIncidents: number;
  criticalIncidents: number;
  responseTeamsDeployed: number;
  totalResponseTeams: number;
  avgResponseTime: string;
}

export interface SystemSettings {
  darkMode: boolean;
  compactMode: boolean;
  notificationSounds: boolean;
  autoRefresh: boolean;
  animationEffects: boolean;
  refreshIntervalSeconds: number;
}
