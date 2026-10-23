import React from 'react';
import {
  Flame,
  Ambulance,
  Shield,
  Car,
  Waves,
  TrendingDown,
} from 'lucide-react';
import { Incident } from '../models/emergency.types';

interface AnalyticsComponentProps {
  incidents: Incident[];
}

export const AnalyticsComponent: React.FC<AnalyticsComponentProps> = ({ incidents }) => {
  const emergencyTypes = [
    { type: 'Fire', count: incidents.filter((i) => i.type === 'Fire').length, color: '#ef4444', icon: Flame },
    { type: 'Medical', count: incidents.filter((i) => i.type === 'Medical').length, color: '#10b981', icon: Ambulance },
    { type: 'Accident', count: incidents.filter((i) => i.type === 'Accident').length, color: '#f59e0b', icon: Car },
    { type: 'Police/Crime', count: incidents.filter((i) => i.type === 'Police' || i.type === 'Crime').length, color: '#3b82f6', icon: Shield },
    { type: 'Flood', count: incidents.filter((i) => i.type === 'Flood').length, color: '#06b6d4', icon: Waves },
  ];
  const totalByType = emergencyTypes.reduce((acc, curr) => acc + curr.count, 0) || 1;

  const areas = ['Anna Nagar', 'Guindy', 'Adyar', 'T Nagar', 'Velachery', 'Central Zone'];
  const areaData = areas.map((area) => ({
    name: area,
    count: incidents.filter((i) => i.location === area).length,
  }));
  const maxAreaCount = Math.max(...areaData.map((a) => a.count), 1);

  const activeCount = incidents.filter((i) => i.status === 'Active').length;
  const respondingCount = incidents.filter((i) => i.status === 'Responding').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white">
            Incident Performance Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry metrics and emergency distribution
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <TrendingDown className="w-4 h-4" />
          <span>Average response time: 04:32 min</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Types breakdown */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Emergency Types Distribution
          </h3>
          <div className="space-y-3 pt-2">
            {emergencyTypes.map((item) => {
              const pct = Math.round((item.count / totalByType) * 100);
              const Icon = item.icon;

              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-200 font-medium">
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                      {item.type}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-white">{item.count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Incidents by Area */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Incidents by City Area
          </h3>
          <div className="space-y-3 pt-2">
            {areaData.map((area) => {
              const widthPct = Math.round((area.count / maxAreaCount) * 100);

              return (
                <div key={area.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{area.name}</span>
                    <span className="text-blue-400 font-semibold">{area.count} Incidents</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(widthPct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Status Funnel */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Current Incident Status
          </h3>
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{activeCount}</div>
              <div className="text-xs text-slate-300 mt-1">Active</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{respondingCount}</div>
              <div className="text-xs text-slate-300 mt-1">Responding</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
              <div className="text-xs text-slate-300 mt-1">Resolved</div>
            </div>
          </div>
        </div>

        {/* 4. Response Time History */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Response Time Trend (Target: &lt; 5 min)
          </h3>
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">08:00</span>
              <span className="text-sm font-bold text-white">5m 12s</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">12:00</span>
              <span className="text-sm font-bold text-white">4m 45s</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">16:00</span>
              <span className="text-sm font-bold text-white">4m 50s</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">20:00</span>
              <span className="text-sm font-bold text-emerald-400">4m 32s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
