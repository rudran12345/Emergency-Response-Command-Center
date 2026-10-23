import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Flame,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react';
import { Alert, AlertType } from '../models/emergency.types';

interface AlertsComponentProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSimulateAlert: () => void;
}

export const AlertsComponent: React.FC<AlertsComponentProps> = ({
  alerts,
  onMarkAsRead,
  onDismiss,
  onMarkAllAsRead,
  onClearAll,
  onSimulateAlert,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === 'ALL') return true;
    return alert.type === filterType;
  });

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL': return <Flame className="w-4 h-4 text-red-400" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'INFORMATION':
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBadgeStyle = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'INFORMATION':
      default: return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Emergency Alert Center
            </h2>
            <p className="text-xs text-slate-400">
              {alerts.length} total broadcast notifications in log
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onSimulateAlert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Alert</span>
            </button>
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-medium transition cursor-pointer"
              title="Clear all alerts"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'INFORMATION'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                filterType === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
              alert.status === 'unread'
                ? 'bg-[#161f30] border-slate-700'
                : 'bg-[#111827] border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase ${getBadgeStyle(alert.type)}`}>
                    {alert.type}
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {alert.sector}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {alert.time}
                  </span>
                  {alert.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {alert.status === 'unread' && (
                <button
                  onClick={() => onMarkAsRead(alert.id)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Read
                </button>
              )}
              <button
                onClick={() => onDismiss(alert.id)}
                className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                title="Dismiss"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs bg-[#111827] border border-slate-800 rounded-xl">
            No alerts matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
