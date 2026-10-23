import React from 'react';
import {
  AlertTriangle,
  Flame,
  Users,
  Clock,
  ChevronRight,
  Shield,
  Ambulance,
  Car,
  Waves,
} from 'lucide-react';
import { Incident, DashboardStats, ResponseTeam, EmergencyType } from '../models/emergency.types';
import { StatCardComponent } from './StatCardComponent';
import { IncidentMapComponent } from './IncidentMapComponent';

interface DashboardComponentProps {
  stats: DashboardStats;
  incidents: Incident[];
  teams: ResponseTeam[];
  onSelectIncident: (incident: Incident) => void;
  onNavigateToIncidents: () => void;
  onNavigateToTeams: () => void;
  onNavigateToAlerts: () => void;
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({
  stats,
  incidents,
  teams,
  onSelectIncident,
  onNavigateToIncidents,
  onNavigateToTeams,
  onNavigateToAlerts: _onNavigateToAlerts,
}) => {
  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved');

  const getTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'Fire': return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'Medical': return <Ambulance className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Accident': return <Car className="w-3.5 h-3.5 text-amber-400" />;
      case 'Flood': return <Waves className="w-3.5 h-3.5 text-blue-400" />;
      case 'Police':
      case 'Crime':
      default: return <Shield className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCardComponent
          title="Active Incidents"
          value={stats.activeIncidents}
          subtitle="Currently active emergencies"
          icon={AlertTriangle}
          variant="info"
          trend="+2 recent"
        />

        <StatCardComponent
          title="Critical Incidents"
          value={stats.criticalIncidents < 10 ? `0${stats.criticalIncidents}` : stats.criticalIncidents}
          subtitle="Requires immediate response"
          icon={Flame}
          variant="critical"
          trend="High priority"
        />

        <StatCardComponent
          title="Response Teams"
          value={`${stats.responseTeamsDeployed} / ${stats.totalResponseTeams}`}
          subtitle="Units deployed across city"
          icon={Users}
          variant="warning"
          trend="Active Fleet"
        />

        <StatCardComponent
          title="Avg Response Time"
          value={stats.avgResponseTime}
          subtitle="Average time to scene"
          icon={Clock}
          variant="success"
          trend="Optimal"
        />
      </div>

      {/* City Incident Map */}
      <div>
        <IncidentMapComponent
          incidents={incidents}
          onSelectIncident={onSelectIncident}
        />
      </div>

      {/* Two-Column: Recent Active Incidents & Fleet Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Active Incidents */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-semibold text-white">
              Active Incidents ({activeIncidents.length})
            </h3>
            <button
              onClick={onNavigateToIncidents}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View full list</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {activeIncidents.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {getTypeIcon(incident.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs sm:text-sm">
                        {incident.id} &bull; {incident.location}
                      </span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                        incident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {incident.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs">
                  <span className="text-slate-300 font-medium block">
                    {incident.assignedTeam}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {incident.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Response Teams Quick Status */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-semibold text-white">
                Response Fleet Quick Status
              </h3>
              <button
                onClick={onNavigateToTeams}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                All teams &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {teams.slice(0, 5).map((team) => (
                <div
                  key={team.id}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-slate-200">
                      {team.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {team.location}
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                    team.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : team.status === 'RESPONDING'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {team.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4">
            <button
              onClick={onNavigateToTeams}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              Open Fleet Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
