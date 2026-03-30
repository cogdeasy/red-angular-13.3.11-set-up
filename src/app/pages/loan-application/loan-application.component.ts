import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../shared/services/loan.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoanType, LoanApplication } from '../../shared/models/loan.model';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss']
})
export class LoanApplicationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  isSubmitted = false;
  submittedLoanId = '';
  termsAccepted = false;

  personalInfoForm!: FormGroup;
  employmentForm!: FormGroup;
  loanDetailsForm!: FormGroup;

  loanTypes = Object.values(LoanType);
  titles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
  employmentStatuses = ['Full-time Employed', 'Part-time Employed', 'Self-employed', 'Contractor', 'Retired', 'Student'];
  countries = ['United Kingdom', 'United States', 'Hong Kong', 'Singapore', 'Australia', 'Canada', 'India', 'China'];

  steps = [
    { number: 1, label: 'Personal Details' },
    { number: 2, label: 'Employment' },
    { number: 3, label: 'Loan Details' },
    { number: 4, label: 'Review & Submit' }
  ];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.personalInfoForm = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,15}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required],
      nationalId: ['', Validators.required]
    });

    this.employmentForm = this.fb.group({
      employmentStatus: ['', Validators.required],
      employerName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      yearsEmployed: [null, [Validators.required, Validators.min(0)]],
      monthlyIncome: [null, [Validators.required, Validators.min(1)]],
      additionalIncome: [0],
      monthlyExpenses: [null, [Validators.required, Validators.min(0)]]
    });

    this.loanDetailsForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1000), Validators.max(5000000)]],
      term: [null, [Validators.required, Validators.min(6), Validators.max(360)]],
      purpose: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get currentForm(): FormGroup {
    switch (this.currentStep) {
      case 1: return this.personalInfoForm;
      case 2: return this.employmentForm;
      case 3: return this.loanDetailsForm;
      default: return this.personalInfoForm;
    }
  }

  nextStep(): void {
    if (this.currentStep < 4 && this.currentForm.valid) {
      this.currentStep++;
    } else if (this.currentStep < 4) {
      this.currentForm.markAllAsTouched();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  isStepComplete(step: number): boolean {
    switch (step) {
      case 1: return this.personalInfoForm.valid;
      case 2: return this.employmentForm.valid;
      case 3: return this.loanDetailsForm.valid;
      default: return false;
    }
  }

  getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;
    if (control.errors['pattern']) return 'Invalid format';
    return '';
  }

  getEstimatedMonthlyPayment(): number {
    const amount = this.loanDetailsForm.get('amount')?.value;
    const term = this.loanDetailsForm.get('term')?.value;
    const type = this.loanDetailsForm.get('loanType')?.value;

    if (!amount || !term || !type) return 0;

    const calc = this.loanService.calculateLoan(amount, this.getRate(type), term);
    return calc.monthlyPayment;
  }

  private getRate(type: LoanType): number {
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

  getLoanTypeIcon(type: string): string {
    switch (type) {
      case LoanType.PERSONAL: return 'person';
      case LoanType.MORTGAGE: return 'home';
      case LoanType.AUTO: return 'directions_car';
      case LoanType.BUSINESS: return 'business';
      case LoanType.EDUCATION: return 'school';
      case LoanType.HOME_EQUITY: return 'account_balance';
      default: return 'description';
    }
  }

  formatCurrency(value: number): string {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  submitApplication(): void {
    if (!this.personalInfoForm.valid || !this.employmentForm.valid || !this.loanDetailsForm.valid || !this.termsAccepted) {
      return;
    }

    this.isSubmitting = true;

    const application: LoanApplication = {
      personalInfo: this.personalInfoForm.value,
      employmentInfo: this.employmentForm.value,
      loanDetails: this.loanDetailsForm.value,
      documents: []
    };

    this.loanService.submitApplication(application).subscribe({
      next: (loan) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.submittedLoanId = loan.id;

        this.notificationService.addNotification({
          type: 'success',
          title: 'Application Submitted',
          message: `Your ${loan.type} application (${loan.id}) has been submitted successfully.`
        });
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToStatus(): void {
    this.router.navigate(['/loan-status']);
  }
}
