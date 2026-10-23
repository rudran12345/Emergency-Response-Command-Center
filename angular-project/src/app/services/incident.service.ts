import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { Incident, IncidentStatus } from '../models/incident.model';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private initialIncidents: Incident[] = [
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
      casualties: 0
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
      casualties: 2
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
      casualties: 1
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
      casualties: 0
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
      casualties: 0
    }
  ];

  private incidentsSubject = new BehaviorSubject<Incident[]>(this.initialIncidents);
  private statsSubject = new BehaviorSubject<DashboardStats>({
    activeIncidents: 27,
    criticalIncidents: 5,
    responseTeams: '18 / 24',
    avgResponseTime: '04:32 min'
  });

  public incidents$: Observable<Incident[]> = this.incidentsSubject.asObservable();
  public stats$: Observable<DashboardStats> = this.statsSubject.asObservable();

  constructor() {
    this.startLiveSimulation();
  }

  private startLiveSimulation(): void {
    interval(6000).subscribe(() => {
      const stats = this.statsSubject.value;
      const sec = 25 + Math.floor(Math.random() * 20);
      this.statsSubject.next({
        ...stats,
        avgResponseTime: `04:${sec < 10 ? '0' + sec : sec} min`
      });
    });
  }

  public updateIncidentStatus(id: string, status: IncidentStatus): void {
    const updated = this.incidentsSubject.value.map(inc => {
      if (inc.id === id) {
        return { ...inc, status };
      }
      return inc;
    });
    this.incidentsSubject.next(updated);
  }

  public assignTeam(id: string, teamName: string): void {
    const updated = this.incidentsSubject.value.map(inc => {
      if (inc.id === id) {
        return { ...inc, assignedTeam: teamName, status: 'Responding' as IncidentStatus };
      }
      return inc;
    });
    this.incidentsSubject.next(updated);
  }
}
