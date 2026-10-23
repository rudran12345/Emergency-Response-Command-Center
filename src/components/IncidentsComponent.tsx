import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Flame,
  Ambulance,
  Shield,
  Car,
  Waves,
  Eye,
} from 'lucide-react';
import { Incident, EmergencyType, SeverityLevel, IncidentStatus, ResponseTeam } from '../models/emergency.types';

interface IncidentsComponentProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  onSelectIncident: (incident: Incident) => void;
  onAddNewIncident: () => void;
}

export const IncidentsComponent: React.FC<IncidentsComponentProps> = ({
  incidents,
  teams: _teams,
  onSelectIncident,
  onAddNewIncident,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'time' | 'severity' | 'id'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const matchesSearch =
          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'ALL' || inc.type.toUpperCase() === typeFilter;
        const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
        const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

        return matchesSearch && matchesType && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'time') comp = a.time.localeCompare(b.time);
        else if (sortBy === 'severity') {
          const weights: Record<SeverityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          comp = weights[a.severity] - weights[b.severity];
        } else if (sortBy === 'id') comp = a.id.localeCompare(b.id);
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [incidents, searchTerm, typeFilter, severityFilter, statusFilter, sortBy, sortOrder]);

  const getTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'Fire': return <Flame className="w-4 h-4 text-red-400" />;
      case 'Medical': return <Ambulance className="w-4 h-4 text-emerald-400" />;
      case 'Accident': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Flood': return <Waves className="w-4 h-4 text-blue-400" />;
      case 'Police':
      case 'Crime':
      default: return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Medium': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Low':
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Active': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Responding': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Resolved':
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              Incident Management
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredIncidents.length} of {incidents.length} total logged incidents
            </p>
          </div>

          <button
            onClick={onAddNewIncident}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Incident</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incidents..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="FIRE">Fire</option>
            <option value="MEDICAL">Medical</option>
            <option value="ACCIDENT">Accident</option>
            <option value="POLICE">Police</option>
            <option value="CRIME">Crime</option>
            <option value="FLOOD">Flood</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Responding">Responding</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    {incident.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      {getTypeIcon(incident.type)}
                      {incident.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {incident.location}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {incident.time}
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-medium">
                    {incident.assignedTeam}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(incident);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
