import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Play, 
  Cpu, 
  Activity, 
  Search, 
  RefreshCw, 
  Filter, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  Terminal,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Incident } from '../types';

interface SmartNocDashboardProps {
  incidents: Incident[];
  onApproveMitigation: (incidentId: string) => void;
  onSimulateIncident: () => void;
  onSelectTab: (tab: string) => void;
}

export const SmartNocDashboard: React.FC<SmartNocDashboardProps> = ({
  incidents,
  onApproveMitigation,
  onSimulateIncident,
  onSelectTab
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'all') return true;
    return inc.severity === filterSeverity;
  });

  const handleExecute = (inc: Incident) => {
    setExecutingId(inc.id);
    setTimeout(() => {
      onApproveMitigation(inc.id);
      setExecutingId(null);
    }, 1200);
  };

  return (
    <div id="smart-noc-view" className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>CORE THROUGHPUT</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">67.4 <span className="text-sm font-normal text-slate-400">Gbps</span></div>
          <div className="mt-2 text-xs flex items-center gap-1.5 text-emerald-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>+8.2% peak evening traffic</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>ACTIVE PPPoE SESSIONS</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">7,370 <span className="text-sm font-normal text-slate-400">users</span></div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Radius Auth: 99.98%</span>
            <span className="text-blue-400">4 BRAS Routers</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>OPTICAL PON HEALTH</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">96.8% <span className="text-sm font-normal text-slate-400">nominal</span></div>
          <div className="mt-2 text-xs text-amber-400/90 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>1 Port Low Optical (-29.4 dBm)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>AI AUTONOMOUS MITIGATION</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">14 <span className="text-sm font-normal text-slate-400">actions today</span></div>
          <div className="mt-2 text-xs text-emerald-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero false-positive reroutes</span>
          </div>
        </div>
      </div>

      {/* Control Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Smart NOC Real-Time Incident Triage
          </h2>
          <p className="text-xs text-slate-400">
            Autonomous anomaly correlation across MikroTik CCRs, Huawei & ZTE OLTs, and GIS Fiber loops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="simulate-incident-btn"
            onClick={onSimulateIncident}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Anomaly</span>
          </button>

          <button
            id="open-gis-map-btn"
            onClick={() => onSelectTab('gis')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View GIS Topology</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Incident List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incidents List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">Filter Incidents:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {['all', 'critical', 'warning', 'info'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase transition cursor-pointer ${
                    filterSeverity === sev
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCritical = inc.severity === 'critical';
              const isWarning = inc.severity === 'warning';

              return (
                <div
                  key={inc.id}
                  id={`incident-card-${inc.id}`}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-xl ${
                        isCritical 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : isWarning 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {isCritical ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{inc.id}</span>
                          <span className="text-[11px] text-slate-400">• {inc.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inc.status === 'resolved' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : inc.status === 'approved' || inc.status === 'mitigating'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mt-1">{inc.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-300">{inc.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Risk: <strong className={inc.riskScore === 'HIGH' ? 'text-rose-400' : inc.riskScore === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}>{inc.riskScore}</strong></span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Remediation & Command Detail */}
        <div className="lg:col-span-5">
          {selectedIncident ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedIncident.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedIncident.title}</h3>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  selectedIncident.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedIncident.severity}
                </div>
              </div>

              {/* Root Cause Card */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  CORRELATED ROOT CAUSE
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedIncident.rootCause}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Impacted subscribers: <strong className="text-slate-200">{selectedIncident.affectedCustomers} active PPPoE sessions</strong>
                </div>
              </div>

              {/* AI Autonomous Recommendation */}
              <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/30 p-4 rounded-xl border border-cyan-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">FTN AI Autonomous Proposal</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    selectedIncident.riskScore === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : selectedIncident.riskScore === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    SAFETY RISK: {selectedIncident.riskScore}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selectedIncident.aiRecommendation}</p>

                {selectedIncident.targetCommand && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-slate-400" />
                      Target Hardware Script (VRP / RouterOS):
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                      {selectedIncident.targetCommand}
                    </div>
                  </div>
                )}

                {/* Approval Button Gate */}
                <div className="pt-2">
                  {selectedIncident.status === 'resolved' ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mitigation Executed & Verified</span>
                    </div>
                  ) : (
                    <button
                      id={`approve-action-btn-${selectedIncident.id}`}
                      disabled={executingId === selectedIncident.id}
                      onClick={() => handleExecute(selectedIncident)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                      {executingId === selectedIncident.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executing Autonomous Safe Script...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Approve & Execute Closed-Loop Remediation</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">Select an incident from the triage feed to view AI mitigation controls.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
