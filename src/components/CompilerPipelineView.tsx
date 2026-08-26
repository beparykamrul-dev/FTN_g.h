import React, { useState } from 'react';
import { 
  FileCode2, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Layers, 
  Terminal, 
  Sparkles, 
  FolderTree, 
  Check, 
  Copy,
  ChevronRight
} from 'lucide-react';
import { CompilerPipelineStage } from '../types';

export const CompilerPipelineView: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Build an autonomous BGP failover service with Telegram incident alerts and MikroTik RouterOS v7 dynamic routing.'
  );
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(5); // all completed initially
  const [copied, setCopied] = useState(false);

  const initialStages: CompilerPipelineStage[] = [
    {
      id: 'stage-1',
      title: 'Parser & Lexical Tokenizer (services/parser)',
      description: 'Lexical analysis of natural language intent, token extraction, and DSL grammar parsing.',
      status: 'completed',
      executionTimeMs: 42,
      output: `[TOKENS]: INTENT(BUILD_AUTONOMOUS_SERVICE) TARGET(BGP_FAILOVER) NOTIFICATION(TELEGRAM) PLATFORM(ROUTEROS_V7)`
    },
    {
      id: 'stage-2',
      title: 'Intent Planner & AST Synthesis (services/planner)',
      description: 'Dependency resolution, safety boundary graph generation, and microservice contract mapping.',
      status: 'completed',
      executionTimeMs: 88,
      output: `[AST]: {
  service: "bgp-failover-orchestrator",
  contracts: ["services/mikrotik", "services/notifications", "services/telemetry"],
  safetyApprovalRequired: true,
  riskTier: "MEDIUM"
}`
    },
    {
      id: 'stage-3',
      title: 'Multi-Target Code Generator (services/code-generator)',
      description: 'Generates Go / TypeScript microservice code and RouterOS CLI automation scripts.',
      status: 'completed',
      executionTimeMs: 140,
      output: `// Generated BGP Sentinel Service (Golang)
package main

import (
  "context"
  "ftndns/services/mikrotik"
  "ftndns/services/notifications"
)

func MonitorBgpHealth(ctx context.Context, peerIP string) {
  status := mikrotik.GetBgpSession("NTT-100G-Primary")
  if status.PacketLoss > 15.0 {
    mikrotik.ShiftTraffic("Cogent-Backup", 200)
    notifications.SendTelegramAlert("🚨 BGP Congestion: Rerouted to Cogent")
  }
}`
    },
    {
      id: 'stage-4',
      title: 'Filesystem Builder (services/filesystem-builder)',
      description: 'Emits directory trees, Dockerfiles, Kubernetes manifests, and unit test suites.',
      status: 'completed',
      executionTimeMs: 65,
      output: `[FILES CREATED]:
├── services/autonomous-network/bgp_sentinel.go
├── services/autonomous-network/bgp_sentinel_test.go
├── infra/docker/bgp_sentinel.Dockerfile
└── infra/kubernetes/bgp-sentinel-deployment.yaml`
    },
    {
      id: 'stage-5',
      title: 'Validation & Deployment Gate (services/deployment)',
      description: 'Zero-Trust security audit, syntax compilation, and rolling container deployment.',
      status: 'completed',
      executionTimeMs: 110,
      output: `[TESTS]: 8 passed, 0 failed. Zero-Trust mTLS token verified. Ready for deployment.`
    }
  ];

  const [stages, setStages] = useState<CompilerPipelineStage[]>(initialStages);

  const handleRunCompiler = () => {
    setIsCompiling(true);
    setActiveStageIndex(0);

    // Reset stages
    setStages(prev => prev.map(s => ({ ...s, status: 'idle' })));

    let current = 0;
    const interval = setInterval(() => {
      if (current < initialStages.length) {
        setStages(prev => {
          const next = [...prev];
          next[current] = { ...initialStages[current], status: 'completed' };
          return next;
        });
        setActiveStageIndex(current);
        current++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
      }
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stages[2].output || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div id="compiler-pipeline-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-amber-400" />
            FTNDNS Conversation-to-Code Compiler Engine
          </h2>
          <p className="text-xs text-slate-400">
            Transforms natural language ISP operations intent into validated microservices and hardware scripts.
          </p>
        </div>
      </div>

      {/* Input Prompt Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Natural Language Network Requirement / Intent:
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-amber-500"
            placeholder="e.g. Provision automated OLT PON optical health balancer..."
          />
          <button
            id="run-compiler-btn"
            disabled={isCompiling}
            onClick={handleRunCompiler}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/20 cursor-pointer disabled:opacity-50 transition"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling AST...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Compiler Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Visual Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stages Tree */}
        <div className="lg:col-span-5 space-y-3">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isActive = activeStageIndex === idx;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg text-xs font-bold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `${idx + 1}`}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{stage.description}</p>
                    </div>
                  </div>
                  {stage.executionTimeMs && (
                    <span className="text-[10px] font-mono text-slate-400">{stage.executionTimeMs}ms</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Output Inspector */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">Stage Artifact Output</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 py-4 overflow-x-auto text-xs">
            <pre className="text-amber-300/90 whitespace-pre-wrap leading-relaxed">
              {stages[activeStageIndex]?.output || '// Processing compiler pipeline stage...'}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Target Runtime: Golang 1.22 + RouterOS v7</span>
            <span>Schema: FTNDNS-AST-v2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
