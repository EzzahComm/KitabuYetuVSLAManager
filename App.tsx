
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ICONS } from './constants';
import { AppState, Role, Transaction, TransactionType, AuditLog, ExpenseStatus, Gender, MemberStatus } from './types';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DonorDashboard from './pages/DonorDashboard';
import VslaManagement from './pages/VslaManagement';
import MemberManagement from './pages/MemberManagement';
import FinancialLedger from './pages/FinancialLedger';
import MeetingManagement from './pages/MeetingManagement';
import LoanManagement from './pages/LoanManagement';
import AuditCenter from './pages/AuditCenter';
import Login from './pages/Login';
import RegisterNgo from './pages/RegisterNgo';
import RegisterVsla from './pages/RegisterVsla';
import PartnershipMarketplace from './pages/PartnershipMarketplace';

const INITIAL_STATE: AppState = {
  tenants: [
    { id: 'KYN0001', slug: 'global-impact', name: 'Global Impact NGO', email: 'admin@globalimpact.org', country: 'Kenya', county: 'Nairobi', constituency: 'Westlands', ward: 'Parklands/Highridge', smsConfig: { gateway: 'AfricasTalking', balance: 500 } },
  ],
  currentTenantId: 'KYN0001',
  vslas: [
    { id: 'KYV001', tenantId: 'KYN0001', inviteCode: 'SUN-NAK-001', name: 'Sunshine Savings', village: 'Baraka', ward: 'North', county: 'Nakuru', constituency: 'Nakuru Town West', country: 'Kenya', status: 'active', hasInvestmentModule: true },
  ],
  cycles: [
    { id: 'c_1', vslaId: 'KYV001', name: 'Cycle 2024 - Alpha', startDate: '2024-01-01', endDate: '2024-12-31', isActive: true, sharePrice: 200, interestRate: 10 },
  ],
  meetings: [],
  attendance: [],
  loans: [],
  members: [
    { id: 'mem_1', memberKyId: 'KYM0001', tenantId: 'KYN0001', vslaId: 'KYV001', firstName: 'Alice', lastName: 'Wanjiru', phone: '0711111111', nationalId: '12345678', role: 'Treasurer', gender: Gender.FEMALE, status: MemberStatus.ACTIVE, joinDate: '2024-01-01' },
    { id: 'mem_2', memberKyId: 'KYM0002', tenantId: 'KYN0001', vslaId: 'KYV001', firstName: 'Bob', lastName: 'Ochieng', phone: '0722222222', nationalId: '87654321', role: 'Chair', gender: Gender.MALE, status: MemberStatus.ACTIVE, joinDate: '2024-01-01' },
  ],
  expenses: [],
  investmentProjects: [],
  projectTransactions: [],
  partnershipProjects: [],
  transactions: [],
  auditLogs: [],
  currentUser: null
};

export const generateKYID = (prefix: string, count: number, padding: number) => {
  return `${prefix}${(count + 1).toString().padStart(padding, '0')}`;
};

const Sidebar: React.FC<{ state: AppState; onLogout: () => void }> = ({ state, onLogout }) => {
  const location = useLocation();

  const menu = [
    { path: '/app', label: 'Insights & M&E', icon: <ICONS.Dashboard /> },
    { path: '/app/meetings', label: 'Meeting Sessions', icon: <ICONS.Reports /> },
    { path: '/app/loans', label: 'Loan Book', icon: <ICONS.Savings /> },
    { path: '/app/ledger', label: 'Financial Ledger', icon: <ICONS.Savings /> },
    { path: '/app/members', label: 'Member Registry', icon: <ICONS.Users /> },
    { path: '/app/vslas', label: 'Group Portfolio', icon: <ICONS.Group /> },
    { path: '/app/marketplace', label: 'Impact Market', icon: <ICONS.Search /> },
    { path: '/app/audit', label: 'Audit Trail', icon: <ICONS.Search /> },
  ];

  const filteredMenu = menu.filter(item => {
    if (state.currentUser?.role === Role.DONOR) {
      return ['/app', '/app/vslas', '/app/marketplace', '/app/audit'].includes(item.path);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed flex flex-col border-r border-slate-800 shadow-2xl z-30">
      <div className="p-8 border-b border-slate-800">
        <Link to="/" className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter">
          <span className="text-emerald-500 underline decoration-emerald-500/30">Kitabu</span> Yetu
        </Link>
        <div className="mt-6">
          <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-2 block">Organization</label>
          <div className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 truncate">
             {state.tenants.find(t => t.id === state.currentTenantId)?.name}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 overflow-y-auto no-scrollbar px-3 space-y-1">
        {filteredMenu.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
              location.pathname === item.path ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 translate-x-1' : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <span className={location.pathname === item.path ? 'text-white' : 'text-emerald-500/60'}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-900 flex items-center justify-center font-black text-sm shadow-inner ring-2 ring-emerald-500/20">
              {state.currentUser?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{state.currentUser?.name}</p>
              <p className="text-[9px] uppercase text-emerald-500 font-black tracking-tighter">{state.currentUser?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all group">
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('kitabu_v1_production');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('kitabu_v1_production', JSON.stringify(state));
  }, [state]);

  const logAudit = useCallback((action: string, details: string) => {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      tenantId: state.currentTenantId,
      userId: state.currentUser?.id || 'sys',
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setState(prev => ({ ...prev, auditLogs: [log, ...prev.auditLogs] }));
  }, [state.currentTenantId, state.currentUser?.id]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'tenantId' | 'isSoftDeleted'>) => {
    const newTx: Transaction = { 
      ...tx, 
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, 
      tenantId: state.currentTenantId, 
      isSoftDeleted: false 
    };
    setState(prev => ({ ...prev, transactions: [...prev.transactions, newTx] }));
  }, [state.currentTenantId]);

  const scopedData = useMemo(() => {
    const vslaIds = state.vslas.filter(v => v.tenantId === state.currentTenantId).map(v => v.id);
    const members = state.members.filter(m => m.tenantId === state.currentTenantId);
    const transactions = state.transactions.filter(t => t.tenantId === state.currentTenantId);
    const loans = state.loans.filter(l => vslaIds.includes(l.vslaId));
    const expenses = state.expenses.filter(e => vslaIds.includes(e.vslaId));
    const projects = state.investmentProjects.filter(p => vslaIds.includes(p.vslaId));
    const projectTx = state.projectTransactions.filter(pt => projects.some(p => p.id === pt.projectId));
    const partnershipProjects = state.partnershipProjects.filter(pp => pp.tenantId === state.currentTenantId);

    // Derived Financial Intelligence
    const totals = transactions.reduce((acc, t) => {
      if (t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE) acc.savings += t.amount;
      if (t.type === TransactionType.LOAN_REPAYMENT_PRINCIPAL) acc.repaidPrincipal += t.amount;
      if (t.type === TransactionType.LOAN_REPAYMENT_INTEREST) acc.earnedInterest += t.amount;
      if (t.type === TransactionType.FINE) acc.fines += t.amount;
      if (t.type === TransactionType.REGISTRATION_FEE) acc.fees += t.amount;
      if (t.type === TransactionType.WELFARE_CONTRIBUTION) acc.welfare += t.amount;
      if (t.type === TransactionType.LOAN_ISSUE) acc.disbursed += t.amount;
      if (t.type === TransactionType.DIVIDEND_PAYOUT) acc.dividends += t.amount;
      return acc;
    }, { savings: 0, disbursed: 0, repaidPrincipal: 0, earnedInterest: 0, fines: 0, fees: 0, welfare: 0, dividends: 0 });

    const totalApprovedExpenses = expenses
      .filter(e => e.status === ExpenseStatus.APPROVED)
      .reduce((acc, e) => acc + e.amount, 0);

    const outstandingLoanPrincipal = loans.reduce((acc, l) => acc + (l.status === 'Active' ? l.remainingPrincipal : 0), 0);

    const totalInflow = totals.savings + totals.repaidPrincipal + totals.earnedInterest + totals.fines + totals.fees + totals.welfare;
    const totalOutflow = totals.disbursed + totalApprovedExpenses + totals.dividends;
    const availableCash = Math.max(0, totalInflow - totalOutflow);

    return {
      vslas: state.vslas.filter(v => v.tenantId === state.currentTenantId),
      members,
      transactions,
      loans,
      expenses,
      projects,
      projectTx,
      partnershipProjects,
      meetings: state.meetings.filter(m => vslaIds.includes(m.vslaId)),
      attendance: state.attendance,
      auditLogs: state.auditLogs.filter(l => l.tenantId === state.currentTenantId),
      financials: { 
        ...totals, 
        outstandingLoanPrincipal, 
        totalExpenses: totalApprovedExpenses,
        availableCash
      }
    };
  }, [state, state.currentTenantId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login state={state} onLogin={(u, t) => { setState(p => ({...p, currentUser: u, currentTenantId: t})); logAudit('LOGIN', 'Production node access granted'); }} />} />
        <Route path="/register/ngo" element={<RegisterNgo state={state} onRegister={(t) => { setState(p => ({...p, tenants: [...p.tenants, t]})); logAudit('ORG_PROV', `Organization ${t.name} provisioned`); }} />} />
        <Route path="/register/vsla" element={<RegisterVsla state={state} onRegister={(v) => { setState(p => ({...p, vslas: [...p.vslas, v]})); logAudit('VSLA_REG', `New association provisioned: ${v.name}`); }} />} />
        <Route path="/app/*" element={
          !state.currentUser ? <Navigate to="/login" /> : (
            <div className="min-h-screen flex bg-slate-50">
              <Sidebar state={state} onLogout={() => setState(p => ({...p, currentUser: null}))} />
              <div className="flex-1 ml-64 flex flex-col">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
                   <div className="flex items-center gap-3">
                     <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Runtime ID:</span>
                     <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-emerald-500/20 tracking-tighter">Instance Active</span>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Liquidity</p>
                         <p className="text-sm font-black text-slate-900 tracking-tight">KES {scopedData.financials.availableCash.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      </div>
                   </div>
                </header>
                <main className="p-10 max-w-7xl mx-auto w-full">
                  <Routes>
                    <Route path="/" element={state.currentUser.role === Role.DONOR ? <DonorDashboard state={state} scoped={scopedData} /> : <Dashboard state={state} scoped={scopedData} />} />
                    <Route path="/meetings" element={<MeetingManagement state={state} scoped={scopedData} setState={setState} logAudit={logAudit} addTransaction={addTransaction} />} />
                    <Route path="/loans" element={<LoanManagement state={state} scoped={scopedData} setState={setState} logAudit={logAudit} addTransaction={addTransaction} />} />
                    <Route path="/ledger" element={<FinancialLedger state={state} scoped={scopedData} addTransaction={addTransaction} />} />
                    <Route path="/members" element={<MemberManagement state={state} scoped={scopedData} setState={setState} logAudit={logAudit} />} />
                    <Route path="/vslas" element={<VslaManagement state={state} scoped={scopedData} setState={setState} logAudit={logAudit} />} />
                    <Route path="/marketplace" element={<PartnershipMarketplace state={state} scoped={scopedData} setState={setState} logAudit={logAudit} />} />
                    <Route path="/audit" element={<AuditCenter logs={scopedData.auditLogs} />} />
                  </Routes>
                </main>
              </div>
            </div>
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
