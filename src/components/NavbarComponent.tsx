import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Bell,
  LogOut,
  User,
  Clock,
  Menu,
  X,
  Volume2,
  VolumeX,
  Plus,
} from 'lucide-react';
import { Alert } from '../models/emergency.types';
import { soundService } from '../services/sound.service';
import { settingsService } from '../services/settings.service';

interface NavbarComponentProps {
  operatorName: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  alerts: Alert[];
  onDismissAlert: (id: string) => void;
  onMarkAllAlertsRead: () => void;
  onNavigateToAlerts: () => void;
  onSimulateIncident: () => void;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  operatorName,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
  alerts,
  onDismissAlert: _onDismissAlert,
  onMarkAllAlertsRead,
  onNavigateToAlerts,
  onSimulateIncident,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const unsub = settingsService.subscribe((settings) => {
      setSoundEnabled(settings.notificationSounds);
    });

    return () => {
      clearInterval(timer);
      unsub();
    };
  }, []);

  const unreadCount = alerts.filter((a) => a.status === 'unread').length;

  const toggleSound = () => {
    const next = !soundEnabled;
    settingsService.updateSettings({ notificationSounds: next });
    if (next) soundService.playBeep(880, 'sine', 0.08);
  };

  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Brand Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden"
          title="Toggle Navigation"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-semibold text-white tracking-tight">
                Emergency Response Command Center
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Real-Time Emergency Monitoring &amp; Dispatch
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Simple Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentTime}</span>
        </div>

        {/* Quick New Incident Simulation */}
        <button
          onClick={onSimulateIncident}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
          title="Simulate incoming emergency incident"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Incident</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Simple Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111827] border border-slate-800 rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAlertsRead}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 my-2">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-semibold ${
                        alert.type === 'CRITICAL' ? 'text-red-400' : alert.type === 'WARNING' ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        {alert.type} &bull; {alert.sector}
                      </span>
                      <span className="text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-slate-300">{alert.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigateToAlerts();
                }}
                className="w-full pt-2 text-center text-xs text-blue-400 hover:underline font-medium border-t border-slate-800 cursor-pointer"
              >
                View all alerts in Alert Center &rarr;
              </button>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-200 font-medium">{operatorName}</span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
