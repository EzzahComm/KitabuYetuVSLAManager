
import React, { useState, useMemo } from 'react';
import { AppState, Meeting, Attendance, AttendanceStatus, TransactionType, Role } from '../types';

interface MeetingProps {
  state: AppState;
  scoped: any;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logAudit: (a: string, d: string) => void;
  addTransaction: (tx: any) => void;
}

const MeetingManagement: React.FC<MeetingProps> = ({ state, scoped, setState, logAudit, addTransaction }) => {
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [meetingForm, setMeetingForm] = useState({ vslaId: '', location: '', date: new Date().toISOString().split('T')[0] });
  const [activeTab, setActiveTab] = useState<'sessions' | 'history'>('sessions');

  const startMeeting = () => {
    if (!meetingForm.vslaId) return alert("Select a VSLA group first.");
    const cycle = state.cycles.find(c => c.vslaId === meetingForm.vslaId && c.isActive);
    if (!cycle) return alert("No active cycle found for this group. Please define a cycle in VSLA Management.");

    const newMeeting: Meeting = {
      id: `mtg_${Date.now()}`,
      vslaId: meetingForm.vslaId,
      cycleId: cycle.id,
      date: meetingForm.date,
      location: meetingForm.location,
      isClosed: false,
      totalCollected: 0,
      totalLent: 0
    };

    const groupMembers = scoped.members.filter((m: any) => m.vslaId === meetingForm.vslaId);
    const initialAttendance: Attendance[] = groupMembers.map((m: any) => ({
      id: `att_${Date.now()}_${m.id}`,
      meetingId: newMeeting.id,
      memberId: m.id,
      status: AttendanceStatus.ABSENT
    }));

    setState(prev => ({
      ...prev,
      meetings: [...prev.meetings, newMeeting],
      attendance: [...prev.attendance, ...initialAttendance]
    }));
    setActiveMeeting(newMeeting);
    logAudit('MEETING_START', `Session started for VSLA ${meetingForm.vslaId} at ${meetingForm.location}`);
  };

  const updateAttendance = (memberId: string, status: AttendanceStatus) => {
    if (!activeMeeting) return;
    
    // Check if toggling to LATE for auto-fining
    const currentAtt = state.attendance.find(a => a.meetingId === activeMeeting.id && a.memberId === memberId);
    const becameLate = status === AttendanceStatus.LATE && currentAtt?.status !== AttendanceStatus.LATE;

    setState(prev => ({
      ...prev,
      attendance: prev.attendance.map(a => 
        (a.meetingId === activeMeeting.id && a.memberId === memberId) ? { ...a, status } : a
      )
    }));

    if (becameLate) {
      addTransaction({
        vslaId: activeMeeting.vslaId,
        cycleId: activeMeeting.cycleId,
        memberId,
        meetingId: activeMeeting.id,
        type: TransactionType.FINE,
        amount: 50,
        date: activeMeeting.date,
        description: 'Auto-Fine: Late to meeting',
        recordedBy: state.currentUser?.id || 'sys'
      });
      logAudit('AUTO_FINE', `Member ${memberId} fined KES 50 for late arrival.`);
    }
  };

  const meetingFinancials = useMemo(() => {
    if (!activeMeeting) return { savings: 0, fines: 0, loanRepay: 0, total: 0 };
    const txs = state.transactions.filter(t => t.meetingId === activeMeeting.id);
    const savings = txs.filter(t => t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE).reduce((a, b) => a + b.amount, 0);
    const fines = txs.filter(t => t.type === TransactionType.FINE).reduce((a, b) => a + b.amount, 0);
    const loanRepay = txs.filter(t => t.type === TransactionType.LOAN_REPAYMENT_PRINCIPAL || t.type === TransactionType.LOAN_REPAYMENT_INTEREST).reduce((a, b) => a + b.amount, 0);
    return { savings, fines, loanRepay, total: savings + fines + loanRepay };
  }, [activeMeeting, state.transactions]);

  const closeMeeting = () => {
    if (!activeMeeting) return;
    setState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === activeMeeting.id ? { ...m, isClosed: true, totalCollected: meetingFinancials.total } : m)
    }));
    setActiveMeeting(null);
    logAudit('MEETING_CLOSE', `Meeting ${activeMeeting.id} finalized with KES ${meetingFinancials.total} collected.`);
  };

  const activeMembers = useMemo(() => {
    if (!activeMeeting) return [];
    return scoped.members.filter((m: any) => m.vslaId === activeMeeting.vslaId);
  }, [activeMeeting, scoped.members]);

  const attendanceStats = useMemo(() => {
    if (!activeMeeting) return { present: 0, absent: 0, late: 0, excused: 0 };
    const meetingAttendance = state.attendance.filter(a => a.meetingId === activeMeeting.id);
    return {
      present: meetingAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length,
      absent: meetingAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length,
      late: meetingAttendance.filter(a => a.status === AttendanceStatus.LATE).length,
      excused: meetingAttendance.filter(a => a.status === AttendanceStatus.EXCUSED).length,
    };
  }, [activeMeeting, state.attendance]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Meeting Desk</h1>
          <p className="text-slate-500 font-medium">Real-time attendance and capital collection portal.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit shadow-inner">
          <button onClick={() => setActiveTab('sessions')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sessions' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Current Session</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Session Logs</button>
        </div>
      </div>

      {activeTab === 'sessions' ? (
        <>
          {!activeMeeting ? (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Provision New Session
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Select VSLA Group</label>
                  <select 
                    value={meetingForm.vslaId}
                    onChange={e => setMeetingForm({...meetingForm, vslaId: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-inner"
                  >
                    <option value="">Pick a group...</option>
                    {scoped.vslas.map((v: any) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Meeting Date</label>
                    <input type="date" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none" />
                   </div>
                   <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Location</label>
                    <input type="text" placeholder="e.g. Tree Circle" value={meetingForm.location} onChange={e => setMeetingForm({...meetingForm, location: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none" />
                   </div>
                </div>
                <button onClick={startMeeting} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98] uppercase tracking-widest">
                  Initialize Group Session
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Live Group Session</p>
                  <h3 className="text-4xl font-black tracking-tight">{scoped.vslas.find((v:any) => v.id === activeMeeting.vslaId)?.name}</h3>
                  <div className="flex gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">{activeMeeting.date}</span>
                    <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">{activeMeeting.location}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 w-full md:w-auto">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Present</p>
                    <p className="text-2xl font-black text-emerald-400">{attendanceStats.present}</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Absent</p>
                    <p className="text-2xl font-black text-rose-500">{attendanceStats.absent}</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Fines</p>
                    <p className="text-2xl font-black text-amber-500">KES {meetingFinancials.fines.toLocaleString()}</p>
                  </div>
                  <div className="text-center md:text-right flex flex-col justify-center">
                    <button onClick={closeMeeting} className="bg-rose-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/30 hover:bg-rose-700 transition-all">End Session</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Attendance & Collection Register</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Intake:</span>
                      <span className="text-sm font-black text-emerald-600">KES {meetingFinancials.total.toLocaleString()}</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-5">Verified Identity</th>
                        <th className="px-8 py-5">Session Status</th>
                        <th className="px-8 py-5 text-right">Attendance Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeMembers.map((m: any) => {
                        const att = state.attendance.find(a => a.meetingId === activeMeeting.id && a.memberId === m.id);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="text-[10px] font-black text-emerald-600 mb-0.5 tracking-widest">{m.memberKyId}</p>
                              <p className="text-base font-black text-slate-900">{m.firstName} {m.lastName}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                att?.status === AttendanceStatus.PRESENT ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                att?.status === AttendanceStatus.ABSENT ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                att?.status === AttendanceStatus.LATE ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {att?.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                {Object.values(AttendanceStatus).map(status => (
                                  <button
                                    key={status}
                                    onClick={() => updateAttendance(m.id, status)}
                                    className={`px-4 py-2.5 text-[9px] font-black rounded-xl border transition-all ${
                                      att?.status === status 
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                    }`}
                                  >
                                    {status.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Historical Session Archive</h3>
           </div>
           <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Session Date</th>
                <th className="px-8 py-5">Group Name</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5 text-right">Financial Intake</th>
                <th className="px-8 py-5 text-right">Audit State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {state.meetings.filter(m => scoped.vslas.some((v:any) => v.id === m.vslaId)).map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-900">{m.date}</td>
                  <td className="px-8 py-6 font-bold">{scoped.vslas.find((v:any) => v.id === m.vslaId)?.name}</td>
                  <td className="px-8 py-6 text-xs">{m.location}</td>
                  <td className="px-8 py-6 text-right font-black text-emerald-600">KES {m.totalCollected.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${m.isClosed ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                      {m.isClosed ? 'Finalized' : 'In Session'}
                    </span>
                  </td>
                </tr>
              ))}
              {state.meetings.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40">No session logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MeetingManagement;
