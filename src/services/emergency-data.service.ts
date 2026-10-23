import {
  Incident,
  ResponseTeam,
  Alert,
  AlertType,
  DashboardStats,
  SeverityLevel,
  EmergencyType,
  TeamStatus,
  IncidentStatus
} from '../models/emergency.types';
import { settingsService } from './settings.service';
import { soundService } from './sound.service';

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-1042',
    type: 'Fire',
    location: 'Anna Nagar',
    severity: 'Critical',
    time: '19:20',
    assignedTeam: 'Fire Unit 04',
    status: 'Active',
    coordinates: { x: 28, y: 32 },
    description: 'Commercial complex 3rd floor electrical fire. Smoke plumes visible, 2 squads dispatched.',
    reportedBy: 'Building Security Dispatch',
    casualties: 0,
    priorityScore: 98,
  },
  {
    id: 'INC-1043',
    type: 'Accident',
    location: 'Guindy',
    severity: 'High',
    time: '19:25',
    assignedTeam: 'Ambulance 08',
    status: 'Responding',
    coordinates: { x: 42, y: 68 },
    description: 'Multi-vehicle collision near arterial flyover ramp. Fast lane blocked, emergency triage requested.',
    reportedBy: 'Highway Traffic Patrol Cam 14',
    casualties: 2,
    priorityScore: 84,
  },
  {
    id: 'INC-1044',
    type: 'Medical',
    location: 'Adyar',
    severity: 'Medium',
    time: '19:29',
    assignedTeam: 'Ambulance 03',
    status: 'Active',
    coordinates: { x: 74, y: 72 },
    description: 'Elderly citizen cardiac distress at residential apartment. Paramedic resuscitation kit ready.',
    reportedBy: 'Emergency Hotline 112',
    casualties: 1,
    priorityScore: 68,
  },
  {
    id: 'INC-1045',
    type: 'Crime',
    location: 'T Nagar',
    severity: 'High',
    time: '19:31',
    assignedTeam: 'Police Unit 12',
    status: 'Responding',
    coordinates: { x: 52, y: 46 },
    description: 'Armed robbery suspect tracked along pedestrian bazaar corridor. Perimeter lockdown initiated.',
    reportedBy: 'Storefront Silent Alarm #44',
    casualties: 0,
    priorityScore: 88,
  },
  {
    id: 'INC-1046',
    type: 'Flood',
    location: 'Velachery',
    severity: 'Critical',
    time: '19:35',
    assignedTeam: 'Fire Unit 02',
    status: 'Active',
    coordinates: { x: 62, y: 84 },
    description: 'Sudden storm drain surge inundating low-lying bypass. Submerged vehicles reported.',
    reportedBy: 'Municipal Sensor Node S-09',
    casualties: 0,
    priorityScore: 92,
  },
  {
    id: 'INC-1047',
    type: 'Fire',
    location: 'Central Zone',
    severity: 'Critical',
    time: '19:38',
    assignedTeam: 'Fire Unit 01',
    status: 'Active',
    coordinates: { x: 55, y: 22 },
    description: 'Industrial warehouse chemical container thermal flare. Hazmat foam apparatus requested.',
    reportedBy: 'Fire Tower Lookout Alpha',
    casualties: 0,
    priorityScore: 99,
  },
  {
    id: 'INC-1048',
    type: 'Police',
    location: 'Marina Beach',
    severity: 'Medium',
    time: '19:40',
    assignedTeam: 'Police Unit 05',
    status: 'Active',
    coordinates: { x: 86, y: 38 },
    description: 'Public disturbance and perimeter crowding at coastal promenade.',
    reportedBy: 'Coastal Guard Mobile Patrol',
    casualties: 0,
    priorityScore: 54,
  },
  {
    id: 'INC-1049',
    type: 'Accident',
    location: 'Koyambedu',
    severity: 'High',
    time: '19:44',
    assignedTeam: 'Ambulance 05',
    status: 'Active',
    coordinates: { x: 18, y: 48 },
    description: 'Heavy logistics truck overturned near terminal entry. Road obstruction and minor fuel spillage.',
    reportedBy: 'Transit Command C-03',
    casualties: 1,
    priorityScore: 78,
  },
  {
    id: 'INC-1050',
    type: 'Medical',
    location: 'Anna Nagar',
    severity: 'Low',
    time: '19:46',
    assignedTeam: 'Ambulance 02',
    status: 'Resolved',
    coordinates: { x: 34, y: 25 },
    description: 'Dehydration and heat exhaustion treated on site during open community marathon.',
    reportedBy: 'Volunteer First Responder',
    casualties: 0,
    priorityScore: 32,
  },
  {
    id: 'INC-1051',
    type: 'Crime',
    location: 'Adyar',
    severity: 'Medium',
    time: '19:48',
    assignedTeam: 'Police Unit 08',
    status: 'Resolved',
    coordinates: { x: 79, y: 64 },
    description: 'Suspicious vehicle intercepted and verified. Perimeter cleared by squad.',
    reportedBy: 'Patrol Vehicle 08',
    casualties: 0,
    priorityScore: 40,
  }
];

const INITIAL_TEAMS: ResponseTeam[] = [
  // Police Teams (12)
  { id: 'PU-01', name: 'Police Unit 01', type: 'POLICE', location: 'Central Zone', status: 'AVAILABLE', currentAssignment: 'Standby Sector Central', personnelCount: 4, eta: '--', contactFreq: 'CH-01 154.2 MHz' },
  { id: 'PU-02', name: 'Police Unit 02', type: 'POLICE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Standby Sector West', personnelCount: 3, eta: '--', contactFreq: 'CH-01 154.2 MHz' },
  { id: 'PU-03', name: 'Police Unit 03', type: 'POLICE', location: 'Guindy', status: 'DISPATCHED', currentAssignment: 'Traffic Escort Grid 4', personnelCount: 4, eta: '03:15 min', contactFreq: 'CH-02 154.6 MHz' },
  { id: 'PU-04', name: 'Police Unit 04', type: 'POLICE', location: 'Velachery', status: 'BUSY', currentAssignment: 'Flood Evacuation Route Control', personnelCount: 5, eta: '--', contactFreq: 'CH-02 154.6 MHz' },
  { id: 'PU-05', name: 'Police Unit 05', type: 'POLICE', location: 'Marina Beach', status: 'RESPONDING', currentAssignment: 'INC-1048 Crowd Control', personnelCount: 4, eta: '02:40 min', contactFreq: 'CH-03 155.1 MHz' },
  { id: 'PU-06', name: 'Police Unit 06', type: 'POLICE', location: 'Koyambedu', status: 'AVAILABLE', currentAssignment: 'Patrol Shift Bravo', personnelCount: 3, eta: '--', contactFreq: 'CH-01 154.2 MHz' },
  { id: 'PU-07', name: 'Police Unit 07', type: 'POLICE', location: 'T Nagar', status: 'OFFLINE', currentAssignment: 'Maintenance & Shift Handoff', personnelCount: 0, eta: '--', contactFreq: 'OFFLINE' },
  { id: 'PU-08', name: 'Police Unit 08', type: 'POLICE', location: 'Adyar', status: 'AVAILABLE', currentAssignment: 'Patrol Sector South', personnelCount: 4, eta: '--', contactFreq: 'CH-03 155.1 MHz' },
  { id: 'PU-09', name: 'Police Unit 09', type: 'POLICE', location: 'Central Zone', status: 'DISPATCHED', currentAssignment: 'Perimeter Setup Station', personnelCount: 4, eta: '04:10 min', contactFreq: 'CH-02 154.6 MHz' },
  { id: 'PU-10', name: 'Police Unit 10', type: 'POLICE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Reserve Squad Alpha', personnelCount: 4, eta: '--', contactFreq: 'CH-01 154.2 MHz' },
  { id: 'PU-11', name: 'Police Unit 11', type: 'POLICE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Standby Industrial Ring', personnelCount: 3, eta: '--', contactFreq: 'CH-02 154.6 MHz' },
  { id: 'PU-12', name: 'Police Unit 12', type: 'POLICE', location: 'T Nagar', status: 'RESPONDING', currentAssignment: 'INC-1045 Active Robbery Pursuit', personnelCount: 5, eta: '01:50 min', contactFreq: 'CH-01 154.2 MHz' },

  // Fire & Rescue Teams (6)
  { id: 'FU-01', name: 'Fire Unit 01 (Heavy Hazmat)', type: 'FIRE & RESCUE', location: 'Central Zone', status: 'RESPONDING', currentAssignment: 'INC-1047 Warehouse Fire', personnelCount: 8, eta: '02:10 min', contactFreq: 'TAC-FIRE 153.8 MHz' },
  { id: 'FU-02', name: 'Fire Unit 02 (Rescue Boat)', type: 'FIRE & RESCUE', location: 'Velachery', status: 'RESPONDING', currentAssignment: 'INC-1046 Urban Flood Evac', personnelCount: 6, eta: '03:45 min', contactFreq: 'TAC-FIRE 153.8 MHz' },
  { id: 'FU-03', name: 'Fire Unit 03 (Ladder Truck)', type: 'FIRE & RESCUE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Station 3 Standby', personnelCount: 6, eta: '--', contactFreq: 'TAC-FIRE 153.8 MHz' },
  { id: 'FU-04', name: 'Fire Unit 04 (Foam Tender)', type: 'FIRE & RESCUE', location: 'Anna Nagar', status: 'RESPONDING', currentAssignment: 'INC-1042 Commercial Fire', personnelCount: 7, eta: '01:30 min', contactFreq: 'TAC-FIRE 153.8 MHz' },
  { id: 'FU-05', name: 'Fire Unit 05 (Rapid Pumper)', type: 'FIRE & RESCUE', location: 'Adyar', status: 'AVAILABLE', currentAssignment: 'Station 7 Standby', personnelCount: 5, eta: '--', contactFreq: 'TAC-FIRE 153.8 MHz' },
  { id: 'FU-06', name: 'Fire Unit 06 (Technical Search)', type: 'FIRE & RESCUE', location: 'Koyambedu', status: 'DISPATCHED', currentAssignment: 'Transit Tunnel Safety Scan', personnelCount: 6, eta: '05:00 min', contactFreq: 'TAC-FIRE 153.8 MHz' },

  // Ambulance Teams (8)
  { id: 'AMB-01', name: 'Ambulance 01 (ICU Mobile)', type: 'AMBULANCE', location: 'Central Zone', status: 'AVAILABLE', currentAssignment: 'General Hospital Base', personnelCount: 3, eta: '--', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-02', name: 'Ambulance 02 (Basic Support)', type: 'AMBULANCE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Station 2 Depot', personnelCount: 2, eta: '--', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-03', name: 'Ambulance 03 (Advanced Life)', type: 'AMBULANCE', location: 'Adyar', status: 'RESPONDING', currentAssignment: 'INC-1044 Cardiac Patient', personnelCount: 3, eta: '02:15 min', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-04', name: 'Ambulance 04 (Trauma Unit)', type: 'AMBULANCE', location: 'T Nagar', status: 'DISPATCHED', currentAssignment: 'Transit Corridor Standby', personnelCount: 3, eta: '04:00 min', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-05', name: 'Ambulance 05 (Mobile Clinic)', type: 'AMBULANCE', location: 'Koyambedu', status: 'RESPONDING', currentAssignment: 'INC-1049 Truck Rollover', personnelCount: 3, eta: '03:10 min', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-06', name: 'Ambulance 06 (Pediatric)', type: 'AMBULANCE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Children Clinic Standby', personnelCount: 3, eta: '--', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-07', name: 'Ambulance 07 (Paramedic Unit)', type: 'AMBULANCE', location: 'Velachery', status: 'BUSY', currentAssignment: 'Flood Evac Patient Transport', personnelCount: 3, eta: '--', contactFreq: 'MED-NET 155.3 MHz' },
  { id: 'AMB-08', name: 'Ambulance 08 (Trauma Unit)', type: 'AMBULANCE', location: 'Guindy', status: 'RESPONDING', currentAssignment: 'INC-1043 Multi-Collision Triage', personnelCount: 4, eta: '01:45 min', contactFreq: 'MED-NET 155.3 MHz' },
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-901',
    type: 'CRITICAL',
    message: 'Fire emergency detected in Sector 04 - Anna Nagar commercial tower.',
    time: '19:21',
    status: 'unread',
    sector: 'Sector 04',
  },
  {
    id: 'ALT-902',
    type: 'WARNING',
    message: 'Multiple incidents reported in Central Zone - Emergency grid congested.',
    time: '19:26',
    status: 'unread',
    sector: 'Central Zone',
  },
  {
    id: 'ALT-903',
    type: 'INFORMATION',
    message: 'Ambulance Unit 08 is now dispatched to Guindy arterial junction.',
    time: '19:30',
    status: 'unread',
    sector: 'Sector 09',
  },
  {
    id: 'ALT-904',
    type: 'CRITICAL',
    message: 'Storm drain breach in Velachery bypass: Water level rising rapidly.',
    time: '19:36',
    status: 'unread',
    sector: 'Sector 06',
  },
  {
    id: 'ALT-905',
    type: 'INFORMATION',
    message: 'Police Unit 08 completed perimeter verification at Adyar sector.',
    time: '19:49',
    status: 'read',
    sector: 'Sector 02',
  }
];

class EmergencyDataService {
  private incidents: Incident[] = [...INITIAL_INCIDENTS];
  private teams: ResponseTeam[] = [...INITIAL_TEAMS];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private stats: DashboardStats = {
    activeIncidents: 27,
    criticalIncidents: 5,
    responseTeamsDeployed: 18,
    totalResponseTeams: 26,
    avgResponseTime: '04:32 min',
  };

  private listeners: {
    incidents: ((data: Incident[]) => void)[];
    teams: ((data: ResponseTeam[]) => void)[];
    alerts: ((data: Alert[]) => void)[];
    stats: ((data: DashboardStats) => void)[];
  } = {
    incidents: [],
    teams: [],
    alerts: [],
    stats: [],
  };

  private timer: number | null = null;
  private simulationTick = 0;
  private nextIncidentNum = 1052;
  private nextAlertNum = 906;

  constructor() {
    this.recalculateStats();
    this.startSimulation();

    settingsService.subscribe((settings) => {
      if (settings.autoRefresh) {
        if (!this.timer) {
          this.startSimulation();
        }
      } else {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    });
  }

  private recalculateStats() {
    const active = this.incidents.filter(i => i.status !== 'Resolved').length;
    const critical = this.incidents.filter(i => i.status !== 'Resolved' && i.severity === 'Critical').length;
    const deployed = this.teams.filter(t => t.status !== 'AVAILABLE' && t.status !== 'OFFLINE').length;
    
    // Add base simulated baseline (e.g. 20 base regional items + local active)
    this.stats = {
      activeIncidents: 20 + active,
      criticalIncidents: critical,
      responseTeamsDeployed: deployed + 7,
      totalResponseTeams: this.teams.length,
      avgResponseTime: this.stats.avgResponseTime || '04:32 min',
    };
    this.notifyStats();
  }

  private startSimulation() {
    if (typeof window === 'undefined') return;
    if (this.timer) clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      this.simulationTick++;
      this.runSimulationStep();
    }, 6000);
  }

  private runSimulationStep() {
    // 1. Slightly update response time
    const seconds = 25 + Math.floor(Math.sin(this.simulationTick) * 15);
    const min = 4;
    this.stats.avgResponseTime = `0${min}:${seconds < 10 ? '0' + seconds : seconds} min`;

    // 2. Occasionally simulate live event every 3 ticks
    if (this.simulationTick % 3 === 0) {
      // Toggle a team status
      const availableTeam = this.teams.find(t => t.status === 'AVAILABLE');
      if (availableTeam && Math.random() > 0.4) {
        availableTeam.status = 'DISPATCHED';
        availableTeam.currentAssignment = 'Sector Patrol Route ' + (Math.floor(Math.random() * 8) + 1);
        availableTeam.eta = '03:30 min';
        this.notifyTeams();

        // Add info alert
        this.addAlert({
          type: 'INFORMATION',
          message: `${availableTeam.name} dispatched to active perimeter.`,
          sector: availableTeam.location,
        });
      }
    }

    if (this.simulationTick % 5 === 0) {
      const busyTeam = this.teams.find(t => t.status === 'DISPATCHED' || t.status === 'RESPONDING');
      if (busyTeam) {
        busyTeam.status = 'AVAILABLE';
        busyTeam.currentAssignment = 'Standby Depot';
        busyTeam.eta = '--';
        this.notifyTeams();
      }
    }

    this.recalculateStats();
  }

  // --- Public APIs ---

  public getIncidents(): Incident[] {
    return [...this.incidents];
  }

  public getTeams(): ResponseTeam[] {
    return [...this.teams];
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getStats(): DashboardStats {
    return { ...this.stats };
  }

  public subscribeIncidents(cb: (data: Incident[]) => void): () => void {
    this.listeners.incidents.push(cb);
    cb(this.getIncidents());
    return () => {
      this.listeners.incidents = this.listeners.incidents.filter(l => l !== cb);
    };
  }

  public subscribeTeams(cb: (data: ResponseTeam[]) => void): () => void {
    this.listeners.teams.push(cb);
    cb(this.getTeams());
    return () => {
      this.listeners.teams = this.listeners.teams.filter(l => l !== cb);
    };
  }

  public subscribeAlerts(cb: (data: Alert[]) => void): () => void {
    this.listeners.alerts.push(cb);
    cb(this.getAlerts());
    return () => {
      this.listeners.alerts = this.listeners.alerts.filter(l => l !== cb);
    };
  }

  public subscribeStats(cb: (data: DashboardStats) => void): () => void {
    this.listeners.stats.push(cb);
    cb(this.getStats());
    return () => {
      this.listeners.stats = this.listeners.stats.filter(l => l !== cb);
    };
  }

  public addIncident(incident: Omit<Incident, 'id' | 'time'>): Incident {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextNum = this.nextIncidentNum++;
    const newInc: Incident = {
      ...incident,
      id: `INC-${nextNum}`,
      time: timeStr,
    };
    this.incidents = [newInc, ...this.incidents];
    
    if (newInc.severity === 'Critical') {
      soundService.playAlertCritical();
    } else {
      soundService.playAlertWarning();
    }

    this.addAlert({
      type: newInc.severity === 'Critical' ? 'CRITICAL' : 'WARNING',
      message: `${newInc.type.toUpperCase()} reported in ${newInc.location}. Assigned: ${newInc.assignedTeam}`,
      sector: newInc.location,
    });

    this.notifyIncidents();
    this.recalculateStats();
    return newInc;
  }

  public updateIncidentStatus(id: string, status: IncidentStatus) {
    this.incidents = this.incidents.map(inc => {
      if (inc.id === id) {
        return { ...inc, status };
      }
      return inc;
    });
    this.notifyIncidents();
    this.recalculateStats();
  }

  public assignTeamToIncident(incidentId: string, teamName: string) {
    soundService.playDispatch();
    this.incidents = this.incidents.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, assignedTeam: teamName, status: 'Responding' };
      }
      return inc;
    });

    // Update the team's status too
    this.teams = this.teams.map(team => {
      if (team.name === teamName) {
        return {
          ...team,
          status: 'RESPONDING',
          currentAssignment: `Assigned to ${incidentId}`,
          eta: '02:30 min',
        };
      }
      return team;
    });

    this.addAlert({
      type: 'INFORMATION',
      message: `${teamName} dispatched to ${incidentId}.`,
      sector: 'Dispatch Operations',
    });

    this.notifyIncidents();
    this.notifyTeams();
    this.recalculateStats();
  }

  public updateTeamStatus(teamId: string, status: TeamStatus, assignment?: string) {
    this.teams = this.teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          status,
          currentAssignment: assignment !== undefined ? assignment : (status === 'AVAILABLE' ? 'Standby Depot' : t.currentAssignment),
          eta: status === 'AVAILABLE' || status === 'OFFLINE' ? '--' : t.eta,
        };
      }
      return t;
    });

    if (status === 'AVAILABLE') {
      soundService.playBeep(520, 'sine', 0.08);
    } else {
      soundService.playDispatch();
    }

    this.notifyTeams();
    this.recalculateStats();
  }

  public addAlert(data: { type: AlertType; message: string; sector: string }) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextNum = this.nextAlertNum++;
    const newAlert: Alert = {
      id: `ALT-${nextNum}`,
      type: data.type,
      message: data.message,
      time: timeStr,
      status: 'unread',
      sector: data.sector,
    };
    this.alerts = [newAlert, ...this.alerts];
    this.notifyAlerts();
  }

  public markAlertAsRead(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, status: 'read' } : a);
    this.notifyAlerts();
  }

  public markAllAlertsAsRead() {
    this.alerts = this.alerts.map(a => ({ ...a, status: 'read' }));
    this.notifyAlerts();
  }

  public dismissAlert(id: string) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.notifyAlerts();
  }

  public clearAllAlerts() {
    this.alerts = [];
    this.notifyAlerts();
  }

  private notifyIncidents() {
    this.listeners.incidents.forEach(cb => cb(this.getIncidents()));
  }

  private notifyTeams() {
    this.listeners.teams.forEach(cb => cb(this.getTeams()));
  }

  private notifyAlerts() {
    this.listeners.alerts.forEach(cb => cb(this.getAlerts()));
  }

  private notifyStats() {
    this.listeners.stats.forEach(cb => cb(this.getStats()));
  }
}

export const emergencyDataService = new EmergencyDataService();
