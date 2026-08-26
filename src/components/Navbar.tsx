import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Bell, 
  Search, 
  Terminal, 
  Cpu, 
  Server
} from 'lucide-react';
import { Incident } from '../types';

interface NavbarProps {
  activeIncidents: Incident[];
  onSelectTab: (tab: string) => void;
  systemLoad: { cpu: number; bandwidth: number; pppoe: number };
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeIncidents, 
  onSelectTab,
  systemLoad 
}) => {
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const warningCount = activeIncidents.filter(i => i.severity === 'warning' && i.status !== 'resolved').length;

  return (
    <header id="ftn-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-mono">FTNDNS<span className="text-cyan-400">_AI</span></span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">Autonomous NOC</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Fiber & ISP Autonomous Operations Control Plane</p>
          </div>
        </div>

        {/* Live System Stats Ticker */}
        <div className="hidden xl:flex items-center gap-6 text-xs bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Throughput:</span>
            <span className="font-mono font-semibold text-emerald-400">{systemLoad.bandwidth.toFixed(1)} Gbps</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Active PPPoE:</span>
            <span className="font-mono font-semibold text-blue-300">{systemLoad.pppoe.toLocaleString()}</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Core CPU:</span>
            <span className={`font-mono font-semibold ${systemLoad.cpu > 70 ? 'text-amber-400' : 'text-slate-200'}`}>{systemLoad.cpu}%</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium text-[11px]">AI Loop Active</span>
          </div>
        </div>

        {/* Actions & Alerts */}
        <div className="flex items-center gap-2.5">
          {/* Quick incident alert pill */}
          <button 
            id="nav-alert-btn"
            onClick={() => onSelectTab('noc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              criticalCount > 0 
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/40 hover:bg-rose-500/20 animate-pulse' 
                : warningCount > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{criticalCount > 0 ? `${criticalCount} Critical` : `${warningCount} Warning`}</span>
          </button>

          {/* Quick AI Assistant Button */}
          <button
            id="nav-ai-assistant-btn"
            onClick={() => onSelectTab('ai-assistant')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI Ops</span>
          </button>
        </div>
      </div>
    </header>
  );
};
