import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppSettings {
  darkMode: boolean;
  compactMode: boolean;
  notificationSounds: boolean;
  autoRefresh: boolean;
  animationEffects: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultSettings: AppSettings = {
    darkMode: true,
    compactMode: false,
    notificationSounds: true,
    autoRefresh: true,
    animationEffects: true
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings());
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable();

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem('ercc_ng_settings');
      if (stored) return { ...this.defaultSettings, ...JSON.parse(stored) };
    } catch {
      // fallback
    }
    return { ...this.defaultSettings };
  }

  public update(patch: Partial<AppSettings>): void {
    const updated = { ...this.settingsSubject.value, ...patch };
    this.settingsSubject.next(updated);
    try {
      localStorage.setItem('ercc_ng_settings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public reset(): void {
    this.settingsSubject.next({ ...this.defaultSettings });
    try {
      localStorage.setItem('ercc_ng_settings', JSON.stringify(this.defaultSettings));
    } catch {
      // ignore
    }
  }
}
