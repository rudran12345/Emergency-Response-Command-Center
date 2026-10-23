import React, { useState } from 'react';
import {
  Flame,
  Ambulance,
  Shield,
  Car,
  Waves,
  ZoomIn,
  ZoomOut,
  MapPin,
  Filter,
} from 'lucide-react';
import { Incident, EmergencyType } from '../models/emergency.types';

interface IncidentMapComponentProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const IncidentMapComponent: React.FC<IncidentMapComponentProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedTypeFilter === 'ALL') return true;
    return inc.type.toUpperCase() === selectedTypeFilter;
  });

  const getMarkerIcon = (type: EmergencyType) => {
    switch (type) {
      case 'Fire':
        return <Flame className="w-4 h-4 text-white" />;
      case 'Medical':
        return <Ambulance className="w-4 h-4 text-white" />;
      case 'Accident':
        return <Car className="w-4 h-4 text-white" />;
      case 'Flood':
        return <Waves className="w-4 h-4 text-white" />;
      case 'Police':
      case 'Crime':
      default:
        return <Shield className="w-4 h-4 text-white" />;
    }
  };

  const getMarkerBg = (incident: Incident) => {
    if (incident.status === 'Resolved') return 'bg-emerald-500';
    switch (incident.severity) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-amber-500';
      case 'Medium':
      case 'Low':
      default:
        return 'bg-blue-500';
    }
  };

  const cityDistricts = [
    { name: 'Anna Nagar (Sector 4)', x: 28, y: 28 },
    { name: 'Central Zone', x: 55, y: 20 },
    { name: 'Koyambedu', x: 18, y: 52 },
    { name: 'T Nagar', x: 50, y: 46 },
    { name: 'Guindy', x: 42, y: 68 },
    { name: 'Adyar (Sector 2)', x: 74, y: 68 },
    { name: 'Velachery', x: 62, y: 84 },
    { name: 'Marina Beach', x: 86, y: 36 },
  ];

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Controls */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-white">
            City Incident Map
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {filteredIncidents.length} active points
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL">All Emergencies</option>
              <option value="FIRE">Fire</option>
              <option value="MEDICAL">Medical</option>
              <option value="POLICE">Police</option>
              <option value="ACCIDENT">Accident</option>
              <option value="FLOOD">Flood</option>
            </select>
          </div>

          {/* Zoom */}
          <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden text-xs text-slate-300">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.85, prev - 0.15))}
              className="p-1.5 hover:bg-slate-700"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px]">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(1.3, prev + 0.15))}
              className="p-1.5 hover:bg-slate-700"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-[#0c1222] overflow-hidden select-none">
        <div
          className="absolute inset-0 transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Simple Vector City Map */}
          <svg className="w-full h-full absolute inset-0 opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="simpleGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#simpleGrid)" />

            {/* Coastal Waters */}
            <path
              d="M 850 0 Q 820 250 860 400 T 890 600 L 1000 600 L 1000 0 Z"
              fill="rgba(56, 189, 248, 0.15)"
            />

            {/* River */}
            <path
              d="M 0 320 Q 200 350 400 330 T 700 380 Q 800 390 860 400"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeOpacity="0.4"
            />

            {/* Major Arterial Roads */}
            <path
              d="M 300 0 L 350 200 L 400 350 L 430 600"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2.5"
            />
            <path
              d="M 50 180 Q 300 220 550 200 T 900 160"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2.5"
            />
          </svg>

          {/* District Labels */}
          {cityDistricts.map((d, idx) => (
            <div
              key={idx}
              className="absolute pointer-events-none text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800"
              style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {d.name}
            </div>
          ))}

          {/* Interactive Incident Markers */}
          {filteredIncidents.map((incident) => {
            const bg = getMarkerBg(incident);

            return (
              <div
                key={incident.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
                style={{ left: `${incident.coordinates.x}%`, top: `${incident.coordinates.y}%` }}
                onClick={() => onSelectIncident(incident)}
                onMouseEnter={() => setHoveredIncident(incident)}
                onMouseLeave={() => setHoveredIncident(null)}
              >
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center border-2 border-white shadow-md`}>
                  {getMarkerIcon(incident.type)}
                </div>
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-semibold text-slate-200 border border-slate-800 shadow">
                  {incident.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredIncident && (
          <div className="absolute top-3 left-3 z-30 p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-w-xs pointer-events-none">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-white">
                {hoveredIncident.id} &bull; {hoveredIncident.type}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                hoveredIncident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {hoveredIncident.severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2">{hoveredIncident.description}</p>
            <div className="mt-1 text-[11px] text-blue-400 font-medium">Click to view details &amp; dispatch</div>
          </div>
        )}

        {/* Clean Legend */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs shadow-lg">
          <div className="font-semibold text-slate-300 text-[11px] mb-1.5">Severity Legend</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Red = Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Amber = Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Cyan = Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Green = Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
