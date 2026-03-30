import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [
    {
      id: 'n1',
      type: 'info',
      title: 'Payment Reminder',
      message: 'Your mortgage payment of $2,015.44 is due on April 1, 2026.',
      timestamp: new Date('2026-03-25'),
      read: false
    },
    {
      id: 'n2',
      type: 'success',
      title: 'Application Update',
      message: 'Your education loan application has been approved.',
      timestamp: new Date('2026-03-10'),
      read: true
    },
    {
      id: 'n3',
      type: 'warning',
      title: 'Document Required',
      message: 'Please upload your latest payslip for your business loan application.',
      timestamp: new Date('2026-03-20'),
      read: false
    },
    {
      id: 'n4',
      type: 'info',
      title: 'Rate Change Alert',
      message: 'Interest rates have been updated. Check the calculator for latest rates.',
      timestamp: new Date('2026-03-22'),
      read: false
    }
  ];

  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);
  notifications$ = this.notificationsSubject.asObservable();

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string): void {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(this.notifications);
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(this.notifications);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    this.notifications = [newNotification, ...this.notifications];
    this.notificationsSubject.next(this.notifications);
  }
}
