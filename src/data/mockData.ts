import { 
  FiberNode, 
  FiberLink, 
  Incident, 
  MikroTikRouter, 
  OltChassis, 
  OntDevice, 
  Subscriber, 
  ServiceModule,
  AiChatMessage
} from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-8492',
    title: 'PON Port 0/1/4 Optical Attenuation Anomaly (-29.4 dBm)',
    source: 'OLT-DHK-CORE-01 (Huawei MA5800)',
    service: 'services/olt',
    severity: 'critical',
    timestamp: '2 mins ago',
    status: 'active',
    description: 'High optical insertion loss detected on PON Frame 0 Slot 1 Port 4. 28 subscribers experiencing intermittent packet drops. Possible bend in Feeder Cable F-04 near Splice Enclosure SE-12.',
    rootCause: 'Physical fiber macro-bending or dirty SC/APC connector at Fiber Distribution Hub FDH-North.',
    aiRecommendation: 'Execute automated optical power boost on SFP+ module, reroute high-priority B2B traffic via backup feeder F-04B, and dispatch field tech with OTDR kit to SE-12.',
    riskScore: 'MEDIUM',
    targetCommand: 'interface gpon port 0/1/4 optical-power adjust tx-gain +1.5dBm && link-failover switch F-04B',
    affectedCustomers: 28,
  },
  {
    id: 'INC-8491',
    title: 'BGP Upstream Congestion — NTT Transmit at 96.8% Capacity',
    source: 'RTR-CORE-CCR2216-01',
    service: 'services/mikrotik',
    severity: 'warning',
    timestamp: '14 mins ago',
    status: 'mitigating',
    description: 'International transit link NTT Communications (100G SFP28) approaching maximum capacity. Latency spike to 84ms on Singapore IX route.',
    rootCause: 'Unexpected heavy CDN cache-miss traffic surge on AS2914 peering session.',
    aiRecommendation: 'Shift AS174 Cogent transit weight via BGP Local-Pref manipulation (set local-preference 200 for CDN prefixes) to rebalance load.',
    riskScore: 'LOW',
    targetCommand: '/routing/bgp/connection/set [find name="NTT-100G-Primary"] local-preference=90; /routing/bgp/connection/set [find name="Cogent-Backup"] local-preference=150',
    affectedCustomers: 1420,
  },
  {
    id: 'INC-8488',
    title: 'Rogue ONT Emitting Continuous Continuous Wave (CW) Jamming',
    source: 'OLT-CTG-DIST-02 (ZTE C320)',
    service: 'services/autonomous-network',
    severity: 'critical',
    timestamp: '38 mins ago',
    status: 'approved',
    description: 'A faulty third-party ONT on PON port 1/2/3 is transmitting unslotted continuous 1310nm laser light, blinding the OLT receiver for all 48 paired ONTs on the splitter tree.',
    rootCause: 'Hardware laser diode failure on ONT SN: HWTC9A88F102.',
    aiRecommendation: 'Autonomous optical isolation: disable transmitter via Dying Gasp quarantine protocol and shut down port emission window.',
    riskScore: 'HIGH',
    targetCommand: 'gpon onu isolate-rogue port 1/2/3 ont-id 14 force-laser-off duration permanent',
    affectedCustomers: 48,
  },
  {
    id: 'INC-8475',
    title: 'PPPoE RADIUS Auth Latency Exceeding Threshold (340ms)',
    source: 'AUTH-IAM-GW',
    service: 'services/auth',
    severity: 'info',
    timestamp: '1 hour ago',
    status: 'resolved',
    description: 'Peak morning reconnect storm caused RADIUS response queue to temporarily delay authentication by 340ms.',
    rootCause: 'Connection pool saturation on secondary Redis token cache.',
    aiRecommendation: 'Auto-scaled RADIUS worker pods from 4 to 8 instances; cleared stale session keys.',
    riskScore: 'LOW',
    targetCommand: 'systemctl restart radius-pool-worker@* && redis-cli UNLINK "auth:temp:*',
    affectedCustomers: 0,
  }
];

export const FIBER_NODES: FiberNode[] = [
  {
    id: 'node-core-1',
    name: 'CCR2216 Core Gateway (HQ-DHK)',
    type: 'CORE_ROUTER',
    location: 'Central Datacenter Tier-3 (DHK)',
    status: 'operational',
    ipAddress: '103.145.72.1',
    opticalPowerRx: -3.2,
    opticalPowerTx: 4.5,
    utilizationPct: 68,
    connections: ['node-olt-1', 'node-olt-2', 'node-pop-1'],
    coordinates: { x: 50, y: 15 }
  },
  {
    id: 'node-olt-1',
    name: 'OLT-DHK-MA5800-01 (North Zone)',
    type: 'OLT_CHASSIS',
    location: 'North Pop Hub - Sector 4',
    status: 'degraded',
    ipAddress: '10.200.1.10',
    opticalPowerRx: -29.4,
    opticalPowerTx: 5.8,
    utilizationPct: 82,
    connections: ['node-core-1', 'node-fdh-1', 'node-se-1'],
    coordinates: { x: 25, y: 38 }
  },
  {
    id: 'node-olt-2',
    name: 'OLT-DHK-ZTE-02 (South Zone)',
    type: 'OLT_CHASSIS',
    location: 'South Tech Hub - Sector 9',
    status: 'operational',
    ipAddress: '10.200.2.10',
    opticalPowerRx: -18.2,
    opticalPowerTx: 6.1,
    utilizationPct: 54,
    connections: ['node-core-1', 'node-fdh-2'],
    coordinates: { x: 75, y: 38 }
  },
  {
    id: 'node-pop-1',
    name: 'IX Peering PoP Station (AS2914 / BDIX)',
    type: 'POP_STATION',
    location: 'National Exchange Facility',
    status: 'operational',
    ipAddress: '182.16.140.2',
    opticalPowerRx: -6.4,
    opticalPowerTx: 3.8,
    utilizationPct: 92,
    connections: ['node-core-1'],
    coordinates: { x: 88, y: 18 }
  },
  {
    id: 'node-fdh-1',
    name: 'Fiber Dist. Hub FDH-North-A',
    type: 'SPLITTER_HUB',
    location: 'Sub-district Enclosure 104',
    status: 'degraded',
    opticalPowerRx: -24.8,
    opticalPowerTx: -12.1,
    utilizationPct: 90,
    connections: ['node-olt-1', 'node-se-1', 'node-client-1'],
    coordinates: { x: 18, y: 65 }
  },
  {
    id: 'node-se-1',
    name: 'Splice Enclosure SE-12 (Aerial 48C)',
    type: 'SPLICE_CLOSURE',
    location: 'Main Highway Pole 44B',
    status: 'degraded',
    opticalPowerRx: -28.1,
    opticalPowerTx: -14.2,
    utilizationPct: 75,
    connections: ['node-olt-1', 'node-fdh-1'],
    coordinates: { x: 34, y: 60 }
  },
  {
    id: 'node-fdh-2',
    name: 'Fiber Dist. Hub FDH-South-B',
    type: 'SPLITTER_HUB',
    location: 'Commercial Avenue Hub 202',
    status: 'operational',
    opticalPowerRx: -17.9,
    opticalPowerTx: -10.5,
    utilizationPct: 62,
    connections: ['node-olt-2', 'node-client-2', 'node-client-3'],
    coordinates: { x: 80, y: 68 }
  },
  {
    id: 'node-client-1',
    name: 'Commercial Cluster ONTs (B2B Fiber)',
    type: 'ONT_CLIENT',
    location: 'Apex Tower Plaza',
    status: 'degraded',
    opticalPowerRx: -28.9,
    utilizationPct: 88,
    connections: ['node-fdh-1'],
    coordinates: { x: 15, y: 88 }
  },
  {
    id: 'node-client-2',
    name: 'Residential FTTH Block A (128 ONTs)',
    type: 'ONT_CLIENT',
    location: 'Greenwood Residences',
    status: 'operational',
    opticalPowerRx: -19.4,
    utilizationPct: 45,
    connections: ['node-fdh-2'],
    coordinates: { x: 68, y: 88 }
  },
  {
    id: 'node-client-3',
    name: 'Enterprise Park ONTs (Gigabit Direct)',
    type: 'ONT_CLIENT',
    location: 'Silicon District Block C',
    status: 'operational',
    opticalPowerRx: -17.1,
    utilizationPct: 58,
    connections: ['node-fdh-2'],
    coordinates: { x: 90, y: 88 }
  }
];

export const FIBER_LINKS: FiberLink[] = [
  {
    id: 'link-core-olt1',
    fromId: 'node-core-1',
    toId: 'node-olt-1',
    name: 'Backbone-North-100G (96-Core ADSS)',
    type: 'CORE_BACKBONE',
    cores: 96,
    lengthKm: 14.2,
    attenuationDb: 4.8,
    status: 'healthy'
  },
  {
    id: 'link-core-olt2',
    fromId: 'node-core-1',
    toId: 'node-olt-2',
    name: 'Backbone-South-100G (96-Core Duct)',
    type: 'CORE_BACKBONE',
    cores: 96,
    lengthKm: 18.6,
    attenuationDb: 5.2,
    status: 'healthy'
  },
  {
    id: 'link-core-pop',
    fromId: 'node-core-1',
    toId: 'node-pop-1',
    name: 'IX Transit Dark Fiber (48-Core Armor)',
    type: 'CORE_BACKBONE',
    cores: 48,
    lengthKm: 6.4,
    attenuationDb: 2.1,
    status: 'healthy'
  },
  {
    id: 'link-olt1-se1',
    fromId: 'node-olt-1',
    toId: 'node-se-1',
    name: 'Feeder F-04 (48-Core Aerial)',
    type: 'FEEDER_CABLE',
    cores: 48,
    lengthKm: 7.8,
    attenuationDb: 18.4,
    status: 'warning',
    otdrDistanceFault: 6.2
  },
  {
    id: 'link-se1-fdh1',
    fromId: 'node-se-1',
    toId: 'node-fdh-1',
    name: 'Feeder Extension F-04-EXT (24-Core)',
    type: 'FEEDER_CABLE',
    cores: 24,
    lengthKm: 3.1,
    attenuationDb: 5.1,
    status: 'warning'
  },
  {
    id: 'link-olt2-fdh2',
    fromId: 'node-olt-2',
    toId: 'node-fdh-2',
    name: 'Feeder South F-09 (48-Core Duct)',
    type: 'FEEDER_CABLE',
    cores: 48,
    lengthKm: 8.5,
    attenuationDb: 3.2,
    status: 'healthy'
  },
  {
    id: 'link-fdh1-c1',
    fromId: 'node-fdh-1',
    toId: 'node-client-1',
    name: 'Distribution Dist-North-01 (1:16 Split)',
    type: 'DISTRIBUTION_FIBER',
    cores: 16,
    lengthKm: 1.4,
    attenuationDb: 14.1,
    status: 'healthy'
  },
  {
    id: 'link-fdh2-c2',
    fromId: 'node-fdh-2',
    toId: 'node-client-2',
    name: 'Distribution Dist-South-01 (1:32 Split)',
    type: 'DISTRIBUTION_FIBER',
    cores: 32,
    lengthKm: 2.1,
    attenuationDb: 16.5,
    status: 'healthy'
  },
  {
    id: 'link-fdh2-c3',
    fromId: 'node-fdh-2',
    toId: 'node-client-3',
    name: 'Direct Drop Fiber Enterprise-03',
    type: 'DROP_CABLE',
    cores: 4,
    lengthKm: 0.8,
    attenuationDb: 1.8,
    status: 'healthy'
  }
];

export const MIKROTIK_ROUTERS: MikroTikRouter[] = [
  {
    id: 'rtr-1',
    name: 'HQ-CCR2216-MAIN',
    ip: '103.145.72.1',
    model: 'CCR2216-1G-12XS-2XQ (16-Core 2.0GHz)',
    version: 'RouterOS v7.14.2 (Stable)',
    uptime: '142 days 18:44:02',
    cpuLoad: 38,
    memoryUsage: 42,
    activePppoe: 3420,
    totalThroughputGbps: 34.8,
    status: 'online',
    lastBackup: 'Today, 03:00 AM'
  },
  {
    id: 'rtr-2',
    name: 'DIST-CCR2004-NORTH',
    ip: '10.200.1.1',
    model: 'CCR2004-1G-12S+2XS (4-Core 1.7GHz)',
    version: 'RouterOS v7.14.1',
    uptime: '89 days 04:12:11',
    cpuLoad: 64,
    memoryUsage: 58,
    activePppoe: 1840,
    totalThroughputGbps: 14.2,
    status: 'warning',
    lastBackup: 'Yesterday, 03:00 AM'
  },
  {
    id: 'rtr-3',
    name: 'DIST-CCR2004-SOUTH',
    ip: '10.200.2.1',
    model: 'CCR2004-1G-12S+2XS (4-Core 1.7GHz)',
    version: 'RouterOS v7.14.2',
    uptime: '112 days 11:30:45',
    cpuLoad: 41,
    memoryUsage: 49,
    activePppoe: 2110,
    totalThroughputGbps: 18.6,
    status: 'online',
    lastBackup: 'Today, 03:00 AM'
  },
  {
    id: 'rtr-4',
    name: 'BDIX-PEER-CCR1072',
    ip: '182.16.140.2',
    model: 'CCR1072-1G-8S+ (72-Core 1.0GHz)',
    version: 'RouterOS v7.13.5',
    uptime: '240 days 08:15:00',
    cpuLoad: 28,
    memoryUsage: 35,
    activePppoe: 0,
    totalThroughputGbps: 42.1,
    status: 'online',
    lastBackup: 'Today, 03:00 AM'
  }
];

export const OLT_CHASSIS_LIST: OltChassis[] = [
  {
    id: 'olt-1',
    name: 'OLT-DHK-MA5800-01',
    vendor: 'Huawei',
    model: 'SmartAX MA5800-X7 (GPON/XGS-PON)',
    ip: '10.200.1.10',
    totalPonPorts: 32,
    activePonPorts: 28,
    totalOnts: 2450,
    onlineOnts: 2382,
    tempCelsius: 41.5,
    status: 'degraded'
  },
  {
    id: 'olt-2',
    name: 'OLT-DHK-ZTE-02',
    vendor: 'ZTE',
    model: 'ZXA10 C320 (16-Port GPON Blade)',
    ip: '10.200.2.10',
    totalPonPorts: 16,
    activePonPorts: 16,
    totalOnts: 1820,
    onlineOnts: 1804,
    tempCelsius: 38.2,
    status: 'online'
  },
  {
    id: 'olt-3',
    name: 'OLT-CTG-FIBERHOME-03',
    vendor: 'Fiberhome',
    model: 'AN5516-04 Mini OLT',
    ip: '10.200.3.10',
    totalPonPorts: 16,
    activePonPorts: 12,
    totalOnts: 940,
    onlineOnts: 928,
    tempCelsius: 39.0,
    status: 'online'
  }
];

export const ONT_DEVICES: OntDevice[] = [
  {
    id: 'ont-1',
    sn: 'HWTC4A92B108',
    oltId: 'olt-1',
    ponPort: '0/1/4',
    subscriberName: 'Rahman Textiles Ltd',
    plan: 'Enterprise 500M Dedicated',
    rxPowerDbm: -29.4,
    txPowerDbm: 2.1,
    distanceMeters: 4820,
    status: 'low_optical'
  },
  {
    id: 'ont-2',
    sn: 'HWTC8812CD41',
    oltId: 'olt-1',
    ponPort: '0/1/4',
    subscriberName: 'Dr. Tariqul Islam',
    plan: 'Fiber Ultra 150M',
    rxPowerDbm: -28.9,
    txPowerDbm: 2.3,
    distanceMeters: 4650,
    status: 'low_optical'
  },
  {
    id: 'ont-3',
    sn: 'ZTEGC90812F4',
    oltId: 'olt-2',
    ponPort: '1/2/3',
    subscriberName: 'Creative Media Studio',
    plan: 'Fiber Turbo 250M',
    rxPowerDbm: -18.4,
    txPowerDbm: 2.5,
    distanceMeters: 2100,
    status: 'online'
  },
  {
    id: 'ont-4',
    sn: 'HWTC9A88F102',
    oltId: 'olt-2',
    ponPort: '1/2/3',
    subscriberName: 'Vertex Solutions Hub',
    plan: 'Fiber Pro 100M',
    rxPowerDbm: -12.1,
    txPowerDbm: 4.8,
    distanceMeters: 1840,
    status: 'offline'
  },
  {
    id: 'ont-5',
    sn: 'ZTEGA5512B90',
    oltId: 'olt-2',
    ponPort: '1/1/1',
    subscriberName: 'Sarah Jenkins',
    plan: 'Home Starter 50M',
    rxPowerDbm: -19.2,
    txPowerDbm: 2.0,
    distanceMeters: 3120,
    status: 'online'
  },
  {
    id: 'ont-6',
    sn: 'FBDT77341109',
    oltId: 'olt-3',
    ponPort: '0/2/1',
    subscriberName: 'Nordic Agro Export Ltd',
    plan: 'Enterprise 1Gbps Direct',
    rxPowerDbm: -16.8,
    txPowerDbm: 2.8,
    distanceMeters: 1250,
    status: 'online'
  }
];

export const SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-001',
    accountNumber: 'FTN-DHK-90812',
    name: 'Rahman Textiles Ltd',
    phone: '+880 1711-294812',
    email: 'noc@rahmantextiles.com',
    pppoeUser: 'rahman_corp_500m',
    plan: 'Enterprise 500M Dedicated',
    speedMbps: 500,
    monthlyFee: 18500,
    status: 'active',
    billingStatus: 'paid',
    currentUsageGb: 4890,
    assignedRouter: 'HQ-CCR2216-MAIN',
    assignedOlt: 'OLT-DHK-MA5800-01',
    assignedPon: '0/1/4'
  },
  {
    id: 'sub-002',
    accountNumber: 'FTN-DHK-90815',
    name: 'Vertex Solutions Hub',
    phone: '+880 1822-449102',
    email: 'admin@vertexhub.io',
    pppoeUser: 'vertex_office_100m',
    plan: 'Fiber Pro 100M',
    speedMbps: 100,
    monthlyFee: 4500,
    status: 'suspended',
    billingStatus: 'overdue',
    currentUsageGb: 920,
    assignedRouter: 'DIST-CCR2004-SOUTH',
    assignedOlt: 'OLT-DHK-ZTE-02',
    assignedPon: '1/2/3'
  },
  {
    id: 'sub-003',
    accountNumber: 'FTN-DHK-90820',
    name: 'Creative Media Studio',
    phone: '+880 1914-883210',
    email: 'accounts@creativemedia.tv',
    pppoeUser: 'creative_250m_pppoe',
    plan: 'Fiber Turbo 250M',
    speedMbps: 250,
    monthlyFee: 8500,
    status: 'active',
    billingStatus: 'paid',
    currentUsageGb: 3120,
    assignedRouter: 'DIST-CCR2004-SOUTH',
    assignedOlt: 'OLT-DHK-ZTE-02',
    assignedPon: '1/2/3'
  },
  {
    id: 'sub-004',
    accountNumber: 'FTN-DHK-90833',
    name: 'Dr. Tariqul Islam',
    phone: '+880 1680-112233',
    email: 'dr.tariqul@gmail.com',
    pppoeUser: 'tariqul_home_150m',
    plan: 'Fiber Ultra 150M',
    speedMbps: 150,
    monthlyFee: 2200,
    status: 'active',
    billingStatus: 'paid',
    currentUsageGb: 840,
    assignedRouter: 'DIST-CCR2004-NORTH',
    assignedOlt: 'OLT-DHK-MA5800-01',
    assignedPon: '0/1/4'
  },
  {
    id: 'sub-005',
    accountNumber: 'FTN-DHK-90842',
    name: 'Sarah Jenkins',
    phone: '+880 1552-334455',
    email: 'sarah.j@outlook.com',
    pppoeUser: 'sarah_jenk_50m',
    plan: 'Home Starter 50M',
    speedMbps: 50,
    monthlyFee: 1200,
    status: 'active',
    billingStatus: 'unpaid',
    currentUsageGb: 310,
    assignedRouter: 'DIST-CCR2004-SOUTH',
    assignedOlt: 'OLT-DHK-ZTE-02',
    assignedPon: '1/1/1'
  },
  {
    id: 'sub-006',
    accountNumber: 'FTN-CTG-40112',
    name: 'Nordic Agro Export Ltd',
    phone: '+880 1301-889900',
    email: 'it@nordicagro.com.bd',
    pppoeUser: 'nordic_gigabit_corp',
    plan: 'Enterprise 1Gbps Direct',
    speedMbps: 1000,
    monthlyFee: 35000,
    status: 'active',
    billingStatus: 'paid',
    currentUsageGb: 12400,
    assignedRouter: 'HQ-CCR2216-MAIN',
    assignedOlt: 'OLT-CTG-FIBERHOME-03',
    assignedPon: '0/2/1'
  }
];

export const SERVICE_MODULES: ServiceModule[] = [
  {
    id: 'srv-compiler',
    name: 'services/core-compiler',
    category: 'Compiler',
    version: 'v2.4.0',
    status: 'healthy',
    uptime: '99.99%',
    requestsPerSec: 142,
    latencyMs: 14,
    description: 'Conversation to Code AST parser, pipeline validator & artifact synthesis engine'
  },
  {
    id: 'srv-parser',
    name: 'services/parser',
    category: 'Compiler',
    version: 'v2.1.2',
    status: 'healthy',
    uptime: '100%',
    requestsPerSec: 88,
    latencyMs: 8,
    description: 'Natural language token lexer, grammar builder & syntax tree transformer'
  },
  {
    id: 'srv-code-gen',
    name: 'services/code-generator',
    category: 'Compiler',
    version: 'v2.3.1',
    status: 'healthy',
    uptime: '99.98%',
    requestsPerSec: 110,
    latencyMs: 32,
    description: 'Multi-target code generator for RouterOS, Huawei VRP, Golang & Flutter'
  },
  {
    id: 'srv-smart-noc',
    name: 'services/smart-noc',
    category: 'ISP Network',
    version: 'v3.1.0',
    status: 'healthy',
    uptime: '100%',
    requestsPerSec: 1240,
    latencyMs: 4,
    description: 'Real-time telemetry event bus, alarm correlator and optical monitoring'
  },
  {
    id: 'srv-autonomous',
    name: 'services/autonomous-network',
    category: 'ISP Network',
    version: 'v3.0.4',
    status: 'healthy',
    uptime: '99.99%',
    requestsPerSec: 450,
    latencyMs: 18,
    description: 'Closed-loop AI remediation pipeline with human-in-the-loop approval gate'
  },
  {
    id: 'srv-mikrotik',
    name: 'services/mikrotik',
    category: 'ISP Network',
    version: 'v2.8.0',
    status: 'healthy',
    uptime: '99.95%',
    requestsPerSec: 890,
    latencyMs: 12,
    description: 'RouterOS REST/API-SSL client, PPPoE session orchestrator, queue manager'
  },
  {
    id: 'srv-olt',
    name: 'services/olt',
    category: 'ISP Network',
    version: 'v2.7.4',
    status: 'alert',
    uptime: '99.82%',
    requestsPerSec: 620,
    latencyMs: 45,
    description: 'SNMP/CLI TL1 gateway for Huawei MA5800, ZTE C320, Fiberhome & Nokia OLTs'
  },
  {
    id: 'srv-gis-fiber',
    name: 'services/gis',
    category: 'ISP Network',
    version: 'v2.2.0',
    status: 'healthy',
    uptime: '99.99%',
    requestsPerSec: 180,
    latencyMs: 9,
    description: 'Geospatial fiber route mapping, OTDR fault locator & core distribution tracker'
  },
  {
    id: 'srv-telemetry',
    name: 'services/telemetry',
    category: 'Platform Core',
    version: 'v2.5.0',
    status: 'healthy',
    uptime: '100%',
    requestsPerSec: 3400,
    latencyMs: 2,
    description: 'High-throughput time-series telemetry aggregator (SNMP v3, NetFlow, IPFIX, gNMI)'
  },
  {
    id: 'srv-ai-assistant',
    name: 'services/ai-assistant',
    category: 'Platform Core',
    version: 'v3.2.0',
    status: 'healthy',
    uptime: '99.99%',
    requestsPerSec: 95,
    latencyMs: 22,
    description: 'FTNDNS domain LLM reasoning agent with RAG over ISP docs and RouterOS manual'
  },
  {
    id: 'srv-api-sec',
    name: 'services/api-security',
    category: 'Security',
    version: 'v2.6.0',
    status: 'healthy',
    uptime: '100%',
    requestsPerSec: 4200,
    latencyMs: 1,
    description: 'Zero-Trust mTLS gateway, JWT token rotation, DDoS rate limiting & WAF'
  },
  {
    id: 'srv-billing',
    name: 'services/billing',
    category: 'Business',
    version: 'v2.1.0',
    status: 'healthy',
    uptime: '100%',
    requestsPerSec: 210,
    latencyMs: 16,
    description: 'Automated recurring billing, bKash/Nagad/Cards gateway, FUP rate capping'
  }
];

export const INITIAL_AI_CHAT: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: 'Hello! I am FTNDNS AI Network Assistant, connected to your autonomous ISP control plane (CCR2216 Core, Huawei/ZTE OLTs, and GIS Fiber Registry). How can I assist your NOC operations today?',
    timestamp: '10:00 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    content: 'Analyze the high optical loss on OLT-DHK-MA5800-01 PON port 0/1/4 and give me the exact RouterOS & OLT mitigation steps.',
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    content: `🔍 **FTN Telemetry Root-Cause Analysis for Port 0/1/4:**

1. **Optical Attenuation**: RX power dropped from nominal **-18.5 dBm** to **-29.4 dBm** (Loss of 10.9 dB).
2. **OTDR Fault Triangulation**: Backscatter anomaly located at **6.2 km** along Feeder Cable **F-04** (near Splice Enclosure **SE-12**, Pole 44B).
3. **Impact**: 28 active PPPoE subscribers affected (including Rahman Textiles Ltd).

🛡️ **Automated Mitigation Plan (Risk Score: MEDIUM)**:
- Temporarily boost OLT SFP+ laser drive current by +1.5 dBm to recover borderline ONTs.
- Reroute high-priority B2B bandwidth over Feeder F-04B backup path.
- Trigger technician dispatch ticket with precise GPS coordinates: \`23.8103° N, 90.4125° E\`.`,
    timestamp: '10:02 AM',
    actionPayload: {
      type: 'OLT_PROVISION',
      details: 'Huawei MA5800 SFP+ Optical Drive Boost & Backup Path Switch',
      executableCommand: `interface gpon 0/1\nport 4 optical-power adjust-tx +1.5dBm\nbackup-link enable target-fiber F-04B slot 0/1/4\nsave configuration`
    }
  }
];
