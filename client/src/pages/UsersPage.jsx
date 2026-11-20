import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, User, Check, Key } from 'lucide-react';
import { ADMIN_USER } from '../context/AuthContext';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getUsers();
        if (res.success) setUsers(res.users);
      } catch (err) {
        setUsers([ADMIN_USER]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto text-xs">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Security</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">RBAC & Users</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#2563EB]" /> User Accounts & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Enterprise roles, authentication permissions, and corporate department mappings.
        </p>
      </div>

      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#E3E9F0] border-b border-[#DDE4EC] text-[#7C8998] font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role Designation</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EC]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#E8EDF3]/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#253142]">{u.name}</div>
                  <div className="text-[10px] text-[#7C8998] font-mono">{u.employeeId || 'HR-Linked'}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[#7C8998]">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-mono">
                    {u.roleName}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#253142]">{u.department || 'Management'}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
