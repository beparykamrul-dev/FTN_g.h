import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CreditCard, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Lock, 
  Unlock,
  Filter
} from 'lucide-react';
import { Subscriber } from '../types';

interface SubscriberBillingProps {
  subscribers: Subscriber[];
  onToggleStatus: (subId: string) => void;
  onSuspendOverdue: () => void;
}

export const SubscriberBilling: React.FC<SubscriberBillingProps> = ({
  subscribers,
  onToggleStatus,
  onSuspendOverdue
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = subscribers.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.pppoeUser.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'overdue') return matchesSearch && sub.billingStatus === 'overdue';
    if (statusFilter === 'active') return matchesSearch && sub.status === 'active';
    if (statusFilter === 'suspended') return matchesSearch && sub.status === 'suspended';
    return matchesSearch;
  });

  const totalRevenue = subscribers
    .filter(s => s.billingStatus === 'paid')
    .reduce((acc, curr) => acc + curr.monthlyFee, 0);

  const overdueCount = subscribers.filter(s => s.billingStatus === 'overdue').length;

  const handleGenerateInvoice = (sub: Subscriber) => {
    setToastMessage(`Invoice #INV-2026-${sub.accountNumber.split('-').pop()} generated for ${sub.name} (Amount: ৳${sub.monthlyFee.toLocaleString()})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div id="subscriber-billing-view" className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Summary KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
            <span>COLLECTED REVENUE (MTD)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Automated bKash / Card reconciliation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
            <span>ACTIVE SUBSCRIBERS</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {subscribers.filter(s => s.status === 'active').length} <span className="text-sm text-slate-400 font-normal">/ {subscribers.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">98.4% retention rate</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
            <span>OVERDUE ACCOUNTS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {overdueCount} <span className="text-sm text-slate-400 font-normal">due for cut-off</span>
          </div>
          <div className="mt-2">
            <button
              id="suspend-overdue-btn"
              onClick={onSuspendOverdue}
              className="text-[11px] text-rose-400 hover:underline font-bold cursor-pointer"
            >
              Auto-Suspend Overdue Now &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Subscriber Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Subscriber & Radius PPPoE User Directory
            </h3>
            <p className="text-xs text-slate-400">Real-time bandwidth profiles and billing gateway integration.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['all', 'active', 'overdue', 'suspended'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
                    statusFilter === st ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search account or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 w-56 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 px-3">ACCOUNT NO.</th>
                <th className="pb-3 px-3">SUBSCRIBER</th>
                <th className="pb-3 px-3">PPPoE USERNAME</th>
                <th className="pb-3 px-3">PLAN SPEED</th>
                <th className="pb-3 px-3">MONTHLY FEE</th>
                <th className="pb-3 px-3">BILLING</th>
                <th className="pb-3 px-3">RADIUS STATUS</th>
                <th className="pb-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map(sub => {
                const isOverdue = sub.billingStatus === 'overdue';
                const isSuspended = sub.status === 'suspended';

                return (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-cyan-300 font-bold">{sub.accountNumber}</td>
                    <td className="py-3 px-3 text-white font-sans font-medium">{sub.name}</td>
                    <td className="py-3 px-3 text-slate-300">{sub.pppoeUser}</td>
                    <td className="py-3 px-3 text-slate-200 font-sans">{sub.speedMbps} Mbps ({sub.plan})</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">৳{sub.monthlyFee.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sub.billingStatus === 'paid' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : isOverdue 
                          ? 'bg-rose-500/20 text-rose-300' 
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sub.billingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        !isSuspended ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2 font-sans">
                      <button
                        onClick={() => handleGenerateInvoice(sub)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                        title="Generate PDF Invoice"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => onToggleStatus(sub.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          isSuspended 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
