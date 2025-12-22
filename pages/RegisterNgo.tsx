
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppState, Tenant, Role } from '../types';
import { KENYA_GEOGRAPHY } from '../constants';
import { generateKYID } from '../App';

interface RegisterNgoProps {
  state: AppState;
  onRegister: (tenant: Tenant) => void;
}

const RegisterNgo: React.FC<RegisterNgoProps> = ({ state, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [county, setCounty] = useState('');
  const [constituency, setConstituency] = useState('');
  const [ward, setWard] = useState('');
  const [regType, setRegType] = useState<'ngo' | 'donor'>('ngo');
  const navigate = useNavigate();

  const counties = useMemo(() => Object.keys(KENYA_GEOGRAPHY), []);
  const constituencies = useMemo(() => {
    if (!county) return [];
    return Object.keys(KENYA_GEOGRAPHY[county as keyof typeof KENYA_GEOGRAPHY] || {});
  }, [county]);
  const wards = useMemo(() => {
    if (!county || !constituency) return [];
    return KENYA_GEOGRAPHY[county as keyof typeof KENYA_GEOGRAPHY][constituency as any] || [];
  }, [county, constituency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Custom ID generation
    const prefix = regType === 'ngo' ? 'KYN' : 'KYD';
    const padding = regType === 'ngo' ? 4 : 3;
    const count = state.tenants.filter(t => t.id.startsWith(prefix)).length;
    const newId = generateKYID(prefix, count, padding);

    const newTenant: Tenant = {
      id: newId,
      slug,
      name,
      email,
      country,
      county,
      constituency,
      ward,
      smsConfig: { gateway: 'AfricasTalking', balance: 10 }
    };

    onRegister(newTenant);
    navigate('/login');
    alert(`Registration successful! ID: ${newId}. Organization Slug: ${slug}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white">
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Start your <span className="text-emerald-500">Digital Transition</span>.</h1>
            <p className="mt-6 text-slate-400 font-medium leading-relaxed max-w-sm">Onboard your organization to the Kitabu Yetu MIS. Secure IDs, audit-ready ledgers, and real-time M&E.</p>
          </div>
        </div>
        <div className="p-8 md:p-12 flex flex-col overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <Link to="/login" className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg> Back to Portal
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Organization Onboarding</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setRegType('ngo')} className={`py-2 text-[10px] font-black uppercase rounded-xl border ${regType === 'ngo' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>NGO Partner</button>
                <button type="button" onClick={() => setRegType('donor')} className={`py-2 text-[10px] font-black uppercase rounded-xl border ${regType === 'donor' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>Donor Agency</button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Organization Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hope International" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-emerald-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">County</label>
                <select required value={county} onChange={e => setCounty(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none">
                  <option value="">Select County...</option>
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Constituency</label>
                <select required disabled={!county} value={constituency} onChange={e => setConstituency(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none disabled:opacity-50">
                   <option value="">Select...</option>
                   {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Admin Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ngo.org" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none" />
            </div>
            <button className="w-full bg-slate-950 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Initialize {regType.toUpperCase()} Identity</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterNgo;
