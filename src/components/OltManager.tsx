import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Server, 
  Layers, 
  Sliders, 
  RefreshCw,
  HardDrive,
  Activity
} from 'lucide-react';
import { OltChassis, OntDevice } from '../types';

interface OltManagerProps {
  olts: OltChassis[];
  onts: OntDevice[];
  onProvisionOnt: (newOnt: OntDevice) => void;
}

export const OltManager: React.FC<OltManagerProps> = ({
  olts,
  onts,
  onProvisionOnt
}) => {
  const [selectedOlt, setSelectedOlt] = useState<OltChassis>(olts[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newOntSn, setNewOntSn] = useState('HWTC7B44E992');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPlan, setNewPlan] = useState('Fiber Ultra 150M');
  const [newPonPort, setNewPonPort] = useState('0/1/2');

  const filteredOnts = onts.filter(ont => {
    const matchesOlt = ont.oltId === selectedOlt.id;
    const matchesSearch = 
      ont.sn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ont.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ont.ponPort.includes(searchTerm);
    return matchesOlt && matchesSearch;
  });

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;

    const created: OntDevice = {
      id: `ont-${Date.now()}`,
      sn: newOntSn,
      oltId: selectedOlt.id,
      ponPort: newPonPort,
      subscriberName: newCustomerName,
      plan: newPlan,
      rxPowerDbm: -19.4,
      txPowerDbm: 2.4,
      distanceMeters: 1480,
      status: 'online'
    };

    onProvisionOnt(created);
    setShowProvisionModal(false);
    setNewCustomerName('');
  };

  return (
    <div id="olt-manager-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            GPON / XGS-PON OLT Management & Optical Power Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Multi-vendor provisioning for Huawei, ZTE, and Fiberhome OLTs with real-time optical link budgets.
          </p>
        </div>

        <button
          id="open-provision-ont-btn"
          onClick={() => setShowProvisionModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New ONT</span>
        </button>
      </div>

      {/* OLT Chassis Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {olts.map(olt => {
          const isSelected = selectedOlt.id === olt.id;
          return (
            <div
              key={olt.id}
              id={`olt-chassis-card-${olt.id}`}
              onClick={() => setSelectedOlt(olt)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-800/90 border-purple-500/50 shadow-md shadow-purple-950/20' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-750'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{olt.name}</h3>
                    <span className="text-xs text-purple-300 font-medium">{olt.vendor} • {olt.ip}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  olt.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {olt.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">PON Ports</span>
                  <span className="text-white font-mono font-bold">{olt.activePonPorts}/{olt.totalPonPorts} Active</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Online ONTs</span>
                  <span className="text-emerald-400 font-mono font-bold">{olt.onlineOnts}/{olt.totalOnts}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ONT Registry & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Registered Optical Network Terminals (ONTs)</span>
              <span className="px-2 py-0.5 bg-slate-800 text-purple-300 rounded-md text-xs font-mono">
                {selectedOlt.name}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Monitoring RX power attenuation thresholds (standard: -8 dBm to -27 dBm).</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by SN, subscriber, or port..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 px-3">ONT SERIAL NUMBER</th>
                <th className="pb-3 px-3">SUBSCRIBER</th>
                <th className="pb-3 px-3">PON PORT</th>
                <th className="pb-3 px-3">SERVICE PLAN</th>
                <th className="pb-3 px-3">OPTICAL RX (dBm)</th>
                <th className="pb-3 px-3">DISTANCE</th>
                <th className="pb-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredOnts.length > 0 ? (
                filteredOnts.map(ont => {
                  const isLow = ont.rxPowerDbm < -27;
                  return (
                    <tr key={ont.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-cyan-300 font-bold">{ont.sn}</td>
                      <td className="py-3 px-3 text-white font-sans font-medium">{ont.subscriberName}</td>
                      <td className="py-3 px-3 text-slate-300">{ont.ponPort}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{ont.plan}</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {ont.rxPowerDbm} dBm
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{ont.distanceMeters}m</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ont.status === 'online'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : ont.status === 'low_optical'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {ont.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No ONTs found matching current filter for this OLT chassis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                1-Click Provision Discovered ONT
              </h3>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target OLT Chassis</label>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white font-mono">
                  {selectedOlt.name} ({selectedOlt.vendor})
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Unconfigured ONT Serial Number</label>
                <input
                  type="text"
                  value={newOntSn}
                  onChange={(e) => setNewOntSn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subscriber / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Global Logistics"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned PON Port</label>
                  <select
                    value={newPonPort}
                    onChange={(e) => setNewPonPort(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="0/1/1">Port 0/1/1</option>
                    <option value="0/1/2">Port 0/1/2</option>
                    <option value="0/1/3">Port 0/1/3</option>
                    <option value="0/1/4">Port 0/1/4</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Service Speed Profile</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Home Starter 50M">Home Starter (50M)</option>
                    <option value="Fiber Pro 100M">Fiber Pro (100M)</option>
                    <option value="Fiber Ultra 150M">Fiber Ultra (150M)</option>
                    <option value="Enterprise 1Gbps Direct">Enterprise (1 Gbps)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  Confirm & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
