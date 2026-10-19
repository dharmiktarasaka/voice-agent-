import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  PhoneCall,
  Radio,
  Headphones,
  PhoneForwarded,
  PhoneOff,
  User,
  Clock,
  Sparkles,
  ShieldAlert,
  Bot,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { callsService } from '../../services/callsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDuration } from '../../utils/formatters';

export function LiveCallsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [liveCalls, setLiveCalls] = useState([]);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticker, setTicker] = useState(0);

  // Transfer Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState('+91 98200 12345 (Sales Desk)');

  // Audio Monitoring
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    async function fetchLive() {
      try {
        const calls = await callsService.getLiveCalls();
        setLiveCalls(calls);
        if (calls.length > 0 && !selectedCallId) {
          setSelectedCallId(calls[0].id);
        }
      } catch (err) {
        toast.error('Failed to load active calls.');
      } finally {
        setLoading(false);
      }
    }
    fetchLive();

    // Increment timer every second for realistic live counting
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedCall = liveCalls.find(c => c.id === selectedCallId) || liveCalls[0];

  const handleEndCall = async () => {
    if (!selectedCall) return;
    const confirmed = await confirm({
      title: 'End Active Call Session?',
      message: `Are you sure you want to hang up on ${selectedCall.contactName}? This will conclude the AI voice turn session.`,
      confirmText: 'End Call',
      variant: 'danger',
    });
    if (confirmed) {
      try {
        await callsService.endLiveCall(selectedCall.id);
        setLiveCalls(prev => prev.filter(c => c.id !== selectedCall.id));
        toast.info(`Active call with ${selectedCall.contactName} completed and archived.`, 'Call Concluded');
        if (liveCalls.length > 1) {
          const next = liveCalls.find(c => c.id !== selectedCall.id);
          setSelectedCallId(next?.id);
        } else {
          setSelectedCallId(null);
        }
      } catch (err) {
        toast.error('Failed to end call.');
      }
    }
  };

  const handleTransfer = () => {
    setTransferModalOpen(false);
    toast.success(`Warm handoff triggered to ${transferTarget}. Briefing human agent...`, 'Transfer Initiated');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Live Calls Monitoring
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {liveCalls.length} Active Conversations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-agent supervisor dashboard with simulated live audio, speech latency, and operator controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            <Radio className="w-3.5 h-3.5 mr-1 inline animate-pulse" /> Live Telemetry
          </Badge>
        </div>
      </div>

      {liveCalls.length === 0 ? (
        <Card className="text-center py-16">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No active conversations at this moment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            All inbound callers have concluded and scheduled campaigns are currently idle.
          </p>
          <div className="mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/campaigns')}
            >
              Go to Outbound Campaigns
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Calls List (Left Column) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>Concurrent Conversations ({liveCalls.length})</span>
              <span>Duration</span>
            </div>

            {liveCalls.map(c => {
              const elapsedSec = Math.floor((Date.now() - c.startedAt) / 1000);
              const isSelected = selectedCall?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCallId(c.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {c.contactName}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {c.phoneNumber}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {formatDuration(elapsedSec)}
                      </span>
                      <div className="text-[10px] text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        In Progress
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[140px]">
                      {c.agentName.split('-')[0]}
                    </span>
                    <Badge variant="default" size="sm">
                      {c.language}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Inspector Panel (Right 2 Columns) */}
          {selectedCall && (
            <div className="lg:col-span-2 space-y-6">
              {/* Operator Live Control Bar */}
              <Card padding="p-4" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active Stream Control
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-mono">
                      Latency: {selectedCall.latencyMs || 120}ms
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedCall.contactName} &larr;&rarr; {selectedCall.agentName.split('-')[0]}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={isListening ? 'primary' : 'outline'}
                    size="sm"
                    icon={Headphones}
                    onClick={() => {
                      setIsListening(!isListening);
                      toast.info(
                        !isListening
                          ? 'Listening to live audio monitor stream (Simulated).'
                          : 'Muted audio monitor.'
                      );
                    }}
                    className={
                      isListening
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'border-slate-700 text-slate-200 hover:bg-slate-800'
                    }
                  >
                    {isListening ? 'Monitoring Audio' : 'Listen In'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={PhoneForwarded}
                    onClick={() => setTransferModalOpen(true)}
                    className="border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Transfer
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={PhoneOff}
                    onClick={handleEndCall}
                  >
                    End Call
                  </Button>
                </div>
              </Card>

              {/* Live Transcript Stream Feed */}
              <Card padding="p-0" className="overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Live Turn-by-Turn Speech Ticker
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Current Stage: <strong className="text-slate-800 dark:text-slate-200">{selectedCall.stage}</strong>
                  </span>
                </div>

                <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
                  {selectedCall.transcriptFeed.map((turn, idx) => {
                    const isAgent = turn.speaker === 'agent';
                    return (
                      <div
                        key={turn.id || idx}
                        className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-1 px-1">
                          {turn.speakerName}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                            isAgent
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 rounded-tl-xs border border-indigo-100 dark:border-indigo-900/40'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-xs border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {turn.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Transfer Modal */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Warm Call Transfer"
        subtitle={`Hand off active call with ${selectedCall?.contactName} to human advisor`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Warm Transfer Protocol:</strong> The AI agent will inform the caller, hold the line, dial the selected destination, and pass extracted caller notes before dropping off.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Destination Desk / Phone
            </label>
            <select
              value={transferTarget}
              onChange={e => setTransferTarget(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            >
              <option value="+91 98200 12345 (Sales Desk)">+91 98200 12345 (Senior Sales Advisor)</option>
              <option value="+91 98111 22334 (On-call Doctor)">+91 98111 22334 (Clinic Duty Doctor)</option>
              <option value="+1 (800) 555-0199 (Tier-2 SRE)">+1 (800) 555-0199 (Tier-2 Engineering)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleTransfer} icon={PhoneForwarded}>
              Confirm Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LiveCallsPage;
