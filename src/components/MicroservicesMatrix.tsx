import React, { useState } from 'react';
import { 
  Layers, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Search, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ServiceModule } from '../types';

interface MicroservicesMatrixProps {
  services: ServiceModule[];
}

export const MicroservicesMatrix: React.FC<MicroservicesMatrixProps> = ({ services }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = services.filter(srv => {
    const matchesSearch = 
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && srv.category === categoryFilter;
  });

  const categories = ['all', 'Compiler', 'Platform Core', 'ISP Network', 'Business', 'Security'];

  return (
    <div id="microservices-matrix-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            FTNDNS Canonical Microservices Matrix & Service Mesh
          </h2>
          <p className="text-xs text-slate-400">
            Real-time health, latency, and throughput across all 28 canonical platform service domains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Services:</span>
          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono font-bold">
            {services.length} Canonical Microservices
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search microservices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 w-64 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Microservices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(srv => {
          const isAlert = srv.status === 'alert';
          return (
            <div
              key={srv.id}
              className={`p-4 rounded-2xl border transition-all ${
                isAlert 
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-sm shadow-amber-950/20' 
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                    {srv.category}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono mt-0.5">{srv.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  srv.status === 'healthy' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {srv.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{srv.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block font-sans">UPTIME</span>
                  <span className="text-emerald-400 font-semibold">{srv.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-sans">THROUGHPUT</span>
                  <span className="text-slate-200 font-semibold">{srv.requestsPerSec} rps</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-sans">LATENCY</span>
                  <span className={`font-semibold ${srv.latencyMs > 30 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {srv.latencyMs}ms
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
