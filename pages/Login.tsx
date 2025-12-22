
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppState, Role } from '../types';

interface LoginProps {
  state: AppState;
  onLogin: (user: any, tenantId: string) => void;
}

const Login: React.FC<LoginProps> = ({ state, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'ngo' | 'vsla' | 'donor'>('ngo');
  const [ngoSlug, setNgoSlug] = useState('');
  const [vslaCode, setVslaCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNgoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Super Admin Check
    if (email === 'Polycap' && password === 'Bungoma@2026') {
      onLogin({
        id: 'super_admin_001',
        name: 'Polycap (Super Admin)',
        role: Role.SUPER_ADMIN,
        tenantId: 'MASTER'
      }, 'MASTER');
      return;
    }

    if (!ngoSlug) return alert('Please enter your Organization Slug.');
    const tenant = state.tenants.find(t => t.slug.toLowerCase() === ngoSlug.toLowerCase());
    if (!tenant) return alert('Organization not found. Please verify the slug.');
    onLogin({
      id: `user_${Date.now()}`,
      name: `${tenant.name} Admin`,
      role: Role.NGO_ADMIN,
      tenantId: tenant.id
    }, tenant.id);
  };

  const handleVslaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Also allow super admin login from VSLA tab for convenience
    if (vslaCode === 'Polycap' && password === 'Bungoma@2026') {
      onLogin({
        id: 'super_admin_001',
        name: 'Polycap (Super Admin)',
        role: Role.SUPER_ADMIN,
        tenantId: 'MASTER'
      }, 'MASTER');
      return;
    }
    
    if (!vslaCode) return alert('Please enter your Group Invite Code.');
    const vsla = state.vslas.find(v => v.inviteCode.toUpperCase() === vslaCode.toUpperCase());
    if (!vsla) return alert('VSLA Group not found. Please check your Invite Code.');
    onLogin({
      id: `user_${Date.now()}`,
      name: `Officer of ${vsla.name}`,
      role: Role.VSLA_OFFICER,
      tenantId: vsla.tenantId
    }, vsla.tenantId);
  };

  const handleDonorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoSlug) return alert('Please enter the Program/NGO Slug to audit.');
    const tenant = state.tenants.find(t => t.slug.toLowerCase() === ngoSlug.toLowerCase());
    if (!tenant) return alert('Program identifier not found.');
    onLogin({
      id: `donor_${Date.now()}`,
      name: `Impact Auditor`,
      role: Role.DONOR,
      tenantId: tenant.id
    }, tenant.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black tracking-tight text-white mb-8 block">
               <span className="text-emerald-500">Kitabu</span> Yetu
            </Link>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Evidence-based <span className="text-emerald-500">M&E</span> for community finance.
            </h1>
            <p className="mt-6 text-slate-400 font-medium leading-relaxed max-w-sm">
              Standardizing Village Savings & Loans management for institutional transparency and growth.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Encrypted Infrastructure</span>
            </div>
            <p className="text-slate-500 text-sm font-bold">Postpaid Digital Ledger for East Africa</p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Access</h2>
            <p className="text-slate-500 font-medium mt-1">Select your role to continue.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('ngo')}
              className={`flex-1 min-w-fit px-4 py-3 rounded-xl text-xs font-black transition-all ${
                activeTab === 'ngo' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              NGO Partner
            </button>
            <button 
              onClick={() => setActiveTab('vsla')}
              className={`flex-1 min-w-fit px-4 py-3 rounded-xl text-xs font-black transition-all ${
                activeTab === 'vsla' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              VSLA Group
            </button>
            <button 
              onClick={() => setActiveTab('donor')}
              className={`flex-1 min-w-fit px-4 py-3 rounded-xl text-xs font-black transition-all ${
                activeTab === 'donor' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Donor / M&E
            </button>
          </div>

          {activeTab === 'ngo' && (
            <div className="flex flex-col flex-1 animate-in slide-in-from-right-4 duration-300">
              <form onSubmit={handleNgoLogin} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Organization Slug / Username</label>
                  <input required type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Username or Email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Org Slug (if not Super Admin)" value={ngoSlug} onChange={e => setNgoSlug(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <button className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                  Secure Access
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm font-medium">Don't have an account? <Link to="/register/ngo" className="text-emerald-600 font-black hover:underline">Register NGO</Link></p>
              </div>
            </div>
          )}

          {activeTab === 'vsla' && (
            <div className="flex flex-col flex-1 animate-in slide-in-from-left-4 duration-300">
              <form onSubmit={handleVslaLogin} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Group Invite Code / Username</label>
                  <input required type="text" value={vslaCode} onChange={e => setVslaCode(e.target.value)} placeholder="e.g. SUN-NAK-001 or Polycap" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-4">
                  <input type="password" placeholder="PIN / Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 active:scale-[0.98]">
                  Open Community Portal
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm font-medium">Group not yet digital? <Link to="/register/vsla" className="text-emerald-600 font-black hover:underline">Register Group</Link></p>
              </div>
            </div>
          )}

          {activeTab === 'donor' && (
            <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4 duration-300">
              <form onSubmit={handleDonorLogin} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Grant / Program Identifier</label>
                  <input required type="text" value={ngoSlug} onChange={e => setNgoSlug(e.target.value)} placeholder="e.g. global-impact" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter italic">* Donors access anonymized program-level data only.</p>
                </div>
                <div className="space-y-4">
                  <input type="email" placeholder="Assigned Auditor Email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                  <input type="password" placeholder="Audit Access Key" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <button className="w-full bg-emerald-900 text-white font-black py-5 rounded-2xl hover:bg-emerald-800 transition-all shadow-xl active:scale-[0.98]">
                  Initialize Donor Dashboard
                </button>
              </form>
            </div>
          )}

          <div className="mt-auto pt-10 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Kitabu Yetu MIS &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
