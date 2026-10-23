import React, { useState, useEffect } from 'react';
import {
  Settings,
  Moon,
  Volume2,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Check,
  Play,
  MonitorSmartphone,
} from 'lucide-react';
import { SystemSettings } from '../models/emergency.types';
import { settingsService } from '../services/settings.service';
import { soundService } from '../services/sound.service';

export const SettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(settingsService.getSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    return settingsService.subscribe((s) => setSettings(s));
  }, []);

  const handleToggle = (key: keyof SystemSettings) => {
    const next = !settings[key];
    settingsService.updateSettings({ [key]: next });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleReset = () => {
    settingsService.resetToDefaults();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            System Preferences
          </h2>
          <p className="text-xs text-slate-400">
            Frontend configurations saved locally in browser storage
          </p>
        </div>
        {savedNotice && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Options */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 divide-y divide-slate-800">
        {/* Dark Theme */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="text-sm font-medium text-white">Dark Dashboard Theme</h4>
              <p className="text-xs text-slate-400">Optimal contrast for emergency monitoring</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>

        {/* Compact Mode */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="text-sm font-medium text-white">Compact Mode</h4>
              <p className="text-xs text-slate-400">Tighter layout for small screens and laptops</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.compactMode}
            onChange={() => handleToggle('compactMode')}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>

        {/* Sound Notifications */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-slate-400" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-white">Sound Notifications</h4>
                <button
                  type="button"
                  onClick={() => soundService.playAlertCritical()}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" /> Test Sound
                </button>
              </div>
              <p className="text-xs text-slate-400">Web Audio synthesis alert chimes</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notificationSounds}
            onChange={() => handleToggle('notificationSounds')}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>

        {/* Auto Refresh */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="text-sm font-medium text-white">Live Data Simulation</h4>
              <p className="text-xs text-slate-400">Simulate incoming incident telemetry automatically</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoRefresh}
            onChange={() => handleToggle('autoRefresh')}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>

        {/* Animations */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="text-sm font-medium text-white">Visual Animations</h4>
              <p className="text-xs text-slate-400">Subtle indicator pulses and transitions</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.animationEffects}
            onChange={() => handleToggle('animationEffects')}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
};
