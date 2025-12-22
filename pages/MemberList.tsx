
import React, { useState } from 'react';
import { AppState, Member, MemberStatus, Gender } from '../types';
import { ICONS } from '../constants';
// Import generateKYID from App
import { generateKYID } from '../App';

interface MemberListProps {
  state: AppState;
  onAdd: (member: Omit<Member, 'id' | 'createdAt'>) => void;
}

const MemberList: React.FC<MemberListProps> = ({ state, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    vslaId: '',
    firstName: '',
    lastName: '',
    gender: Gender.FEMALE,
    phone: '',
    nationalId: '',
    dateOfBirth: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: MemberStatus.ACTIVE,
  });

  const filteredMembers = state.members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    m.nationalId.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vslaId) return alert('Please select a VSLA');

    // Check if member already exists in the system to maintain KYID consistency across enrollments
    const existingMember = state.members.find(m => m.nationalId === formData.nationalId || m.phone === formData.phone);
    const memberKyId = existingMember ? existingMember.memberKyId : generateKYID('KYM', state.members.length, 4);

    // Fix: Pass missing memberKyId, tenantId and role to satisfy the Omit<Member, 'id' | 'createdAt'> type requirement
    onAdd({ 
      ...formData, 
      tenantId: state.currentTenantId, 
      role: 'Member',
      memberKyId: memberKyId
    });
    setShowForm(false);
    setFormData({ ...formData, firstName: '', lastName: '', nationalId: '', phone: '', dateOfBirth: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Member Directory</h1>
          <p className="text-gray-500">Register and manage individual profiles across all VSLAs.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#1E7F43] text-white rounded-lg flex items-center gap-2 hover:bg-[#156233]"
        >
          <ICONS.Plus /> {showForm ? 'Cancel' : 'Register Member'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">VSLA Group</label>
              <select 
                required
                className="w-full px-4 py-2 border rounded-lg outline-none"
                value={formData.vslaId}
                onChange={e => setFormData({ ...formData, vslaId: e.target.value })}
              >
                <option value="">Select VSLA...</option>
                {state.vslas.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">National ID</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.nationalId} onChange={e => setFormData({ ...formData, nationalId: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select className="w-full px-4 py-2 border rounded-lg" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}>
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select className="w-full px-4 py-2 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as MemberStatus })}>
                {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-[#1E7F43] text-white font-bold rounded-lg hover:bg-[#156233]">
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1E7F43]"
            placeholder="Search by name or national ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Member Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">VSLA Group</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID / Phone</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{member.firstName} {member.lastName}</div>
                  <div className="text-xs text-gray-400">{member.gender}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {state.vslas.find(v => v.id === member.vslaId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{member.nationalId}</div>
                  <div className="text-xs text-gray-500">{member.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    member.status === MemberStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                    member.status === MemberStatus.DORMANT ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
