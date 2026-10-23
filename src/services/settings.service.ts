import { SystemSettings } from '../models/emergency.types';
import { soundService } from './sound.service';

const DEFAULT_SETTINGS: SystemSettings = {
  darkMode: true,
  compactMode: false,
  notificationSounds: true,
  autoRefresh: true,
  animationEffects: true,
  refreshIntervalSeconds: 5,
};

class SettingsService {
  private settings: SystemSettings;
  private listeners: ((settings: SystemSettings) => void)[] = [];

  constructor() {
    this.settings = this.loadSettings();
    soundService.setSoundEnabled(this.settings.notificationSounds);
  }

  private loadSettings(): SystemSettings {
    try {
      const data = localStorage.getItem('ercc_settings');
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_SETTINGS };
  }

  public getSettings(): SystemSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...partial };
    try {
      localStorage.setItem('ercc_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    soundService.setSoundEnabled(this.settings.notificationSounds);
    this.notify();
  }

  public resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.setItem('ercc_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    soundService.setSoundEnabled(this.settings.notificationSounds);
    this.notify();
  }

  public subscribe(listener: (settings: SystemSettings) => void): () => void {
    this.listeners.push(listener);
    listener(this.settings);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.settings));
  }
}

export const settingsService = new SettingsService();
