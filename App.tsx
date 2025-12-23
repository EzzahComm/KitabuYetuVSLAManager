
import React, { useState, useEffect, useMemo, useCallback, Component, ErrorInfo, ReactNode, memo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ICONS } from './constants';
import { AppState, Role, Transaction, TransactionType, AuditLog, ExpenseStatus, Gender, MemberStatus } from './types';
import { apiClient } from './api';

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
import AiStrategy from './pages/AiStrategy';
import SuperConsole from './pages/SuperConsole';
import Contact from './pages/Contact';

/**
 * Production Error Boundary
 */
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Failure:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl mx-auto flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Encountered a Glitch</h1>
              <p className="text-slate-500 font-medium">An unexpected error occurred. Your data has been preserved in local storage. Please reload to continue.</p>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const INITIAL_STATE: AppState = {
  tenants: [
    { id: 'KYN0001', slug: 'global-impact', name: 'Global Impact NGO', email: 'admin@globalimpact.org', country: 'Kenya', county: 'Mombasa', constituency: 'Westlands', ward: 'Parklands/Highridge', smsConfig: { gateway: 'AfricasTalking', balance: 500 } },
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

/**
 * State Schema Enforcement: Guarantees that the app state always 
 * has necessary arrays and properties to prevent crash.
 */
const safeState = (data: any): AppState => {
  const base = { ...INITIAL_STATE, ...(data || {}) };
  return {
    ...base,
    tenants: Array.isArray(base.tenants) ? base.tenants : INITIAL_STATE.tenants,
    vslas: Array.isArray(base.vslas) ? base.vslas : INITIAL_STATE.vslas,
    cycles: Array.isArray(base.cycles) ? base.cycles : INITIAL_STATE.cycles,
    meetings: Array.isArray(base.meetings) ? base.meetings : INITIAL_STATE.meetings,
    attendance: Array.isArray(base.attendance) ? base.attendance : INITIAL_STATE.attendance,
    loans: Array.isArray(base.loans) ? base.loans : INITIAL_STATE.loans,
    members: Array.isArray(base.members) ? base.members : INITIAL_STATE.members,
    expenses: Array.isArray(base.expenses) ? base.expenses : INITIAL_STATE.expenses,
    investmentProjects: Array.isArray(base.investmentProjects) ? base.investmentProjects : INITIAL_STATE.investmentProjects,
    projectTransactions: Array.isArray(base.projectTransactions) ? base.projectTransactions : INITIAL_STATE.projectTransactions,
    partnershipProjects: Array.isArray(base.partnershipProjects) ? base.partnershipProjects : INITIAL_STATE.partnershipProjects,
    transactions: Array.isArray(base.transactions) ? base.transactions : INITIAL_STATE.transactions,
    auditLogs: Array.isArray(base.auditLogs) ? base.auditLogs : INITIAL_STATE.auditLogs,
  };
};

export const generateKYID = (prefix: string, count: number, padding: number) => {
  return `${prefix}${(count + 1).toString().padStart(padding, '0')}`;
};

const Sidebar = memo(({ state, onLogout, syncStatus }: { state: AppState; onLogout: () => void; syncStatus: string }) => {
  const location = useLocation();
  const isSuper = state.currentUser?.role === Role.SUPER_ADMIN;

  const menu = useMemo(() => [
    ...(isSuper ? [{ path: '/app/super-console', label: 'Super Console', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> }] : []),
    { path: '/app', label: isSuper ? 'Global Insights' : 'Insights & M&E', icon: <ICONS.Dashboard /> },
    { path: '/app/ai-strategy', label: 'AI Strategy', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
    { path: '/app/meetings', label: 'Meeting Sessions', icon: <ICONS.Reports /> },
    { path: '/app/loans', label: 'Loan Book', icon: <ICONS.Savings /> },
    { path: '/app/ledger', label: 'Financial Ledger', icon: <ICONS.Savings /> },
    { path: '/app/members', label: 'Member Registry', icon: <ICONS.Users /> },
    { path: '/app/vslas', label: 'Group Portfolio', icon: <ICONS.Group /> },
    { path: '/app/marketplace', label: 'Impact Market', icon: <ICONS.Search /> },
    { path: '/app/audit', label: 'Audit Trail', icon: <ICONS.Search /> },
  ], [isSuper]);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed flex flex-col border-r border-slate-800 shadow-2xl z-30">
      <div className="p-8 border-b border-slate-800">
        <Link to="/" className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter">
          <span className="text-emerald-500 underline decoration-emerald-500/30">Kitabu</span> Yetu
        </Link>
        <div className="mt-6 space-y-3">
          <div>
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-2 block">Environment</label>
            <div className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 truncate">
              {isSuper ? 'Super Admin Mode' : (state.tenants.find(t => t.id === state.currentTenantId)?.name || 'Google Cloud Node')}
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-pulse' : syncStatus === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              {syncStatus === 'syncing' ? 'Publishing to Sheets...' : syncStatus === 'error' ? 'Sheets Sync Failed' : 'Cloud Ledger Online'}
            </span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 overflow-y-auto no-scrollbar px-3 space-y-1">
        {menu.filter(item => {
          if (state.currentUser?.role === Role.DONOR) {
            return ['/app', '/app/vslas', '/app/marketplace', '/app/audit'].includes(item.path);
          }
          return true;
        }).map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-200 ${
              location.pathname === item.path ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'hover:bg-slate-800 hover:text-white text-slate-400'
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
});

const AppHeader = memo(({ syncStatus, availableCash, isSuper, onManualSync }: { syncStatus: string; availableCash: number; isSuper: boolean; onManualSync: () => void }) => (
  <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-pulse' : syncStatus === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
      <span className="text-slate-900 text-xs font-black uppercase tracking-widest">
        {syncStatus === 'syncing' ? 'Updating Google Sheets...' : syncStatus === 'error' ? 'Local Buffer Only (Offline)' : (isSuper ? 'Master Console Active' : 'Verified Cloud Access')}
      </span>
    </div>
    <div className="flex items-center gap-8">
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Liquidity Pool</p>
        <p className="text-sm font-black text-slate-900 tracking-tight">KES {availableCash.toLocaleString()}</p>
      </div>
      <div className="w-px h-8 bg-slate-100"></div>
      <button 
        onClick={onManualSync}
        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-all shadow-sm"
        title="Sync to Sheets Now"
      >
        <svg className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      </button>
    </div>
  </header>
));

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('kitabu_v1_gas_production');
      if (!saved) return INITIAL_STATE;
      const parsed = JSON.parse(saved);
      return safeState(parsed);
    } catch (e) {
      return INITIAL_STATE;
    }
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cloudState = await apiClient.fetchLatest();
        if (cloudState && cloudState.currentTenantId) {
          setState(safeState(cloudState));
          console.log("Cloud state hydrated from Google Sheets.");
        }
      } catch (e) {
        console.warn("Cloud hydration failed. Using local storage.", e);
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    localStorage.setItem('kitabu_v1_gas_production', JSON.stringify(state));
    const handler = setTimeout(async () => {
      if (state.currentUser) {
        setSyncStatus('syncing');
        try {
          await apiClient.syncToSheets(state);
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
        } catch (e) {
          setSyncStatus('error');
        }
      }
    }, 15000);
    return () => clearTimeout(handler);
  }, [state]);

  const handleManualSync = useCallback(() => {
    setSyncStatus('syncing');
    apiClient.syncToSheets(state)
      .then(() => {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2000);
      })
      .catch(() => setSyncStatus('error'));
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
    setState(prev => ({ ...prev, auditLogs: [log, ...(prev.auditLogs || [])] }));
  }, [state.currentTenantId, state.currentUser?.id]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'tenantId' | 'isSoftDeleted'>) => {
    const newTx: Transaction = { 
      ...tx, 
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, 
      tenantId: state.currentTenantId, 
      isSoftDeleted: false 
    };
    setState(prev => ({ ...prev, transactions: [...(prev.transactions || []), newTx] }));
  }, [state.currentTenantId]);

  const scopedData = useMemo(() => {
    const isSuper = state.currentUser?.role === Role.SUPER_ADMIN;
    const currentTenantId = state.currentTenantId || '';
    
    const vslaFilter = (v: any) => isSuper || v?.tenantId === currentTenantId;
    const memberFilter = (m: any) => isSuper || m?.tenantId === currentTenantId;
    const txFilter = (t: any) => isSuper || t?.tenantId === currentTenantId;

    const vslas = (state.vslas || []).filter(vslaFilter);
    const vslaIds = vslas.map(v => v.id);
    const members = (state.members || []).filter(memberFilter);
    const transactions = (state.transactions || []).filter(txFilter);
    const loans = (state.loans || []).filter(l => vslaIds.includes(l.vslaId));
    const expenses = (state.expenses || []).filter(e => vslaIds.includes(e.vslaId));
    const projects = (state.investmentProjects || []).filter(p => vslaIds.includes(p.vslaId));
    const projectTx = (state.projectTransactions || []).filter(pt => projects.some(p => p.id === pt.projectId));
    const partnershipProjects = (state.partnershipProjects || []).filter(pp => isSuper || pp?.tenantId === currentTenantId);

    const totals = transactions.reduce((acc, t) => {
      if (t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE) acc.savings += (t.amount || 0);
      if (t.type === TransactionType.LOAN_REPAYMENT_PRINCIPAL) acc.repaidPrincipal += (t.amount || 0);
      if (t.type === TransactionType.LOAN_REPAYMENT_INTEREST) acc.earnedInterest += (t.amount || 0);
      if (t.type === TransactionType.FINE) acc.fines += (t.amount || 0);
      if (t.type === TransactionType.REGISTRATION_FEE) acc.fees += (t.amount || 0);
      if (t.type === TransactionType.WELFARE_CONTRIBUTION) acc.welfare += (t.amount || 0);
      if (t.type === TransactionType.LOAN_ISSUE) acc.disbursed += (t.amount || 0);
      if (t.type === TransactionType.DIVIDEND_PAYOUT) acc.dividends += (t.amount || 0);
      return acc;
    }, { savings: 0, disbursed: 0, repaidPrincipal: 0, earnedInterest: 0, fines: 0, fees: 0, welfare: 0, dividends: 0 });

    const totalApprovedExpenses = expenses
      .filter(e => e.status === ExpenseStatus.APPROVED)
      .reduce((acc, e) => acc + (e.amount || 0), 0);

    const outstandingLoanPrincipal = loans.reduce((acc, l) => acc + (l.status === 'Active' ? (l.remainingPrincipal || 0) : 0), 0);
    const availableCash = Math.max(0, (totals.savings + totals.repaidPrincipal + totals.earnedInterest + totals.fines + totals.fees + totals.welfare) - (totals.disbursed + totalApprovedExpenses + totals.dividends));

    return {
      vslas,
      members,
      transactions,
      loans,
      expenses,
      projects,
      projectTx,
      partnershipProjects,
      meetings: (state.meetings || []).filter(m => vslaIds.includes(m.vslaId)),
      attendance: state.attendance || [],
      auditLogs: isSuper ? (state.auditLogs || []) : (state.auditLogs || []).filter(l => l.tenantId === currentTenantId),
      financials: { 
        ...totals, 
        outstandingLoanPrincipal, 
        totalExpenses: totalApprovedExpenses,
        availableCash
      }
    };
  }, [state, state.currentTenantId, state.currentUser]);

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login state={state} onLogin={(u, t) => { setState(p => safeState({...p, currentUser: u, currentTenantId: t})); logAudit('LOGIN', `Google App Session Started: ${u.role}`); }} />} />
          <Route path="/register/ngo" element={<RegisterNgo state={state} onRegister={(t) => { setState(p => safeState({...p, tenants: [...(p.tenants || []), t]})); logAudit('ORG_PROV', `NGO provisioned: ${t.name}`); }} />} />
          <Route path="/register/vsla" element={<RegisterVsla state={state} onRegister={(v) => { setState(p => safeState({...p, vslas: [...(p.vslas || []), v]})); logAudit('VSLA_REG', `VSLA provisioned: ${v.name}`); }} />} />
          <Route path="/app/*" element={
            !state.currentUser ? <Navigate to="/login" /> : (
              <div className="min-h-screen flex bg-slate-50">
                <Sidebar state={state} onLogout={() => setState(p => safeState({...p, currentUser: null}))} syncStatus={syncStatus} />
                <div className="flex-1 ml-64 flex flex-col">
                  <AppHeader 
                    syncStatus={syncStatus} 
                    availableCash={scopedData.financials.availableCash} 
                    isSuper={state.currentUser.role === Role.SUPER_ADMIN} 
                    onManualSync={handleManualSync}
                  />
                  <main className="p-10 max-w-7xl mx-auto w-full page-transition">
                    <Routes>
                      <Route path="/" element={state.currentUser.role === Role.DONOR ? <DonorDashboard state={state} scoped={scopedData} /> : <Dashboard state={state} scoped={scopedData} />} />
                      <Route path="/super-console" element={state.currentUser.role === Role.SUPER_ADMIN ? <SuperConsole state={state} scoped={scopedData} setState={setState} /> : <Navigate to="/app" />} />
                      <Route path="/ai-strategy" element={<AiStrategy state={state} scoped={scopedData} />} />
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
      </ErrorBoundary>
    </Router>
  );
};

export default App;
