import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  Loan, LoanType, LoanStatus, LoanApplication,
  LoanCalculation, AmortizationEntry, DashboardStats
} from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private loans: Loan[] = [
    {
      id: 'LN-2024-001',
      type: LoanType.MORTGAGE,
      amount: 450000,
      term: 300,
      interestRate: 3.49,
      monthlyPayment: 2015.44,
      status: LoanStatus.ACTIVE,
      applicationDate: '2024-01-15',
      approvalDate: '2024-02-01',
      borrowerName: 'James Chen',
      purpose: 'Primary residence purchase',
      remainingBalance: 438250.00,
      nextPaymentDate: '2026-04-01',
      totalPaid: 48370.56
    },
    {
      id: 'LN-2024-002',
      type: LoanType.PERSONAL,
      amount: 25000,
      term: 48,
      interestRate: 5.9,
      monthlyPayment: 588.25,
      status: LoanStatus.ACTIVE,
      applicationDate: '2024-06-10',
      approvalDate: '2024-06-15',
      borrowerName: 'James Chen',
      purpose: 'Home renovation',
      remainingBalance: 15680.00,
      nextPaymentDate: '2026-04-10',
      totalPaid: 12348.00
    },
    {
      id: 'LN-2025-003',
      type: LoanType.AUTO,
      amount: 35000,
      term: 60,
      interestRate: 4.2,
      monthlyPayment: 648.12,
      status: LoanStatus.ACTIVE,
      applicationDate: '2025-03-20',
      approvalDate: '2025-03-25',
      borrowerName: 'James Chen',
      purpose: 'Vehicle purchase - BMW 3 Series',
      remainingBalance: 31250.00,
      nextPaymentDate: '2026-04-20',
      totalPaid: 7777.44
    },
    {
      id: 'LN-2026-004',
      type: LoanType.BUSINESS,
      amount: 100000,
      term: 84,
      interestRate: 6.5,
      monthlyPayment: 1537.83,
      status: LoanStatus.UNDER_REVIEW,
      applicationDate: '2026-03-15',
      borrowerName: 'James Chen',
      purpose: 'Business expansion - Tech startup',
      remainingBalance: 100000,
      nextPaymentDate: '-',
      totalPaid: 0
    },
    {
      id: 'LN-2026-005',
      type: LoanType.EDUCATION,
      amount: 50000,
      term: 120,
      interestRate: 3.1,
      monthlyPayment: 485.37,
      status: LoanStatus.APPROVED,
      applicationDate: '2026-02-28',
      approvalDate: '2026-03-10',
      borrowerName: 'James Chen',
      purpose: 'MBA Programme - London Business School',
      remainingBalance: 50000,
      nextPaymentDate: '2026-09-01',
      totalPaid: 0
    }
  ];

  private loansSubject = new BehaviorSubject<Loan[]>(this.loans);
  loans$ = this.loansSubject.asObservable();

  getLoans(): Observable<Loan[]> {
    return of(this.loans).pipe(delay(500));
  }

  getLoanById(id: string): Observable<Loan | undefined> {
    return of(this.loans.find(l => l.id === id)).pipe(delay(300));
  }

  getDashboardStats(): Observable<DashboardStats> {
    const activeLoans = this.loans.filter(l => l.status === LoanStatus.ACTIVE);
    const stats: DashboardStats = {
      totalLoans: this.loans.length,
      activeLoans: activeLoans.length,
      totalBorrowed: this.loans.reduce((sum, l) => sum + l.amount, 0),
      totalPaid: this.loans.reduce((sum, l) => sum + l.totalPaid, 0),
      nextPayment: 2015.44,
      nextPaymentDate: '2026-04-01',
      creditScore: 782,
      creditScoreChange: 12
    };
    return of(stats).pipe(delay(400));
  }

  submitApplication(application: LoanApplication): Observable<Loan> {
    const newLoan: Loan = {
      id: `LN-2026-${String(this.loans.length + 1).padStart(3, '0')}`,
      type: application.loanDetails.loanType,
      amount: application.loanDetails.amount,
      term: application.loanDetails.term,
      interestRate: this.getInterestRate(application.loanDetails.loanType),
      monthlyPayment: 0,
      status: LoanStatus.SUBMITTED,
      applicationDate: new Date().toISOString().split('T')[0],
      borrowerName: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
      purpose: application.loanDetails.purpose,
      remainingBalance: application.loanDetails.amount,
      nextPaymentDate: '-',
      totalPaid: 0
    };

    const calc = this.calculateLoan(newLoan.amount, newLoan.interestRate, newLoan.term);
    newLoan.monthlyPayment = calc.monthlyPayment;

    return of(newLoan).pipe(
      delay(1500),
      tap(() => {
        this.loans = [...this.loans, newLoan];
        this.loansSubject.next(this.loans);
      })
    );
  }

  calculateLoan(principal: number, annualRate: number, termMonths: number): LoanCalculation {
    const monthlyRate = annualRate / 100 / 12;
    let monthlyPayment: number;

    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))
        / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    const schedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.round(balance * 100) / 100
      });
    }

    return {
      principal,
      interestRate: annualRate,
      term: termMonths,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      amortizationSchedule: schedule
    };
  }

  private getInterestRate(type: LoanType): number {
    const rates: Record<string, number> = {
      [LoanType.PERSONAL]: 5.9,
      [LoanType.MORTGAGE]: 3.49,
      [LoanType.AUTO]: 4.2,
      [LoanType.BUSINESS]: 6.5,
      [LoanType.EDUCATION]: 3.1,
      [LoanType.HOME_EQUITY]: 4.8
    };
    return rates[type] || 5.0;
  }
}
