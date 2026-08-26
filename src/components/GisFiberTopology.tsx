import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Radio, 
  Search, 
  Maximize2, 
  Compass, 
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { FiberNode, FiberLink } from '../types';

interface GisFiberTopologyProps {
  nodes: FiberNode[];
  links: FiberLink[];
  onFixLink: (linkId: string) => void;
}

export const GisFiberTopology: React.FC<GisFiberTopologyProps> = ({
  nodes,
  links,
  onFixLink
}) => {
  const [selectedNode, setSelectedNode] = useState<FiberNode | null>(nodes[1] || nodes[0]);
  const [selectedLink, setSelectedLink] = useState<FiberLink | null>(links[3] || links[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isTracingOtdr, setIsTracingOtdr] = useState(false);
  const [otdrResult, setOtdrResult] = useState<string | null>(null);

  const getNodeColor = (node: FiberNode) => {
    if (node.status === 'degraded') return '#f59e0b';
    if (node.status === 'offline') return '#f43f5e';
    if (node.type === 'CORE_ROUTER') return '#38bdf8';
    if (node.type === 'OLT_CHASSIS') return '#a855f7';
    if (node.type === 'POP_STATION') return '#6366f1';
    return '#10b981';
  };

  const handleRunOtdr = (link: FiberLink) => {
    setIsTracingOtdr(true);
    setOtdrResult(null);
    setTimeout(() => {
      setIsTracingOtdr(false);
      setOtdrResult(`OTDR Backscatter Analysis on ${link.name}: Severe macro-bend / attenuation step detected at 6.204 km (Splice Box SE-12). Reflectance: -48.2 dB. Insertion loss: 8.4 dB.`);
    }, 1500);
  };

  return (
    <div id="gis-topology-view" className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            GIS Fiber Infrastructure & Optical Link Topology
          </h2>
          <p className="text-xs text-slate-400">
            Real-time geospatial mapping, optical attenuation dBm monitoring, and OTDR fault distance triangulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Filter:</span>
          {['all', 'CORE_ROUTER', 'OLT_CHASSIS', 'SPLITTER_HUB', 'ONT_CLIENT'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterType === type 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All Assets' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden min-h-[480px]">
          {/* Grid background styling */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          {/* Map legend */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-lg">
            <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-1">Optical Network Legend</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span className="text-slate-300">CCR2216 Core Gateway</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span><span className="text-slate-300">Huawei/ZTE OLT Chassis</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span className="text-slate-300">FDH Splitter / Client ONT</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span><span className="text-amber-300">High Attenuation / Fault</span></div>
          </div>

          <div className="w-full flex-1 relative flex items-center justify-center my-4">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[420px] select-none">
              {/* Fiber Links / Cables */}
              {links.map(link => {
                const sourceNode = nodes.find(n => n.id === link.fromId);
                const targetNode = nodes.find(n => n.id === link.toId);
                if (!sourceNode || !targetNode) return null;

                const isSelected = selectedLink?.id === link.id;
                const isWarning = link.status === 'warning';
                const isSevered = link.status === 'severed';

                const strokeColor = isSevered ? '#f43f5e' : isWarning ? '#f59e0b' : '#0284c7';

                return (
                  <g key={link.id} className="cursor-pointer" onClick={() => setSelectedLink(link)}>
                    {/* Shadow / Click Target */}
                    <line
                      x1={sourceNode.coordinates.x}
                      y1={sourceNode.coordinates.y}
                      x2={targetNode.coordinates.x}
                      y2={targetNode.coordinates.y}
                      stroke="transparent"
                      strokeWidth={6}
                    />
                    {/* Actual Link Line */}
                    <line
                      x1={sourceNode.coordinates.x}
                      y1={sourceNode.coordinates.y}
                      x2={targetNode.coordinates.x}
                      y2={targetNode.coordinates.y}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 1.8 : 1.2}
                      strokeDasharray={isWarning ? '2, 1' : 'none'}
                      className={isWarning ? 'animate-pulse' : ''}
                    />
                    {/* Midpoint Label */}
                    <text
                      x={(sourceNode.coordinates.x + targetNode.coordinates.x) / 2}
                      y={(sourceNode.coordinates.y + targetNode.coordinates.y) / 2 - 1.5}
                      fill={isWarning ? '#f59e0b' : '#94a3b8'}
                      fontSize="2.2"
                      textAnchor="middle"
                      className="font-mono font-medium pointer-events-none select-none"
                    >
                      {link.cores}C ({link.lengthKm}km)
                    </text>
                  </g>
                );
              })}

              {/* Fiber Nodes */}
              {nodes.map(node => {
                if (filterType !== 'all' && node.type !== filterType) return null;

                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node);

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Outer Glow on Selected or Degraded */}
                    {(isSelected || node.status === 'degraded') && (
                      <circle
                        cx={node.coordinates.x}
                        cy={node.coordinates.y}
                        r={isSelected ? 4.5 : 3.8}
                        fill={color}
                        opacity={0.25}
                        className={node.status === 'degraded' ? 'animate-ping' : ''}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.coordinates.x}
                      cy={node.coordinates.y}
                      r={node.type === 'CORE_ROUTER' ? 3.2 : node.type === 'OLT_CHASSIS' ? 2.8 : 2.2}
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth={isSelected ? 1.2 : 0.8}
                    />

                    {/* Center Dot */}
                    <circle
                      cx={node.coordinates.x}
                      cy={node.coordinates.y}
                      r={1}
                      fill={color}
                    />

                    {/* Node Name Label */}
                    <text
                      x={node.coordinates.x}
                      y={node.coordinates.y + 4.5}
                      fill="#f8fafc"
                      fontSize="2.4"
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-3">
            <span className="font-mono">Geodetic Datum: WGS84 • Live GIS Feed Active</span>
            <span className="text-cyan-400 font-medium">Click any node or link to inspect optical telemetry</span>
          </div>
        </div>

        {/* Right Column: Node & Link Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Card */}
          {selectedNode && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedNode.status === 'operational' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>Location:</span>
                  <span className="text-slate-200 font-medium">{selectedNode.location}</span>
                </div>
                {selectedNode.ipAddress && (
                  <div className="flex justify-between text-slate-400">
                    <span>IP Address:</span>
                    <span className="text-cyan-300 font-mono">{selectedNode.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Optical RX Power:</span>
                  <span className={`font-mono font-bold ${
                    (selectedNode.opticalPowerRx ?? 0) < -27 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedNode.opticalPowerRx ?? -18.5} dBm
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Capacity Utilization:</span>
                  <span className="text-slate-200 font-mono">{selectedNode.utilizationPct}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Link / OTDR Panel */}
          {selectedLink && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    {selectedLink.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedLink.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedLink.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedLink.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Core Count</span>
                  <span className="text-white font-mono font-bold">{selectedLink.cores} Fibers</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Span Length</span>
                  <span className="text-white font-mono font-bold">{selectedLink.lengthKm} km</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[11px]">Measured Attenuation Loss</span>
                  <span className={`font-mono font-bold ${
                    selectedLink.attenuationDb > 10 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedLink.attenuationDb} dB total loss
                  </span>
                </div>
              </div>

              {/* OTDR Action Trigger */}
              <div className="pt-1">
                <button
                  id={`otdr-trace-btn-${selectedLink.id}`}
                  disabled={isTracingOtdr}
                  onClick={() => handleRunOtdr(selectedLink)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 ${isTracingOtdr ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isTracingOtdr ? 'Firing OTDR Laser Pulse...' : 'Run OTDR Fault Triangulation'}</span>
                </button>
              </div>

              {otdrResult && (
                <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 leading-relaxed font-mono">
                  {otdrResult}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
