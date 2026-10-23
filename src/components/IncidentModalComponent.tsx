import React, { useState } from 'react';
import {
  X,
  Flame,
  Ambulance,
  Shield,
  Car,
  Waves,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { Incident, ResponseTeam, IncidentStatus, EmergencyType } from '../models/emergency.types';

interface IncidentModalComponentProps {
  incident: Incident | null;
  teams: ResponseTeam[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onAssignTeam: (incidentId: string, teamName: string) => void;
}

export const IncidentModalComponent: React.FC<IncidentModalComponentProps> = ({
  incident,
  teams,
  onClose,
  onUpdateStatus,
  onAssignTeam,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  if (!incident) return null;

  const getTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'Fire': return <Flame className="w-5 h-5 text-red-400" />;
      case 'Medical': return <Ambulance className="w-5 h-5 text-emerald-400" />;
      case 'Accident': return <Car className="w-5 h-5 text-amber-400" />;
      case 'Flood': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Police':
      case 'Crime':
      default: return <Shield className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityBadge = () => {
    switch (incident.severity) {
      case 'Critical': return 'bg-red-500/15 text-red-400 border border-red-500/30';
      case 'High': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Medium': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Low':
      default: return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    }
  };

  const handleDispatch = () => {
    if (selectedTeam) {
      onAssignTeam(incident.id, selectedTeam);
      setSelectedTeam('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              {getTypeIcon(incident.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {incident.id}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getSeverityBadge()}`}>
                  {incident.severity}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {incident.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {incident.type} Emergency &bull; Reported in {incident.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" /> Location
              </span>
              <span className="text-xs font-semibold text-white mt-1 block">
                {incident.location}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" /> Logged
              </span>
              <span className="text-xs font-semibold text-white mt-1 block">
                {incident.time}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" /> Casualties
              </span>
              <span className="text-xs font-semibold text-white mt-1 block">
                {incident.casualties || 'None'}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-blue-400" /> Priority
              </span>
              <span className="text-xs font-semibold text-blue-400 mt-1 block">
                {incident.priorityScore} / 100
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Field Report
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {incident.description}
            </p>
            {incident.reportedBy && (
              <div className="mt-2 text-[11px] text-slate-400">
                Source: {incident.reportedBy}
              </div>
            )}
          </div>

          {/* Team Assignment */}
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Response Team:</span>
              <span className="text-white font-semibold">
                {incident.assignedTeam || 'Unassigned'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="flex-1 py-1.5 px-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="">-- Choose team to re-assign --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.status}) - {t.location}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDispatch}
                disabled={!selectedTeam}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                Dispatch
              </button>
            </div>
          </div>

          {/* Status Buttons */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">
              Change Status
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['Active', 'Responding', 'Resolved'] as IncidentStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(incident.id, st)}
                  className={`py-2 px-3 rounded-lg border font-medium transition cursor-pointer ${
                    incident.status === st
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
