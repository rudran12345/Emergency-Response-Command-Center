import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert, AlertType } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private initialAlerts: Alert[] = [
    {
      id: 'ALT-901',
      type: 'CRITICAL',
      message: 'Fire emergency detected in Sector 04 - Anna Nagar commercial tower.',
      time: '19:21',
      status: 'unread',
      sector: 'Sector 04'
    },
    {
      id: 'ALT-902',
      type: 'WARNING',
      message: 'Multiple incidents reported in Central Zone - Emergency grid congested.',
      time: '19:26',
      status: 'unread',
      sector: 'Central Zone'
    },
    {
      id: 'ALT-903',
      type: 'INFORMATION',
      message: 'Ambulance Unit 08 is now available.',
      time: '19:30',
      status: 'unread',
      sector: 'Sector 09'
    }
  ];

  private alertsSubject = new BehaviorSubject<Alert[]>(this.initialAlerts);
  public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();

  public markAsRead(id: string): void {
    const updated = this.alertsSubject.value.map(a => a.id === id ? { ...a, status: 'read' as const } : a);
    this.alertsSubject.next(updated);
  }

  public dismiss(id: string): void {
    const updated = this.alertsSubject.value.filter(a => a.id !== id);
    this.alertsSubject.next(updated);
  }

  public addAlert(type: AlertType, message: string, sector: string): void {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAlert: Alert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      type,
      message,
      time: timeStr,
      status: 'unread',
      sector
    };
    this.alertsSubject.next([newAlert, ...this.alertsSubject.value]);
  }
}
