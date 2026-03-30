import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LoanService } from '../../shared/services/loan.service';
import { AuthService } from '../../shared/services/auth.service';
import { Loan, LoanStatus, DashboardStats } from '../../shared/models/loan.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats | null = null;
  loans: Loan[] = [];
  recentLoans: Loan[] = [];
  isLoading = true;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    forkJoin([
      this.loanService.getDashboardStats(),
      this.loanService.getLoans()
    ]).subscribe({
      next: ([stats, loans]) => {
        this.stats = stats;
        this.loans = loans;
        this.recentLoans = loans.slice(0, 4);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE:
      case LoanStatus.APPROVED:
      case LoanStatus.DISBURSED:
        return 'badge-success';
      case LoanStatus.UNDER_REVIEW:
      case LoanStatus.SUBMITTED:
        return 'badge-warning';
      case LoanStatus.REJECTED:
        return 'badge-danger';
      case LoanStatus.DRAFT:
        return 'badge-neutral';
      case LoanStatus.CLOSED:
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  }

  getProgressPercent(loan: Loan): number {
    if (loan.amount === 0) return 0;
    return Math.round((loan.totalPaid / loan.amount) * 100);
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
