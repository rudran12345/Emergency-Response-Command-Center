import React, { useState } from 'react';
import {
  Shield,
  Flame,
  Ambulance,
  MapPin,
  Clock,
  Search,
  Check,
} from 'lucide-react';
import { ResponseTeam, TeamType, TeamStatus } from '../models/emergency.types';

interface ResponseTeamsComponentProps {
  teams: ResponseTeam[];
  onUpdateTeamStatus: (teamId: string, status: TeamStatus, assignment?: string) => void;
}

export const ResponseTeamsComponent: React.FC<ResponseTeamsComponentProps> = ({
  teams,
  onUpdateTeamStatus,
}) => {
  const [activeCategory, setActiveCategory] = useState<TeamType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningTeam, setAssigningTeam] = useState<ResponseTeam | null>(null);
  const [taskInput, setTaskInput] = useState('');

  const filteredTeams = teams.filter((team) => {
    const matchesCat = activeCategory === 'ALL' || team.type === activeCategory;
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const policeCount = teams.filter((t) => t.type === 'POLICE').length;
  const fireCount = teams.filter((t) => t.type === 'FIRE & RESCUE').length;
  const ambulanceCount = teams.filter((t) => t.type === 'AMBULANCE').length;

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'DISPATCHED':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'RESPONDING':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'BUSY':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'OFFLINE':
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const getCategoryIcon = (type: TeamType) => {
    switch (type) {
      case 'POLICE': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'FIRE & RESCUE': return <Flame className="w-4 h-4 text-red-400" />;
      case 'AMBULANCE':
      default: return <Ambulance className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Category Tabs */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              Response Team Fleet Monitoring
            </h2>
            <p className="text-xs text-slate-400">
              26 Active First Responder Units &bull; Police, Fire &amp; Rescue, Ambulances
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Units ({teams.length})
          </button>
          <button
            onClick={() => setActiveCategory('POLICE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'POLICE'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Police ({policeCount})
          </button>
          <button
            onClick={() => setActiveCategory('FIRE & RESCUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'FIRE & RESCUE'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Fire &amp; Rescue ({fireCount})
          </button>
          <button
            onClick={() => setActiveCategory('AMBULANCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'AMBULANCE'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            Ambulance ({ambulanceCount})
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                    {getCategoryIcon(team.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {team.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {team.id} &bull; {team.personnelCount} crew
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${getStatusBadge(team.status)}`}>
                  {team.status}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Base: <strong className="text-white">{team.location}</strong></span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="truncate">Task: <strong className="text-slate-200">{team.currentAssignment}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2.5 border-t border-slate-800/80 flex gap-2 text-xs">
              <button
                onClick={() => {
                  setAssigningTeam(team);
                  setTaskInput(team.currentAssignment);
                }}
                className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer text-center"
              >
                Assign
              </button>
              <button
                onClick={() => onUpdateTeamStatus(team.id, 'AVAILABLE')}
                disabled={team.status === 'AVAILABLE'}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 disabled:opacity-40 font-medium transition cursor-pointer"
              >
                Available
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Assignment Modal */}
      {assigningTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-white">
              Dispatch / Assign: {assigningTeam.name}
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Mission Description / Task
              </label>
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="e.g. Patrol Sector 4 or Respond to Fire backup"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Set Status
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['AVAILABLE', 'DISPATCHED', 'RESPONDING', 'BUSY', 'OFFLINE'] as TeamStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateTeamStatus(assigningTeam.id, st, taskInput || undefined);
                      setAssigningTeam(null);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setAssigningTeam(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (taskInput) {
                    onUpdateTeamStatus(assigningTeam.id, 'DISPATCHED', taskInput);
                  }
                  setAssigningTeam(null);
                }}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
