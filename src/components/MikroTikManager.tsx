import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Shield, 
  Wifi, 
  RefreshCw, 
  Play, 
  HardDrive, 
  Server, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { MikroTikRouter } from '../types';

interface MikroTikManagerProps {
  routers: MikroTikRouter[];
  onExecuteScript: (routerId: string, command: string) => void;
}

export const MikroTikManager: React.FC<MikroTikManagerProps> = ({
  routers,
  onExecuteScript
}) => {
  const [selectedRouter, setSelectedRouter] = useState<MikroTikRouter>(routers[0]);
  const [cliInput, setCliInput] = useState<string>('/interface/pppoe-server/print stats');
  const [cliLogs, setCliLogs] = useState<string[]>([
    '[admin@HQ-CCR2216-MAIN] > /interface/pppoe-server/print stats',
    'Flags: D - dynamic, X - disabled, R - running',
    ' #   NAME          USER                  SERVICE   CALLER-ID        IP-ADDRESS     UPTIME',
    ' 0 DR pppoe-in-01   rahman_corp_500m      FTN-GPON  48:8F:5A:12:09:41 103.145.72.44  14d 06:12:09',
    ' 1 DR pppoe-in-02   vertex_office_100m    FTN-GPON  70:B3:D5:19:88:21 103.145.72.82  02d 18:40:11',
    ' 2 DR pppoe-in-03   creative_250m_pppoe   FTN-GPON  E4:AA:EC:90:11:02 103.145.72.90  08d 22:15:30'
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunCommand = () => {
    if (!cliInput.trim()) return;
    setIsRunning(true);
    const cmd = cliInput;
    setCliLogs(prev => [...prev, `[admin@${selectedRouter.name}] > ${cmd}`]);

    setTimeout(() => {
      setIsRunning(false);
      let output = '';
      if (cmd.includes('bgp')) {
        output = 'BGP Connection status: Established | Peering AS2914 (NTT) | Prefixes: 942,108 routes received.';
      } else if (cmd.includes('queue') || cmd.includes('limit')) {
        output = 'Simple Queue updated: Target speed profile adjusted successfully. Bucket tokens refreshed.';
      } else if (cmd.includes('firewall') || cmd.includes('filter')) {
        output = 'Firewall filter rule [14] added to chain=forward action=drop protocol=tcp dst-port=445.';
      } else {
        output = `Command executed successfully on ${selectedRouter.ip} (Response time: 4ms).`;
      }
      setCliLogs(prev => [...prev, output]);
    }, 600);
  };

  const copyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div id="mikrotik-manager-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            MikroTik RouterOS Auto Control & BRAS Orchestration
          </h2>
          <p className="text-xs text-slate-400">
            Direct API-SSL RouterOS management, PPPoE queues, BGP peering policy, and firewall automation.
          </p>
        </div>
      </div>

      {/* Router Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {routers.map(rtr => {
          const isSelected = selectedRouter.id === rtr.id;
          return (
            <div
              key={rtr.id}
              id={`router-card-${rtr.id}`}
              onClick={() => setSelectedRouter(rtr)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-800/90 border-blue-500/50 shadow-md shadow-blue-950/20' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-750'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{rtr.name}</h3>
                    <span className="font-mono text-xs text-cyan-400">{rtr.ip}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  rtr.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {rtr.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Hardware Model:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[150px]">{rtr.model}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CPU / RAM:</span>
                  <span className="text-slate-200 font-mono">{rtr.cpuLoad}% CPU • {rtr.memoryUsage}% RAM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active PPPoE:</span>
                  <span className="text-blue-400 font-mono font-bold">{rtr.activePppoe} sessions</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Throughput:</span>
                  <span className="text-emerald-400 font-mono font-bold">{rtr.totalThroughputGbps} Gbps</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive CLI Console & Script Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CLI Terminal */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200 font-bold">RouterOS SSL Terminal — {selectedRouter.name} ({selectedRouter.ip})</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">API-SSL Connected</span>
          </div>

          {/* Logs scroll area */}
          <div className="h-64 overflow-y-auto py-3 space-y-1.5 text-xs text-slate-300">
            {cliLogs.map((log, index) => (
              <div key={index} className={log.startsWith('[admin') ? 'text-cyan-400 font-bold' : log.includes('Flags') ? 'text-slate-500' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>

          {/* Input line */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 text-xs font-bold shrink-0">[admin@{selectedRouter.name}] &gt;</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
              className="flex-1 bg-transparent text-xs text-white focus:outline-none border-none font-mono"
              placeholder="Type RouterOS command (e.g. /routing bgp print)..."
            />
            <button
              id="run-mikrotik-cmd-btn"
              disabled={isRunning}
              onClick={handleRunCommand}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Run</span>
            </button>
          </div>
        </div>

        {/* Quick Automation Templates */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Quick ISP Automation Scripts</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Rate Limit Simple Queue Profile</span>
                <button 
                  onClick={() => setCliInput('/queue/simple/add name="Enterprise-Boost" max-limit=500M/500M target=103.145.72.44/32')}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Load
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Instantly provision high-priority QoS bucket for VIP customer.</p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">BGP Peering Prefix Filter Refresh</span>
                <button 
                  onClick={() => setCliInput('/routing/filter/rule/add chain=BGP-IN-NTT action=accept prefix=103.145.72.0/22')}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Load
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Broadcast customer subnets to international upstream providers.</p>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Flush ARP & Dead PPPoE Sessions</span>
                <button 
                  onClick={() => setCliInput('/ip/arp/remove [find dynamic=yes]; /interface/pppoe-server/remove [find !running]')}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Load
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Prune stale dynamic entries to reduce memory overhead.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
