import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'description', label: 'My Loans', route: '/loan-status' },
    { icon: 'add_circle_outline', label: 'Apply for Loan', route: '/loan-application' },
    { icon: 'calculate', label: 'Loan Calculator', route: '/loan-calculator' },
    { icon: 'person', label: 'My Profile', route: '/profile' }
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
