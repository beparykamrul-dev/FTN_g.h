export type IncidentSeverity = 'critical' | 'warning' | 'info' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  source: string;
  service: string;
  severity: IncidentSeverity;
  timestamp: string;
  status: 'active' | 'mitigating' | 'approved' | 'resolved';
  description: string;
  rootCause: string;
  aiRecommendation: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  targetCommand?: string;
  affectedCustomers: number;
}

export interface FiberNode {
  id: string;
  name: string;
  type: 'CORE_ROUTER' | 'OLT_CHASSIS' | 'SPLITTER_HUB' | 'SPLICE_CLOSURE' | 'POP_STATION' | 'ONT_CLIENT';
  location: string;
  status: 'operational' | 'degraded' | 'offline';
  ipAddress?: string;
  opticalPowerRx?: number; // dBm
  opticalPowerTx?: number; // dBm
  utilizationPct: number;
  connections: string[]; // Connected node IDs
  coordinates: { x: number; y: number };
}

export interface FiberLink {
  id: string;
  fromId: string;
  toId: string;
  name: string;
  type: 'CORE_BACKBONE' | 'FEEDER_CABLE' | 'DISTRIBUTION_FIBER' | 'DROP_CABLE';
  cores: number;
  lengthKm: number;
  attenuationDb: number;
  status: 'healthy' | 'warning' | 'severed';
  otdrDistanceFault?: number; // km from source
}

export interface MikroTikRouter {
  id: string;
  name: string;
  ip: string;
  model: string;
  version: string;
  uptime: string;
  cpuLoad: number;
  memoryUsage: number;
  activePppoe: number;
  totalThroughputGbps: number;
  status: 'online' | 'warning' | 'offline';
  lastBackup: string;
}

export interface OltChassis {
  id: string;
  name: string;
  vendor: 'Huawei' | 'ZTE' | 'Fiberhome' | 'Nokia';
  model: string;
  ip: string;
  totalPonPorts: number;
  activePonPorts: number;
  totalOnts: number;
  onlineOnts: number;
  tempCelsius: number;
  status: 'online' | 'degraded' | 'offline';
}

export interface OntDevice {
  id: string;
  sn: string;
  oltId: string;
  ponPort: string;
  subscriberName: string;
  plan: string;
  rxPowerDbm: number;
  txPowerDbm: number;
  distanceMeters: number;
  status: 'online' | 'offline' | 'dying_gasp' | 'low_optical';
}

export interface Subscriber {
  id: string;
  accountNumber: string;
  name: string;
  phone: string;
  email: string;
  pppoeUser: string;
  plan: string;
  speedMbps: number;
  monthlyFee: number;
  status: 'active' | 'suspended' | 'pending';
  billingStatus: 'paid' | 'unpaid' | 'overdue';
  currentUsageGb: number;
  assignedRouter: string;
  assignedOlt: string;
  assignedPon: string;
}

export interface ServiceModule {
  id: string;
  name: string;
  category: 'Compiler' | 'Platform Core' | 'ISP Network' | 'Business' | 'Security';
  version: string;
  status: 'healthy' | 'syncing' | 'standby' | 'alert';
  uptime: string;
  requestsPerSec: number;
  latencyMs: number;
  description: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionPayload?: {
    type: 'ROUTEROS_SCRIPT' | 'OLT_PROVISION' | 'BGP_FAILOVER' | 'RATE_LIMIT_OVERRIDE' | 'COMPILER_AST';
    details: string;
    executableCommand?: string;
  };
}

export interface CompilerPipelineStage {
  id: string;
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  output?: string;
  executionTimeMs?: number;
}
