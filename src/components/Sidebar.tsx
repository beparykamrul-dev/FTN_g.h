import React from 'react';
import { 
  Activity, 
  MapPin, 
  Cpu, 
  Radio, 
  Bot, 
  Users, 
  FileCode2, 
  Layers, 
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  incidentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab,
  incidentCount 
}) => {
  const menuItems = [
    {
      id: 'noc',
      label: 'Smart NOC & Telemetry',
      icon: Activity,
      badge: incidentCount > 0 ? incidentCount.toString() : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'gis',
      label: 'GIS Fiber Topology',
      icon: MapPin,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'mikrotik',
      label: 'MikroTik Auto Control',
      icon: Cpu,
      badge: '4 RTR',
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    {
      id: 'olt',
      label: 'OLT & PON Provisioning',
      icon: Radio,
      badge: '3 OLT',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'ai-assistant',
      label: 'AI Network Assistant',
      icon: Bot,
      badge: 'Agentic',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
    },
    {
      id: 'subscribers',
      label: 'Subscribers & Billing',
      icon: Users,
      badge: null
    },
    {
      id: 'compiler',
      label: 'Conversation Compiler',
      icon: FileCode2,
      badge: 'Pipeline',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'services',
      label: 'Microservices Matrix',
      icon: Layers,
      badge: '28 Srv',
      badgeColor: 'bg-slate-700 text-slate-300'
    }
  ];

  return (
    <aside id="ftn-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
          Operations Core
        </div>
        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-200">Zero-Trust mTLS</div>
            <div className="text-slate-400 text-[11px]">Audit Policy: Enforced</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
