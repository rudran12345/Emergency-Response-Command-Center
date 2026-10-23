export type TeamType = 'POLICE' | 'FIRE & RESCUE' | 'AMBULANCE';
export type TeamStatus = 'AVAILABLE' | 'DISPATCHED' | 'RESPONDING' | 'BUSY' | 'OFFLINE';

export interface ResponseTeam {
  id: string;
  name: string;
  type: TeamType;
  location: string;
  status: TeamStatus;
  currentAssignment: string;
  personnelCount: number;
  eta: string;
}
