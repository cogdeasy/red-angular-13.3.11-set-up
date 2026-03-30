export interface Loan {
  id: string;
  type: LoanType;
  amount: number;
  term: number;
  interestRate: number;
  monthlyPayment: number;
  status: LoanStatus;
  applicationDate: string;
  approvalDate?: string;
  borrowerName: string;
  purpose: string;
  remainingBalance: number;
  nextPaymentDate: string;
  totalPaid: number;
}

export enum LoanType {
  PERSONAL = 'Personal Loan',
  MORTGAGE = 'Mortgage',
  AUTO = 'Auto Loan',
  BUSINESS = 'Business Loan',
  EDUCATION = 'Education Loan',
  HOME_EQUITY = 'Home Equity Loan'
}

export enum LoanStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  DISBURSED = 'Disbursed',
  ACTIVE = 'Active',
  CLOSED = 'Closed'
}

export interface LoanApplication {
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  loanDetails: LoanDetails;
  documents: DocumentInfo[];
}

export interface PersonalInfo {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  nationalId: string;
}

export interface EmploymentInfo {
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  yearsEmployed: number;
  monthlyIncome: number;
  additionalIncome: number;
  monthlyExpenses: number;
}

export interface LoanDetails {
  loanType: LoanType;
  amount: number;
  term: number;
  purpose: string;
  collateralType?: string;
  collateralValue?: number;
}

export interface DocumentInfo {
  name: string;
  type: string;
  uploaded: boolean;
  required: boolean;
}

export interface LoanCalculation {
  principal: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
  totalPaid: number;
  nextPayment: number;
  nextPaymentDate: string;
  creditScore: number;
  creditScoreChange: number;
}
