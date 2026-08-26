import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SmartNocDashboard } from './components/SmartNocDashboard';
import { GisFiberTopology } from './components/GisFiberTopology';
import { MikroTikManager } from './components/MikroTikManager';
import { OltManager } from './components/OltManager';
import { AiAssistant } from './components/AiAssistant';
import { SubscriberBilling } from './components/SubscriberBilling';
import { CompilerPipelineView } from './components/CompilerPipelineView';
import { MicroservicesMatrix } from './components/MicroservicesMatrix';

import { 
  INITIAL_INCIDENTS, 
  FIBER_NODES, 
  FIBER_LINKS, 
  MIKROTIK_ROUTERS, 
  OLT_CHASSIS_LIST, 
  ONT_DEVICES, 
  SUBSCRIBERS, 
  SERVICE_MODULES,
  INITIAL_AI_CHAT 
} from './data/mockData';
import { Incident, FiberNode, FiberLink, MikroTikRouter, OltChassis, OntDevice, Subscriber, AiChatMessage } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('noc');

  // Application State
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [nodes, setNodes] = useState<FiberNode[]>(FIBER_NODES);
  const [links, setLinks] = useState<FiberLink[]>(FIBER_LINKS);
  const [routers, setRouters] = useState<MikroTikRouter[]>(MIKROTIK_ROUTERS);
  const [olts, setOlts] = useState<OltChassis[]>(OLT_CHASSIS_LIST);
  const [onts, setOnts] = useState<OntDevice[]>(ONT_DEVICES);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SUBSCRIBERS);
  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>(INITIAL_AI_CHAT);

  // Live system throughput ticker simulation
  const [systemLoad, setSystemLoad] = useState({
    cpu: 38,
    bandwidth: 67.4,
    pppoe: 7370
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => ({
        cpu: Math.min(85, Math.max(25, prev.cpu + (Math.random() * 4 - 2))),
        bandwidth: Math.min(100, Math.max(50, prev.bandwidth + (Math.random() * 1.5 - 0.75))),
        pppoe: prev.pppoe + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleApproveMitigation = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status: 'resolved' };
      }
      return inc;
    }));

    // If it was the OLT optical incident, restore the node and link
    if (incidentId === 'INC-8492') {
      setNodes(prev => prev.map(n => {
        if (n.id === 'node-olt-1' || n.id === 'node-fdh-1' || n.id === 'node-se-1') {
          return { ...n, status: 'operational', opticalPowerRx: -18.2 };
        }
        return n;
      }));

      setLinks(prev => prev.map(l => {
        if (l.id === 'link-olt1-se1' || l.id === 'link-se1-fdh1') {
          return { ...l, status: 'healthy', attenuationDb: 4.2 };
        }
        return l;
      }));

      setOlts(prev => prev.map(o => {
        if (o.id === 'olt-1') return { ...o, status: 'online' };
        return o;
      }));
    }
  };

  const handleSimulateIncident = () => {
    const newInc: Incident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'BGP Upstream Transit Latency Spike (Airtel IX - 114ms)',
      source: 'RTR-CORE-CCR2216-MAIN',
      service: 'services/mikrotik',
      severity: 'warning',
      timestamp: 'Just now',
      status: 'active',
      description: 'Transit link latency exceeded 80ms SLA threshold on AS9498 peering interface.',
      rootCause: 'International submarine cable SMW-5 maintenance route flap.',
      aiRecommendation: 'Shift BGP weight to Cogent Communications AS174 and enable BFD fast-reroute.',
      riskScore: 'LOW',
      targetCommand: '/routing bgp connection set [find name="Airtel-Peer"] disabled=yes; /routing bgp connection set [find name="Cogent-Backup"] priority=1',
      affectedCustomers: 640
    };

    setIncidents(prev => [newInc, ...prev]);
  };

  const handleFixLink = (linkId: string) => {
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, status: 'healthy' } : l));
  };

  const handleExecuteScript = (routerId: string, command: string) => {
    // Simulated RouterOS execution
  };

  const handleProvisionOnt = (newOnt: OntDevice) => {
    setOnts(prev => [newOnt, ...prev]);
    setOlts(prev => prev.map(o => {
      if (o.id === newOnt.oltId) {
        return { ...o, totalOnts: o.totalOnts + 1, onlineOnts: o.onlineOnts + 1 };
      }
      return o;
    }));
  };

  const handleToggleStatus = (subId: string) => {
    setSubscribers(prev => prev.map(sub => {
      if (sub.id === subId) {
        const nextStatus = sub.status === 'active' ? 'suspended' : 'active';
        const nextBilling = nextStatus === 'active' ? 'paid' : sub.billingStatus;
        return { ...sub, status: nextStatus, billingStatus: nextBilling };
      }
      return sub;
    }));
  };

  const handleSuspendOverdue = () => {
    setSubscribers(prev => prev.map(sub => {
      if (sub.billingStatus === 'overdue') {
        return { ...sub, status: 'suspended' };
      }
      return sub;
    }));
  };

  const handleSendMessage = (text: string) => {
    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyContent = '';
      let actionPayload = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('feeder') || lower.includes('otdr') || lower.includes('optical')) {
        replyContent = `🛰️ **FTNDNS OTDR Telemetry Analysis**:
- Optical path analysis on **Feeder F-04**: An attenuation step of **+10.9 dB** was detected at distance **6.204 km**.
- Closest field enclosure is **Splice Box SE-12 (Pole 44B)**.
- Suggested automated remediation: Adjust OLT TX power gain (+1.5 dBm) and activate standby core pair #24.`;
        actionPayload = {
          type: 'OLT_PROVISION' as const,
          details: 'Switch Feeder F-04 to Standby Dark Core #24',
          executableCommand: `interface gpon 0/1 port 4 optical-power adjust-tx +1.5dBm\ninterface switch-path core 24 target-enclosure SE-12`
        };
      } else if (lower.includes('bgp') || lower.includes('failover') || lower.includes('peering')) {
        replyContent = `🌐 **RouterOS v7 BGP Failover Script Generator**:
- Detected upstream transit congestion on **AS2914 (NTT)**.
- Recommending dynamic local-preference demotion to reroute default route prefixes to **Cogent (AS174)**.`;
        actionPayload = {
          type: 'ROUTEROS_SCRIPT' as const,
          details: 'Dynamic BGP Local-Pref Reroute to Backup Peering',
          executableCommand: `/routing/bgp/connection/set [find name="NTT-100G-Primary"] local-preference=80\n/routing/bgp/connection/set [find name="Cogent-Backup"] local-preference=150\n/routing/bfd/session/enable [find name="Cogent-BFD"]`
        };
      } else if (lower.includes('rogue') || lower.includes('jamming')) {
        replyContent = `🛑 **Rogue ONT Continuous Emission Isolation Protocol**:
- ONT emitting unslotted continuous 1310nm carrier light detected on **OLT-DHK-ZTE-02 Port 1/2/3**.
- Immediate hardware isolation script generated to save the remaining 47 ONTs on the splitter tree.`;
        actionPayload = {
          type: 'OLT_PROVISION' as const,
          details: 'Forced Rogue Laser-Off & Port Isolation',
          executableCommand: `gpon\nonu isolate-rogue port 1/2/3 ont-id 14 force-laser-off duration permanent\ncommit`
        };
      } else {
        replyContent = `🤖 **FTNDNS AI Diagnostic Report**:
- Analyzed network telemetry across 4 MikroTik CCRs and 3 Huawei/ZTE OLT chassis.
- All systems operational with 99.98% RADIUS authentication rate and 67.4 Gbps aggregate throughput.
- You can execute automated configuration scripts, inspect GIS fiber loss, or simulate network anomalies from the NOC dashboard.`;
      }

      const assistantMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload
      };

      setChatHistory(prev => [...prev, assistantMsg]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeIncidents={incidents}
        onSelectTab={setActiveTab}
        systemLoad={systemLoad}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          incidentCount={incidents.filter(i => i.status !== 'resolved').length}
        />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'noc' && (
              <SmartNocDashboard
                incidents={incidents}
                onApproveMitigation={handleApproveMitigation}
                onSimulateIncident={handleSimulateIncident}
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'gis' && (
              <GisFiberTopology
                nodes={nodes}
                links={links}
                onFixLink={handleFixLink}
              />
            )}

            {activeTab === 'mikrotik' && (
              <MikroTikManager
                routers={routers}
                onExecuteScript={handleExecuteScript}
              />
            )}

            {activeTab === 'olt' && (
              <OltManager
                olts={olts}
                onts={onts}
                onProvisionOnt={handleProvisionOnt}
              />
            )}

            {activeTab === 'ai-assistant' && (
              <AiAssistant
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
              />
            )}

            {activeTab === 'subscribers' && (
              <SubscriberBilling
                subscribers={subscribers}
                onToggleStatus={handleToggleStatus}
                onSuspendOverdue={handleSuspendOverdue}
              />
            )}

            {activeTab === 'compiler' && (
              <CompilerPipelineView />
            )}

            {activeTab === 'services' && (
              <MicroservicesMatrix
                services={SERVICE_MODULES}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default App;
