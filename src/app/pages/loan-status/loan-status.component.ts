import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../shared/services/loan.service';
import { Loan, LoanStatus, LoanType } from '../../shared/models/loan.model';

@Component({
  selector: 'app-loan-status',
  templateUrl: './loan-status.component.html',
  styleUrls: ['./loan-status.component.scss']
})
export class LoanStatusComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  isLoading = true;
  selectedLoan: Loan | null = null;
  filterStatus = 'all';
  searchQuery = '';

  statusFilters = [
    { value: 'all', label: 'All Loans' },
    { value: LoanStatus.ACTIVE, label: 'Active' },
    { value: LoanStatus.APPROVED, label: 'Approved' },
    { value: LoanStatus.UNDER_REVIEW, label: 'Under Review' },
    { value: LoanStatus.SUBMITTED, label: 'Submitted' },
    { value: LoanStatus.CLOSED, label: 'Closed' }
  ];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;
    this.loanService.getLoans().subscribe(loans => {
      this.loans = loans;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    let result = [...this.loans];

    if (this.filterStatus !== 'all') {
      result = result.filter(l => l.status === this.filterStatus);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(l =>
        l.id.toLowerCase().includes(query) ||
        l.type.toLowerCase().includes(query) ||
        l.purpose.toLowerCase().includes(query)
      );
    }

    this.filteredLoans = result;
  }

  selectLoan(loan: Loan): void {
    this.selectedLoan = this.selectedLoan?.id === loan.id ? null : loan;
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

  getStatusIcon(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE: return 'check_circle';
      case LoanStatus.APPROVED: return 'thumb_up';
      case LoanStatus.UNDER_REVIEW: return 'hourglass_top';
      case LoanStatus.SUBMITTED: return 'send';
      case LoanStatus.REJECTED: return 'cancel';
      case LoanStatus.DISBURSED: return 'account_balance_wallet';
      case LoanStatus.CLOSED: return 'lock';
      default: return 'description';
    }
  }

  getProgressPercent(loan: Loan): number {
    if (loan.amount === 0) return 0;
    return Math.round((loan.totalPaid / loan.amount) * 100);
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getTimelineSteps(loan: Loan): { label: string; date: string; completed: boolean; active: boolean }[] {
    const steps = [
      { label: 'Application Submitted', date: loan.applicationDate, completed: true, active: false },
      { label: 'Under Review', date: '', completed: false, active: false },
      { label: 'Decision', date: loan.approvalDate || '', completed: false, active: false },
      { label: 'Funds Disbursed', date: '', completed: false, active: false }
    ];

    switch (loan.status) {
      case LoanStatus.SUBMITTED:
        steps[1].active = true;
        break;
      case LoanStatus.UNDER_REVIEW:
        steps[1].completed = true;
        steps[2].active = true;
        break;
      case LoanStatus.APPROVED:
        steps[1].completed = true;
        steps[2].completed = true;
        steps[3].active = true;
        break;
      case LoanStatus.ACTIVE:
      case LoanStatus.DISBURSED:
        steps[1].completed = true;
        steps[2].completed = true;
        steps[3].completed = true;
        break;
      case LoanStatus.REJECTED:
        steps[1].completed = true;
        steps[2].completed = true;
        steps[2].label = 'Rejected';
        break;
    }

    return steps;
  }
}
