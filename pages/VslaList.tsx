
import React, { useState } from 'react';
import { AppState, Vsla } from '../types';
import { ICONS } from '../constants';

interface VslaListProps {
  state: AppState;
  onAdd: (vsla: Omit<Vsla, 'id' | 'createdAt'>) => void;
}

const VslaList: React.FC<VslaListProps> = ({ state, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: 'Kenya',
    county: '',
    constituency: '',
    ward: '',
    village: '',
    registrationDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate an invite code to satisfy the Vsla interface requirements
    const inviteCode = `${formData.name.substring(0, 3).toUpperCase()}-${formData.county.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    // Pass country and constituency along with other fields to comply with Omit<Vsla, 'id' | 'createdAt'>
    // Fix: Added missing hasInvestmentModule property
    onAdd({ 
      ...formData, 
      tenantId: state.currentTenantId, 
      inviteCode,
      status: 'active',
      hasInvestmentModule: false
    });
    setShowForm(false);
    setFormData({ 
      name: '', 
      country: 'Kenya', 
      county: '', 
      constituency: '', 
      ward: '', 
      village: '', 
      registrationDate: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">VSLA Groups</h1>
          <p className="text-gray-500">Manage registered Village Savings and Loans Associations.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#1E7F43] text-white rounded-lg flex items-center gap-2 hover:bg-[#156233]"
        >
          <ICONS.Plus /> {showForm ? 'Cancel' : 'New VSLA'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Group Name</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amani Savings Group"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">County</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.county}
                onChange={e => setFormData({ ...formData, county: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Constituency</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.constituency}
                onChange={e => setFormData({ ...formData, constituency: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Ward</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.ward}
                onChange={e => setFormData({ ...formData, ward: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Village</label>
              <input 
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.village}
                onChange={e => setFormData({ ...formData, village: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Registration Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E7F43] outline-none"
                value={formData.registrationDate}
                onChange={e => setFormData({ ...formData, registrationDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-[#F4C430] text-[#1E7F43] font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                Save VSLA Group
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Group Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reg. Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.vslas.map((vsla) => (
              <tr key={vsla.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{vsla.name}</div>
                  <div className="text-xs text-gray-400">ID: {vsla.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{vsla.village}, {vsla.ward}</div>
                  <div className="text-xs text-gray-400">{vsla.constituency}, {vsla.county}, {vsla.country}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {state.members.filter(m => m.vslaId === vsla.id).length} Members
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{vsla.registrationDate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#1E7F43] hover:text-[#156233] text-sm font-medium mr-4">View</button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VslaList;
