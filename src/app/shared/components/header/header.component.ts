import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: User | null = null;
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.notificationService.unreadCount;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleNotificationsPanel(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }
}
