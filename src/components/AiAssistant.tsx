import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Terminal, 
  Zap, 
  Check, 
  Copy, 
  Play, 
  RefreshCw, 
  Radio,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AiChatMessage } from '../types';

interface AiAssistantProps {
  chatHistory: AiChatMessage[];
  onSendMessage: (text: string) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  chatHistory,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const promptSuggestions = [
    'Diagnose Feeder F-04 optical loss and calculate OTDR distance',
    'Generate RouterOS BGP Peering failover script for AS2914',
    'Isolate rogue continuous wave (CW) jamming ONT on port 1/2/3',
    'Calculate optical link budget for 1:32 split on 12km fiber loop'
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div id="ai-assistant-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              FTNDNS Autonomous AI Network Engineer
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Agent Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Conversational diagnostics, RouterOS CLI generator, and OTDR fiber fault triangulation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Executable Code / Script Card */}
                  {msg.actionPayload && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          {msg.actionPayload.type}: {msg.actionPayload.details}
                        </span>
                        {msg.actionPayload.executableCommand && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.actionPayload?.executableCommand || '')}
                            className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>

                      {msg.actionPayload.executableCommand && (
                        <pre className="bg-slate-950 p-2.5 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-850">
                          {msg.actionPayload.executableCommand}
                        </pre>
                      )}
                    </div>
                  )}

                  <div className={`text-[10px] text-right font-mono ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-1 font-bold text-xs text-white">
                    NOC
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Suggestions Row */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Quick prompts:</span>
          {promptSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(sug)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 cursor-pointer transition"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask FTNDNS AI about network routing, optical telemetry, or RouterOS scripts..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
