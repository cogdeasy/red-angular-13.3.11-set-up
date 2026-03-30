import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../shared/services/loan.service';
import { LoanType, LoanCalculation } from '../../shared/models/loan.model';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorComponent implements OnInit {
  loanTypes = Object.values(LoanType);
  selectedType: LoanType = LoanType.PERSONAL;
  amount = 50000;
  term = 60;
  customRate: number | null = null;
  calculation: LoanCalculation | null = null;
  showAmortization = false;
  displayedSchedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  amortizationPage = 0;
  pageSize = 12;

  rateMap: Record<string, number> = {
    [LoanType.PERSONAL]: 5.9,
    [LoanType.MORTGAGE]: 3.49,
    [LoanType.AUTO]: 4.2,
    [LoanType.BUSINESS]: 6.5,
    [LoanType.EDUCATION]: 3.1,
    [LoanType.HOME_EQUITY]: 4.8
  };

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.calculate();
  }

  get interestRate(): number {
    return this.customRate ?? this.rateMap[this.selectedType] ?? 5.0;
  }

  onTypeChange(): void {
    this.customRate = null;
    this.calculate();
  }

  calculate(): void {
    if (this.amount > 0 && this.term > 0 && this.interestRate >= 0) {
      this.calculation = this.loanService.calculateLoan(this.amount, this.interestRate, this.term);
      this.amortizationPage = 0;
      this.updateDisplayedSchedule();
    }
  }

  updateDisplayedSchedule(): void {
    if (!this.calculation) return;
    const start = this.amortizationPage * this.pageSize;
    this.displayedSchedule = this.calculation.amortizationSchedule.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    if (!this.calculation) return 0;
    return Math.ceil(this.calculation.amortizationSchedule.length / this.pageSize);
  }

  nextPage(): void {
    if (this.amortizationPage < this.totalPages - 1) {
      this.amortizationPage++;
      this.updateDisplayedSchedule();
    }
  }

  prevPage(): void {
    if (this.amortizationPage > 0) {
      this.amortizationPage--;
      this.updateDisplayedSchedule();
    }
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getInterestPercentage(): number {
    if (!this.calculation || this.calculation.totalPayment === 0) return 0;
    return Math.round((this.calculation.totalInterest / this.calculation.totalPayment) * 100);
  }

  getPrincipalPercentage(): number {
    if (!this.calculation || this.calculation.totalPayment === 0) return 0;
    return 100 - this.getInterestPercentage();
  }
}
