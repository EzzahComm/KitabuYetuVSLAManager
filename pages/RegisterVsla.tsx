
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppState, Vsla } from '../types';
import { KENYA_GEOGRAPHY } from '../constants';
import { generateKYID } from '../App';

interface RegisterVslaProps {
  state: AppState;
  onRegister: (vsla: Vsla) => void;
}

const RegisterVsla: React.FC<RegisterVslaProps> = ({ state, onRegister }) => {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [county, setCounty] = useState('');
  const [constituency, setConstituency] = useState('');
  const [ward, setWard] = useState('');
  const [targetNgoIdentifier, setTargetNgoIdentifier] = useState('');
  
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
    
    let tenantId: string | undefined = undefined;
    if (targetNgoIdentifier) {
      const tenant = state.tenants.find(t => 
        t.slug.toLowerCase() === targetNgoIdentifier.toLowerCase() || 
        t.name.toLowerCase() === targetNgoIdentifier.toLowerCase()
      );
      if (tenant) tenantId = tenant.id;
    }

    const newId = generateKYID('KYV', state.vslas.length, 3);
    const inviteCode = `${name.substring(0, 3).toUpperCase()}-${newId}`;

    // Fix: Added missing hasInvestmentModule property to satisfy the Vsla interface
    const newVsla: Vsla = {
      id: newId,
      tenantId,
      inviteCode,
      name,
      country: 'Kenya',
      county,
      constituency,
      ward,
      village,
      status: 'pending',
      hasInvestmentModule: false,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    onRegister(newVsla);
    navigate('/login');
    alert(`VSLA Registered! ID: ${newId}. Invite Code: ${inviteCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-emerald-900 text-white">
          <h1 className="text-4xl font-black tracking-tight leading-tight">Digitalize your <span className="text-amber-500">Chama</span>.</h1>
          <p className="mt-6 text-emerald-100 font-medium">Join the Kitabu Yetu network to improve financial security and group visibility.</p>
        </div>
        <div className="p-8 md:p-12 flex flex-col overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">VSLA Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Group Name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-emerald-500 outline-none" />
            <input type="text" value={targetNgoIdentifier} onChange={e => setTargetNgoIdentifier(e.target.value)} placeholder="Target NGO (Optional)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-emerald-500 outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <select required value={county} onChange={e => setCounty(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none">
                <option value="">County...</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select required disabled={!county} value={constituency} onChange={e => setConstituency(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none">
                <option value="">Constituency...</option>
                {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input required type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="Village Name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-emerald-500 outline-none" />
            <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98]">Initialize VSLA Identity</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVsla;
