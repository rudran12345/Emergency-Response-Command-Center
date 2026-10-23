import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { EmergencyType, SeverityLevel, ResponseTeam } from '../models/emergency.types';

interface LogIncidentModalProps {
  teams: ResponseTeam[];
  onClose: () => void;
  onSubmit: (data: {
    type: EmergencyType;
    location: string;
    severity: SeverityLevel;
    assignedTeam: string;
    status: 'Active';
    coordinates: { x: number; y: number };
    description: string;
    reportedBy: string;
    casualties: number;
    priorityScore: number;
  }) => void;
}

export const LogIncidentModal: React.FC<LogIncidentModalProps> = ({
  teams,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<EmergencyType>('Fire');
  const [location, setLocation] = useState('Anna Nagar');
  const [severity, setSeverity] = useState<SeverityLevel>('Critical');
  const [description, setDescription] = useState('');
  const [casualties, setCasualties] = useState(0);
  const [reportedBy, setReportedBy] = useState('Citizen Emergency Hotline');
  const [assignedTeam, setAssignedTeam] = useState('');

  const districtCoords: Record<string, { x: number; y: number }> = {
    'Anna Nagar': { x: 30, y: 30 },
    'Guindy': { x: 42, y: 68 },
    'Adyar': { x: 74, y: 70 },
    'T Nagar': { x: 52, y: 46 },
    'Velachery': { x: 62, y: 84 },
    'Central Zone': { x: 55, y: 22 },
    'Marina Beach': { x: 86, y: 38 },
    'Koyambedu': { x: 20, y: 50 },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseCoords = districtCoords[location] || { x: 50, y: 50 };
    const coords = {
      x: Math.min(92, Math.max(8, baseCoords.x + (Math.random() * 6 - 3))),
      y: Math.min(92, Math.max(8, baseCoords.y + (Math.random() * 6 - 3))),
    };

    const teamToAssign = assignedTeam || (teams.find((t) => t.status === 'AVAILABLE')?.name || 'Fire Unit 04');

    onSubmit({
      type,
      location,
      severity,
      assignedTeam: teamToAssign,
      status: 'Active',
      coordinates: coords,
      description: description || `Reported ${type.toLowerCase()} emergency in ${location}.`,
      reportedBy,
      casualties: Number(casualties) || 0,
      priorityScore: severity === 'Critical' ? 95 : severity === 'High' ? 80 : 60,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Log New Emergency Incident
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs">
          {/* Type */}
          <div>
            <label className="text-slate-400 block mb-1">
              Emergency Type:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Fire', 'Medical', 'Accident', 'Police', 'Flood', 'Crime'] as EmergencyType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-1.5 px-2 rounded-lg border font-medium cursor-pointer ${
                    type === t
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">
                District / Location:
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
              >
                <option value="Anna Nagar">Anna Nagar</option>
                <option value="Guindy">Guindy</option>
                <option value="Adyar">Adyar</option>
                <option value="T Nagar">T Nagar</option>
                <option value="Velachery">Velachery</option>
                <option value="Central Zone">Central Zone</option>
                <option value="Marina Beach">Marina Beach</option>
                <option value="Koyambedu">Koyambedu</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Severity Level:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-400 block mb-1">
              Field Description:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe situation, location specifics, hazard details..."
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Team & Casualties */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">
                Assign Unit:
              </label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
              >
                <option value="">Auto-Assign Closest</option>
                {teams.slice(0, 8).map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Casualties:
              </label>
              <input
                type="number"
                min="0"
                value={casualties}
                onChange={(e) => setCasualties(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
            >
              Submit &amp; Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
