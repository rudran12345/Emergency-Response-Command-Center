export type EmergencyType = 'Fire' | 'Medical' | 'Police' | 'Accident' | 'Flood' | 'Crime';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Active' | 'Responding' | 'Resolved';

export interface Incident {
  id: string;
  type: EmergencyType;
  location: string;
  severity: SeverityLevel;
  time: string;
  assignedTeam: string;
  status: IncidentStatus;
  coordinates: { x: number; y: number };
  description: string;
  reportedBy?: string;
  casualties?: number;
}
