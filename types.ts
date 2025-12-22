
export enum Role {
  SUPER_ADMIN = 'super_admin',
  SYS_ADMIN = 'sys_admin',
  NGO_ADMIN = 'ngo_admin',
  FIELD_OFFICER = 'field_officer',
  VSLA_OFFICER = 'vsla_officer',
  MEMBER = 'member',
  DONOR = 'donor'
}

export enum TransactionType {
  SHARE_PURCHASE = 'share_purchase',
  SAVINGS = 'savings',
  LOAN_ISSUE = 'loan_issue',
  LOAN_REPAYMENT_PRINCIPAL = 'loan_repayment_principal',
  LOAN_REPAYMENT_INTEREST = 'loan_repayment_interest',
  FINE = 'fine',
  WELFARE_CONTRIBUTION = 'welfare_contribution',
  REGISTRATION_FEE = 'registration_fee',
  DIVIDEND_PAYOUT = 'dividend_payout'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  EXCUSED = 'Excused'
}

export enum LoanStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  REPAID = 'Repaid',
  DEFAULTED = 'Defaulted'
}

export enum ExpenseStatus {
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum ProjectTransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum MemberStatus {
  ACTIVE = 'Active',
  DORMANT = 'Dormant',
  SUSPENDED = 'Suspended',
  EXITED = 'Exited'
}

export interface Tenant {
  id: string; 
  slug: string; 
  name: string;
  email: string;
  country: string;
  county: string;
  constituency: string;
  ward: string;
  smsConfig: {
    gateway: string;
    balance: number;
  };
}

export interface Meeting {
  id: string;
  vslaId: string;
  cycleId: string;
  date: string;
  location: string;
  isClosed: boolean;
  totalCollected: number;
  totalLent: number;
}

export interface Attendance {
  id: string;
  meetingId: string;
  memberId: string; 
  status: AttendanceStatus;
}

export interface Loan {
  id: string;
  memberId: string;
  vslaId: string;
  cycleId: string;
  meetingId: string;
  principalAmount: number;
  interestRate: number;
  durationMonths: number;
  remainingPrincipal: number;
  remainingInterest: number;
  totalPaidPrincipal: number;
  totalPaidInterest: number;
  status: LoanStatus;
  issuedDate: string;
}

export interface Expense {
  id: string;
  vslaId: string;
  cycleId: string;
  memberId: string; 
  amount: number;
  description: string;
  date: string;
  status: ExpenseStatus;
  approvedBy?: string; 
  updatedAt?: string;
}

export interface InvestmentProject {
  id: string;
  vslaId: string;
  name: string;
  description: string;
  capitalCost: number;
  startDate: string;
  isActive: boolean;
  category: 'Poultry' | 'Agribusiness' | 'Retail' | 'Service' | 'Other';
  targetRoi: number;
  fundingStatus: 'Fully Funded' | 'Seeking Funding' | 'In Progress';
}

export interface ProjectTransaction {
  id: string;
  projectId: string;
  type: ProjectTransactionType;
  amount: number;
  description: string;
  date: string;
}

export interface PartnershipProject {
  id: string;
  title: string;
  description: string;
  vslaId: string;
  tenantId: string; 
  budget: number;
  fundedAmount: number;
  status: 'Open' | 'Funded' | 'Completed';
  category: string;
  mAndEScore?: number;
}

export interface Vsla {
  id: string; 
  tenantId?: string;
  inviteCode: string; 
  name: string;
  country: string;
  county: string;
  constituency: string;
  ward: string;
  village: string;
  status: 'active' | 'suspended' | 'pending';
  hasInvestmentModule: boolean;
  registrationDate?: string;
}

export interface Member {
  id: string; 
  memberKyId: string; 
  tenantId: string;
  vslaId: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
  role: 'Chair' | 'Secretary' | 'Treasurer' | 'Loan Officer' | 'Member';
  gender?: Gender;
  status?: MemberStatus;
  joinDate?: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  vslaId: string;
  cycleId: string;
  memberId: string;
  meetingId?: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
  isSoftDeleted: boolean;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface AppState {
  tenants: Tenant[];
  currentTenantId: string;
  vslas: Vsla[];
  cycles: Cycle[];
  meetings: Meeting[];
  attendance: Attendance[];
  loans: Loan[];
  members: Member[];
  expenses: Expense[];
  investmentProjects: InvestmentProject[];
  projectTransactions: ProjectTransaction[];
  partnershipProjects: PartnershipProject[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  currentUser: {
    id: string;
    name: string;
    role: Role;
    memberId?: string;
    tenantId: string;
  } | null;
}

export interface Cycle {
  id: string;
  vslaId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  sharePrice: number;
  interestRate: number; 
}

export enum SmsTrigger {
  LOAN_REPAYMENT = 'loan_repayment',
  SAVINGS_REMINDER = 'savings_reminder',
  MEETING_NOTIFICATION = 'meeting_notification',
  BIRTHDAY_WISH = 'birthday_wish'
}

export interface SmsTemplate {
  id: string;
  trigger: SmsTrigger;
  content: string;
  updatedAt: string;
}

export interface SmsLog {
  id: string;
  recipientPhone: string;
  message: string;
  trigger: SmsTrigger;
  status: 'delivered' | 'failed' | 'pending';
  timestamp: string;
  cost: number;
}
