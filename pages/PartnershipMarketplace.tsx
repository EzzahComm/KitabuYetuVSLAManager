
import React, { useState, useMemo } from 'react';
import { AppState, PartnershipProject, Role } from '../types';

interface MarketplaceProps {
  state: AppState;
  scoped: any;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logAudit: (a: string, d: string) => void;
}

const PartnershipMarketplace: React.FC<MarketplaceProps> = ({ state, scoped, setState, logAudit }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', budget: '', vslaId: '', category: 'Agribusiness' });

  const isNgo = state.currentUser?.role === Role.NGO_ADMIN;
  const isDonor = state.currentUser?.role === Role.DONOR;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const project: PartnershipProject = {
      id: `pp_${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      vslaId: newProject.vslaId,
      tenantId: state.currentTenantId,
      budget: parseFloat(newProject.budget),
      fundedAmount: 0,
      status: 'Open',
      category: newProject.category,
      mAndEScore: 85 // Mocked high score for new entries
    };

    setState(prev => ({ ...prev, partnershipProjects: [...prev.partnershipProjects, project] }));
    logAudit('MARKET_POST', `NGO posted partnership opportunity: ${project.title}`);
    setShowAddForm(false);
  };

  const handleFund = (id: string) => {
    if (!isDonor) return;
    const amountStr = prompt("Enter funding amount to commit (KES):");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);

    setState(prev => ({
      ...prev,
      partnershipProjects: prev.partnershipProjects.map(p => {
        if (p.id === id) {
          const newFunded = p.fundedAmount + amount;
          return { ...p, fundedAmount: newFunded, status: newFunded >= p.budget ? 'Funded' : p.status };
        }
        return p;
      })
    }));
    logAudit('MARKET_FUND', `Donor committed KES ${amount} to project ${id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Impact Marketplace</h1>
          <p className="text-slate-500 font-medium">Connecting Donors with VSLA Income-Generating Projects.</p>
        </div>
        {isNgo && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-sm">
            {showAddForm ? 'Cancel Request' : 'Post Funding Need'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl animate-in zoom-in-95 max-w-3xl mx-auto">
          <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest">Partnership Opportunity</h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <input required placeholder="Project Title (e.g. Village Poultry Expansion)" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
            <textarea required placeholder="Impact Narrative & Strategic Need" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none h-32" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" placeholder="Budget Need (KES)" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none" />
              <select value={newProject.vslaId} onChange={e => setNewProject({...newProject, vslaId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 font-bold outline-none">
                <option value="">Link VSLA Group...</option>
                {scoped.vslas.map((v:any) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Publish to Marketplace</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {scoped.partnershipProjects.map((p: PartnershipProject) => (
          <div key={p.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl transition-all group">
            <div className="p-8 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {p.category}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">M&E: <span className="text-slate-900">{p.mAndEScore}%</span></span>
              </div>
              <h4 className="text-xl font-black text-slate-900 leading-tight">{p.title}</h4>
              <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed italic">"{p.description}"</p>
              
              <div className="pt-6 border-t border-slate-50">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Funding Progress</p>
                  <p className="text-xs font-black text-slate-800">KES {p.fundedAmount.toLocaleString()} / {p.budget.toLocaleString()}</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(p.fundedAmount/p.budget)*100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex items-center justify-between border-t border-slate-100">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">NGO</div>
                 <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">VSLA</div>
              </div>
              {isDonor && p.status === 'Open' ? (
                <button onClick={() => handleFund(p.id)} className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Invest in Impact</button>
              ) : (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.status === 'Funded' ? 'Project Active' : 'Marketplace Listing'}</span>
              )}
            </div>
          </div>
        ))}

        {scoped.partnershipProjects.length === 0 && (
          <div className="col-span-full py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="font-black uppercase text-[10px] tracking-[0.3em]">Marketplace is currently empty</p>
            <p className="text-xs font-bold text-slate-400 mt-2">NGOs can post project funding needs here for global donors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnershipMarketplace;
