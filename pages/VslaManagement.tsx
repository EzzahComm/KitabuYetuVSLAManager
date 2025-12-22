
import React, { useState, useMemo } from 'react';
import { AppState, Vsla, Cycle, Expense, ExpenseStatus, InvestmentProject, ProjectTransaction, ProjectTransactionType, Role } from '../types';

interface VslaProps {
  state: AppState;
  scoped: any;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logAudit: (a: string, d: string) => void;
}

const VslaManagement: React.FC<VslaProps> = ({ state, scoped, setState, logAudit }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'cycles' | 'expenses' | 'investments'>('active');
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showTxForm, setShowTxForm] = useState(false);
  
  const [expenseForm, setExpenseForm] = useState({ vslaId: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [projectForm, setProjectForm] = useState({ 
    vslaId: '', 
    name: '', 
    description: '', 
    cost: '', 
    category: 'Agribusiness' as any,
    start: new Date().toISOString().split('T')[0] 
  });
  const [txForm, setTxForm] = useState({ type: ProjectTransactionType.INCOME, amount: '', description: '', date: new Date().toISOString().split('T')[0] });

  const currentUserMember = useMemo(() => {
    return state.members.find(m => m.tenantId === state.currentTenantId && (m.phone === '0711111111' || m.phone === '0722222222')); 
  }, [state.members, state.currentTenantId]);

  const canApprove = currentUserMember?.role === 'Chair';
  const canRequest = currentUserMember?.role === 'Treasurer';

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.vslaId || !projectForm.name) return;

    const newProject: InvestmentProject = {
      id: `prj_${Date.now()}`,
      vslaId: projectForm.vslaId,
      name: projectForm.name,
      description: projectForm.description,
      capitalCost: parseFloat(projectForm.cost),
      startDate: projectForm.start,
      isActive: true,
      category: projectForm.category,
      targetRoi: 20,
      fundingStatus: 'Seeking Funding'
    };

    setState(prev => ({ ...prev, investmentProjects: [...prev.investmentProjects, newProject] }));
    logAudit('PROJECT_INIT', `Investment project "${projectForm.name}" launched for VSLA ${projectForm.vslaId}`);
    setShowProjectForm(false);
    setProjectForm({ vslaId: '', name: '', description: '', cost: '', category: 'Agribusiness', start: new Date().toISOString().split('T')[0] });
  };

  const handleAddProjectTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !txForm.amount) return;

    const newTx: ProjectTransaction = {
      id: `ptx_${Date.now()}`,
      projectId: selectedProjectId,
      type: txForm.type,
      amount: parseFloat(txForm.amount),
      description: txForm.description,
      date: txForm.date
    };

    setState(prev => ({ ...prev, projectTransactions: [...(prev.projectTransactions || []), newTx] }));
    logAudit('PROJECT_TX', `Recorded ${txForm.type} of KES ${txForm.amount} for project ${selectedProjectId}`);
    setShowTxForm(false);
    setTxForm({ type: ProjectTransactionType.INCOME, amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  // Fix: Added missing handleAddExpense to process expense requisitions
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.vslaId || !expenseForm.amount) return;

    const activeCycle = state.cycles.find(c => c.vslaId === expenseForm.vslaId && c.isActive);

    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      vslaId: expenseForm.vslaId,
      cycleId: activeCycle?.id || 'default',
      memberId: currentUserMember?.id || 'sys',
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      date: expenseForm.date,
      status: ExpenseStatus.PENDING_APPROVAL
    };

    setState(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    logAudit('EXPENSE_REQ', `Expense requisition of KES ${expenseForm.amount} for ${expenseForm.description}`);
    setShowExpenseForm(false);
    setExpenseForm({ vslaId: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  // Fix: Added missing handleApproveExpense to allow chairpersons to authorize expenditures
  const handleApproveExpense = (id: string, approved: boolean) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => {
        if (e.id === id) {
          return {
            ...e,
            status: approved ? ExpenseStatus.APPROVED : ExpenseStatus.REJECTED,
            approvedBy: state.currentUser?.name,
            updatedAt: new Date().toISOString()
          };
        }
        return e;
      })
    }));
    logAudit('EXPENSE_AUTH', `Expense ${id} ${approved ? 'approved' : 'rejected'} by chairperson`);
  };

  const selectedProject = useMemo(() => {
    return scoped.projects.find((p: InvestmentProject) => p.id === selectedProjectId);
  }, [selectedProjectId, scoped.projects]);

  const projectLedger = useMemo(() => {
    if (!selectedProjectId) return [];
    return (state.projectTransactions || []).filter(tx => tx.projectId === selectedProjectId);
  }, [selectedProjectId, state.projectTransactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portfolio Governance</h1>
          <p className="text-slate-500 font-medium tracking-tight">Financial cycles, internal controls, and growth projects.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar shadow-sm">
          <button onClick={() => { setActiveTab('active'); setSelectedProjectId(null); }} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Groups</button>
          <button onClick={() => { setActiveTab('cycles'); setSelectedProjectId(null); }} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cycles' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cycles</button>
          <button onClick={() => { setActiveTab('expenses'); setSelectedProjectId(null); }} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'expenses' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Expenses</button>
          <button onClick={() => { setActiveTab('investments'); setSelectedProjectId(null); }} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'investments' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Investments</button>
        </div>
      </div>

      {activeTab === 'investments' && !selectedProjectId && (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Strategic Growth Hub</h3>
                 <p className="text-xs text-slate-400 font-bold mt-1">Income generating projects and capital assets</p>
              </div>
              <button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Launch New IGP</button>
           </div>

           {showProjectForm && (
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl animate-in zoom-in-95 max-w-xl mx-auto">
                 <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest">Investment Proposal</h3>
                 <form onSubmit={handleAddProject} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Target VSLA Group</label>
                          <select required value={projectForm.vslaId} onChange={e => setProjectForm({...projectForm, vslaId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-emerald-500 transition-all">
                             <option value="">Select VSLA Group...</option>
                             {scoped.vslas.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Category</label>
                          <select value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value as any})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none">
                             <option value="Agribusiness">Agribusiness</option>
                             <option value="Poultry">Poultry</option>
                             <option value="Retail">Retail</option>
                             <option value="Service">Service</option>
                             <option value="Other">Other</option>
                          </select>
                       </div>
                    </div>
                    <input required type="text" placeholder="Project Name (e.g. Solar Irrigation)" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                       <input required type="number" placeholder="Capital Cost (KES)" value={projectForm.cost} onChange={e => setProjectForm({...projectForm, cost: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
                       <input required type="date" value={projectForm.start} onChange={e => setProjectForm({...projectForm, start: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
                    </div>
                    <textarea placeholder="Strategy for Income Generation" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none h-32 resize-none" />
                    <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Commit Capital & Activate Project</button>
                 </form>
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scoped.projects.map((p: InvestmentProject) => {
                 const txs = (state.projectTransactions || []).filter((pt: any) => pt.projectId === p.id);
                 const income = txs.filter((pt: any) => pt.type === ProjectTransactionType.INCOME).reduce((a: number, b: any) => a + b.amount, 0);
                 const expense = txs.filter((pt: any) => pt.type === ProjectTransactionType.EXPENSE).reduce((a: number, b: any) => a + b.amount, 0);
                 const profit = income - expense;
                 const roi = p.capitalCost > 0 ? ((profit) / p.capitalCost) * 100 : 0;

                 return (
                    <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div>
                             <h4 className="text-2xl font-black text-slate-900">{p.name}</h4>
                             <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">{p.category} • {p.vslaId}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roi >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                             ROI: {roi.toFixed(1)}%
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
                          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                             <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">CAPEX</p>
                             <p className="text-sm font-black text-slate-800">KES {p.capitalCost.toLocaleString()}</p>
                          </div>
                          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
                             <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-1">INCOME</p>
                             <p className="text-sm font-black text-emerald-700">KES {income.toLocaleString()}</p>
                          </div>
                          <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100">
                             <p className="text-[9px] font-black uppercase text-rose-600 tracking-widest mb-1">OPEX</p>
                             <p className="text-sm font-black text-rose-700">KES {expense.toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="space-y-4 relative z-10">
                          <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{p.description}"</p>
                          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Asset</span>
                             </div>
                             <button onClick={() => setSelectedProjectId(p.id)} className="text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 bg-slate-50 px-5 py-2 rounded-xl transition-all">Project Ledger →</button>
                          </div>
                       </div>
                    </div>
                 );
              })}
              {scoped.projects.length === 0 && (
                 <div className="col-span-full py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                       <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <p className="font-black uppercase text-[10px] tracking-[0.3em]">Institutional Grade Investment Module</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">Unlock group wealth diversification today.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {selectedProject && (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
           <div className="flex items-center justify-between">
              <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:text-slate-900 transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                 Back to Investments
              </button>
              <button onClick={() => setShowTxForm(!showTxForm)} className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                 {showTxForm ? 'Cancel Entry' : 'New Project Posting'}
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Asset Intelligence</h3>
                    <h4 className="text-3xl font-black text-slate-900 mb-2">{selectedProject.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-8">{selectedProject.category}</p>
                    
                    <div className="space-y-6">
                       <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Launched</span>
                          <span className="text-sm font-bold text-slate-800">{selectedProject.startDate}</span>
                       </div>
                       <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Capex</span>
                          <span className="text-sm font-bold text-slate-800">KES {selectedProject.capitalCost.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VSLA Link</span>
                          <span className="text-sm font-bold text-slate-800">{selectedProject.vslaId}</span>
                       </div>
                    </div>
                    <p className="mt-8 text-xs text-slate-500 italic leading-relaxed font-medium">"{selectedProject.description}"</p>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                 {showTxForm && (
                    <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-900 shadow-2xl animate-in zoom-in-95">
                       <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest">Project Ledger Entry</h3>
                       <form onSubmit={handleAddProjectTx} className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Entry Class</label>
                                <select required value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value as ProjectTransactionType})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900 transition-all">
                                   <option value={ProjectTransactionType.INCOME}>Income / Revenue</option>
                                   <option value={ProjectTransactionType.EXPENSE}>Project Expense / OPEX</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Amount (KES)</label>
                                <input required type="number" placeholder="0.00" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900" />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Effective Date</label>
                                <input required type="date" value={txForm.date} onChange={e => setTxForm({...txForm, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900" />
                             </div>
                             <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Narration</label>
                                <input required type="text" placeholder="Reason for entry..." value={txForm.description} onChange={e => setTxForm({...txForm, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900" />
                             </div>
                          </div>
                          <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all">Submit Audit Entry</button>
                       </form>
                    </div>
                 )}

                 <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                       <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Transaction History</h3>
                       <p className="text-xs text-slate-400 font-bold mt-1">Detailed audit of capital activity for this asset</p>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                             <tr>
                                <th className="px-8 py-5">Post Date</th>
                                <th className="px-8 py-5">Entry Type</th>
                                <th className="px-8 py-5">Description</th>
                                <th className="px-8 py-5 text-right">Amount (KES)</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {projectLedger.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-8 py-6 font-bold text-slate-600">{tx.date}</td>
                                   <td className="px-8 py-6">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${tx.type === ProjectTransactionType.INCOME ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                         {tx.type}
                                      </span>
                                   </td>
                                   <td className="px-8 py-6 text-slate-500 font-medium italic">{tx.description}</td>
                                   <td className={`px-8 py-6 text-right font-black ${tx.type === ProjectTransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {tx.type === ProjectTransactionType.INCOME ? '+' : '-'} {tx.amount.toLocaleString()}
                                   </td>
                                </tr>
                             ))}
                             {projectLedger.length === 0 && (
                                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40 italic">No activity recorded for this asset yet.</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'expenses' && !selectedProjectId && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Expense Approval Queue</h3>
                 <p className="text-xs text-slate-400 font-bold mt-1">Chairperson authorization required for all expenditures</p>
              </div>
              {canRequest && (
                 <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">New Requisition</button>
              )}
           </div>

           {showExpenseForm && (
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-900 shadow-2xl animate-in zoom-in-95 max-w-xl mx-auto">
                 <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest">Treasurer Requisition</h3>
                 <form onSubmit={handleAddExpense} className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Target VSLA</label>
                       <select required value={expenseForm.vslaId} onChange={e => setExpenseForm({...expenseForm, vslaId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900 transition-all">
                          <option value="">Pick Group...</option>
                          {scoped.vslas.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Amount (KES)</label>
                          <input required type="number" placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Date</label>
                          <input required type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Requisition Purpose</label>
                       <input required type="text" placeholder="e.g. Venue Rental / Stationaries" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-900" />
                    </div>
                    <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">Submit for Chairperson Approval</button>
                 </form>
              </div>
           )}

           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                    <tr>
                       <th className="px-8 py-5">Item Detail</th>
                       <th className="px-8 py-5">Treasurer</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5 text-right">Governance Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {scoped.expenses.map((e: Expense) => (
                       <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-black text-slate-900 text-base">KES {e.amount.toLocaleString()}</p>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{e.description} • {e.date}</p>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs font-bold text-slate-600">ID: {e.memberId}</p>
                             <p className="text-[10px] text-slate-400 font-bold">Group: {e.vslaId}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                                e.status === ExpenseStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                e.status === ExpenseStatus.REJECTED ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                'bg-amber-50 text-amber-700 border-amber-100'
                             }`}>{e.status}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             {e.status === ExpenseStatus.PENDING_APPROVAL && canApprove ? (
                                <div className="flex justify-end gap-3">
                                   <button 
                                      onClick={() => handleApproveExpense(e.id, false)} 
                                      className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest transition-all"
                                   >
                                      Reject
                                   </button>
                                   <button 
                                      onClick={() => handleApproveExpense(e.id, true)} 
                                      className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/10 transition-all"
                                   >
                                      Approve
                                   </button>
                                </div>
                             ) : (
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                   {e.status !== ExpenseStatus.PENDING_APPROVAL ? `Authorized by ${e.approvedBy || 'System'}` : 'Awaiting Chairperson'}
                                </span>
                             )}
                          </td>
                       </tr>
                    ))}
                    {scoped.expenses.length === 0 && (
                       <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40">No expense requisitions in the audit trail.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'active' && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                 <tr>
                    <th className="px-8 py-5">VSLA Group Name</th>
                    <th className="px-8 py-5">Geographic Location</th>
                    <th className="px-8 py-5">Lifecycle Stage</th>
                    <th className="px-8 py-5 text-right">Account State</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                 {scoped.vslas.map((v: Vsla) => {
                    const cycle = state.cycles.find(c => c.vslaId === v.id && c.isActive);
                    return (
                       <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-black text-slate-900 text-base">{v.name}</p>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{v.id}</p>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-slate-700 font-bold">{v.village}</p>
                             <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{v.county}, {v.country}</p>
                          </td>
                          <td className="px-8 py-6">
                             {cycle ? (
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{cycle.name}</span>
                             ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No Active Lifecycle</span>
                             )}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{v.status}</span>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'cycles' && (
        <div className="space-y-6">
           <div className="flex justify-end">
              <button onClick={() => setShowCycleForm(!showCycleForm)} className="bg-slate-950 text-white font-black px-7 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-950/20 transition-all active:scale-95">Define New Cycle</button>
           </div>
           
           {showCycleForm && (
              <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-950 shadow-2xl animate-in zoom-in-95 max-2xl mx-auto">
                 <h3 className="text-xl font-black text-slate-950 mb-8 uppercase tracking-widest">Financial Cycle Initialization</h3>
                 <form onSubmit={() => setShowCycleForm(false)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Target Group</label>
                          <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-950 transition-all">
                             <option value="">Pick Group...</option>
                             {scoped.vslas.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Cycle Reference</label>
                          <input required type="text" placeholder="e.g. Phase 2 - 2024" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none focus:border-slate-950 transition-all" />
                       </div>
                    </div>
                    <button className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl shadow-xl transition-all">Activate New Livelihood Cycle</button>
                 </form>
              </div>
           )}

           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                    <tr>
                       <th className="px-8 py-5">Cycle Identifier</th>
                       <th className="px-8 py-5">Cost of Capital</th>
                       <th className="px-8 py-5">Share Valuation</th>
                       <th className="px-8 py-5 text-right">Cycle Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-medium">
                    {state.cycles.filter(c => scoped.vslas.some((v:any) => v.id === c.vslaId)).map(c => (
                       <tr key={c.id}>
                          <td className="px-8 py-6">
                             <p className="font-black text-slate-800 text-base">{c.name}</p>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{scoped.vslas.find((v:any)=>v.id===c.vslaId)?.name}</p>
                          </td>
                          <td className="px-8 py-6 text-slate-700 font-bold">{c.interestRate}% monthly</td>
                          <td className="px-8 py-6 text-slate-700 font-bold">KES {c.sharePrice}</td>
                          <td className="px-8 py-6 text-right">
                             <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                {c.isActive ? 'Active Lifecycle' : 'Archived'}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default VslaManagement;
