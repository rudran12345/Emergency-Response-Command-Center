export type AlertType = 'CRITICAL' | 'WARNING' | 'INFORMATION';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  time: string;
  status: 'unread' | 'read';
  sector: string;
}
