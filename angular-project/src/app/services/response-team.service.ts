import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseTeam, TeamStatus } from '../models/response-team.model';

@Injectable({
  providedIn: 'root'
})
export class ResponseTeamService {
  private initialTeams: ResponseTeam[] = [
    // Police (12)
    { id: 'PU-01', name: 'Police Unit 01', type: 'POLICE', location: 'Central Zone', status: 'AVAILABLE', currentAssignment: 'Standby Sector Central', personnelCount: 4, eta: '--' },
    { id: 'PU-02', name: 'Police Unit 02', type: 'POLICE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Standby Sector West', personnelCount: 3, eta: '--' },
    { id: 'PU-03', name: 'Police Unit 03', type: 'POLICE', location: 'Guindy', status: 'DISPATCHED', currentAssignment: 'Traffic Escort Grid 4', personnelCount: 4, eta: '03:15 min' },
    { id: 'PU-04', name: 'Police Unit 04', type: 'POLICE', location: 'Velachery', status: 'BUSY', currentAssignment: 'Flood Evacuation Route Control', personnelCount: 5, eta: '--' },
    { id: 'PU-05', name: 'Police Unit 05', type: 'POLICE', location: 'Marina Beach', status: 'RESPONDING', currentAssignment: 'INC-1048 Crowd Control', personnelCount: 4, eta: '02:40 min' },
    { id: 'PU-06', name: 'Police Unit 06', type: 'POLICE', location: 'Koyambedu', status: 'AVAILABLE', currentAssignment: 'Patrol Shift Bravo', personnelCount: 3, eta: '--' },
    { id: 'PU-07', name: 'Police Unit 07', type: 'POLICE', location: 'T Nagar', status: 'OFFLINE', currentAssignment: 'Maintenance & Shift Handoff', personnelCount: 0, eta: '--' },
    { id: 'PU-08', name: 'Police Unit 08', type: 'POLICE', location: 'Adyar', status: 'AVAILABLE', currentAssignment: 'Patrol Sector South', personnelCount: 4, eta: '--' },
    { id: 'PU-09', name: 'Police Unit 09', type: 'POLICE', location: 'Central Zone', status: 'DISPATCHED', currentAssignment: 'Perimeter Setup Station', personnelCount: 4, eta: '04:10 min' },
    { id: 'PU-10', name: 'Police Unit 10', type: 'POLICE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Reserve Squad Alpha', personnelCount: 4, eta: '--' },
    { id: 'PU-11', name: 'Police Unit 11', type: 'POLICE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Standby Industrial Ring', personnelCount: 3, eta: '--' },
    { id: 'PU-12', name: 'Police Unit 12', type: 'POLICE', location: 'T Nagar', status: 'RESPONDING', currentAssignment: 'INC-1045 Active Pursuit', personnelCount: 5, eta: '01:50 min' },

    // Fire & Rescue (6)
    { id: 'FU-01', name: 'Fire Unit 01 (Hazmat)', type: 'FIRE & RESCUE', location: 'Central Zone', status: 'RESPONDING', currentAssignment: 'INC-1047 Warehouse Fire', personnelCount: 8, eta: '02:10 min' },
    { id: 'FU-02', name: 'Fire Unit 02 (Rescue Boat)', type: 'FIRE & RESCUE', location: 'Velachery', status: 'RESPONDING', currentAssignment: 'INC-1046 Urban Flood Evac', personnelCount: 6, eta: '03:45 min' },
    { id: 'FU-03', name: 'Fire Unit 03 (Ladder Truck)', type: 'FIRE & RESCUE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Station 3 Standby', personnelCount: 6, eta: '--' },
    { id: 'FU-04', name: 'Fire Unit 04 (Foam Tender)', type: 'FIRE & RESCUE', location: 'Anna Nagar', status: 'RESPONDING', currentAssignment: 'INC-1042 Commercial Fire', personnelCount: 7, eta: '01:30 min' },
    { id: 'FU-05', name: 'Fire Unit 05 (Rapid Pumper)', type: 'FIRE & RESCUE', location: 'Adyar', status: 'AVAILABLE', currentAssignment: 'Station 7 Standby', personnelCount: 5, eta: '--' },
    { id: 'FU-06', name: 'Fire Unit 06 (Technical Search)', type: 'FIRE & RESCUE', location: 'Koyambedu', status: 'DISPATCHED', currentAssignment: 'Transit Tunnel Safety Scan', personnelCount: 6, eta: '05:00 min' },

    // Ambulance (8)
    { id: 'AMB-01', name: 'Ambulance 01 (ICU)', type: 'AMBULANCE', location: 'Central Zone', status: 'AVAILABLE', currentAssignment: 'General Hospital Base', personnelCount: 3, eta: '--' },
    { id: 'AMB-02', name: 'Ambulance 02 (Basic Support)', type: 'AMBULANCE', location: 'Anna Nagar', status: 'AVAILABLE', currentAssignment: 'Station 2 Depot', personnelCount: 2, eta: '--' },
    { id: 'AMB-03', name: 'Ambulance 03 (Advanced Life)', type: 'AMBULANCE', location: 'Adyar', status: 'RESPONDING', currentAssignment: 'INC-1044 Cardiac Patient', personnelCount: 3, eta: '02:15 min' },
    { id: 'AMB-04', name: 'Ambulance 04 (Trauma Unit)', type: 'AMBULANCE', location: 'T Nagar', status: 'DISPATCHED', currentAssignment: 'Transit Corridor Standby', personnelCount: 3, eta: '04:00 min' },
    { id: 'AMB-05', name: 'Ambulance 05 (Mobile Clinic)', type: 'AMBULANCE', location: 'Koyambedu', status: 'RESPONDING', currentAssignment: 'INC-1049 Truck Rollover', personnelCount: 3, eta: '03:10 min' },
    { id: 'AMB-06', name: 'Ambulance 06 (Pediatric)', type: 'AMBULANCE', location: 'Guindy', status: 'AVAILABLE', currentAssignment: 'Children Clinic Standby', personnelCount: 3, eta: '--' },
    { id: 'AMB-07', name: 'Ambulance 07 (Paramedic)', type: 'AMBULANCE', location: 'Velachery', status: 'BUSY', currentAssignment: 'Flood Evac Transport', personnelCount: 3, eta: '--' },
    { id: 'AMB-08', name: 'Ambulance 08 (Trauma Unit)', type: 'AMBULANCE', location: 'Guindy', status: 'RESPONDING', currentAssignment: 'INC-1043 Multi-Collision', personnelCount: 4, eta: '01:45 min' },
  ];

  private teamsSubject = new BehaviorSubject<ResponseTeam[]>(this.initialTeams);
  public teams$: Observable<ResponseTeam[]> = this.teamsSubject.asObservable();

  public updateTeamStatus(id: string, status: TeamStatus, assignment?: string): void {
    const updated = this.teamsSubject.value.map(team => {
      if (team.id === id) {
        return {
          ...team,
          status,
          currentAssignment: assignment !== undefined ? assignment : team.currentAssignment
        };
      }
      return team;
    });
    this.teamsSubject.next(updated);
  }
}
