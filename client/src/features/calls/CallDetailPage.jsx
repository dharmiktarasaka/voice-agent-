import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  PhoneCall,
  User,
  Clock,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Search,
  Volume2,
  Play,
  Pause,
  Layers,
  Sparkles,
  MessageSquare,
  FileText,
  Plus,
  Send,
  Building2,
  Globe,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { callsService } from '../../services/callsService';
import { useToast } from '../../context/ToastContext';
import { formatDateTime, formatDuration } from '../../utils/formatters';

export function CallDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transcript search & copy
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copied, setCopied] = useState(false);

  // Internal Notes
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Follow-up Schedule Modal
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('2026-10-25T11:00');
  const [followUpReason, setFollowUpReason] = useState('Routine advisory follow-up');

  // Simulated Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  useEffect(() => {
    async function loadCall() {
      setLoading(true);
      try {
        const data = await callsService.getCallById(id);
        setCall(data);
      } catch (err) {
        toast.error('Call record not found.');
        navigate('/calls');
      } finally {
        setLoading(false);
      }
    }
    loadCall();
  }, [id, navigate]);

  if (loading || !call) {
    return (
      <div className="py-20 text-center text-slate-500">
        <PhoneCall className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        Loading call inspection telemetry...
      </div>
    );
  }

  const handleCopyTranscript = () => {
    const text = call.transcript
      .map(t => `[${t.time}] ${t.speakerName}: ${t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Transcript copied to clipboard.', 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = async e => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    try {
      const added = await callsService.addCallNote(call.id, newNote);
      setCall(prev => ({
        ...prev,
        notes: [added, ...(prev.notes || [])],
      }));
      setNewNote('');
      toast.success('Internal note added.');
    } catch (err) {
      toast.error('Failed to add note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleScheduleFollowUp = () => {
    setFollowUpModalOpen(false);
    toast.success(`Follow-up scheduled for ${followUpDate}. Added to Follow-up Queue.`);
  };

  const handleOutcomeChange = async newOutcome => {
    try {
      await callsService.updateCallOutcome(call.id, newOutcome);
      setCall(prev => ({ ...prev, outcome: newOutcome }));
      toast.success(`Call outcome updated to ${newOutcome}.`);
    } catch (err) {
      toast.error('Failed to update outcome.');
    }
  };

  // Filter transcript turns
  const filteredTranscript = (call.transcript || []).filter(t =>
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    t.speakerName.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/calls')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Call {call.id}
              </h1>
              <StatusBadge status={call.status} />
              <StatusBadge status={call.outcome} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dialed {formatDateTime(call.startTime)} • Duration:{' '}
              {formatDuration(call.durationSeconds)} • Carrier Cost: {call.cost}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFollowUpModalOpen(true)}
            icon={Calendar}
          >
            Schedule Follow-up
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTranscript}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : 'Copy Transcript'}
          </Button>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <span className="text-[11px] text-slate-500 px-1">Outcome:</span>
            <select
              value={call.outcome}
              onChange={e => handleOutcomeChange(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="Qualified Lead">Qualified Lead</option>
              <option value="Appointment Booked">Appointment Booked</option>
              <option value="Callback Requested">Callback Requested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Escalated to Human">Escalated to Human</option>
              <option value="Voicemail">Voicemail</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details & Right Column Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Metadata, Recording Demo Player, Lead Extraction, Timeline */}
        <div className="space-y-6">
          {/* Contact & Agent Card */}
          <Card padding="p-5" className="space-y-4">
            <CardHeader
              title="Caller & Routing Identity"
              subtitle="Participant details and assigned agent"
              icon={User}
            />

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Contact Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {call.contactName}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {call.phoneNumber}
                </span>
              </div>

              {call.contactCompany && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Company / Org</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {call.contactCompany}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">AI Voice Agent</span>
                <Link
                  to={`/agents/${call.agentId}`}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {call.agentName.split('-')[0]}
                </Link>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Detected Language</span>
                <Badge variant="purple" size="sm">
                  <Globe className="w-3 h-3 mr-1 inline" /> {call.language}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Customer Sentiment</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {call.sentiment || 'Neutral'}
                </span>
              </div>
            </div>
          </Card>

          {/* Audio Recording Demo Player */}
          <Card padding="p-5" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                Call Audio Recording
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Phase 1 Demo Player
              </span>
            </div>

            {/* Waveform Visualization Placeholder */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>00:14</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Dual-Channel Audio</span>
                </div>
                <span>{formatDuration(call.durationSeconds)}</span>
              </div>

              {/* Simulated Waveform Bars */}
              <div className="flex items-center justify-between gap-0.5 h-10 px-1">
                {[14, 28, 45, 80, 55, 30, 20, 60, 95, 70, 40, 65, 85, 30, 15, 45, 90, 75, 50, 65, 40, 25, 60, 80, 55, 30, 15, 20, 45, 70].map(
                  (height, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        i < 10 ? 'bg-indigo-400' : 'bg-slate-700'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    toast.info('Simulating audio playback with waveform sync.');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Play Demo Audio
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400">1.0x Speed • High Definition</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              * Note: In Phase 3, real carrier MP3/WAV dual-channel audio streams stored in cloud S3 will stream directly to this player.
            </p>
          </Card>

          {/* Extracted Lead Information */}
          <Card padding="p-5" className="space-y-3">
            <CardHeader
              title="AI Extracted Lead Criteria"
              subtitle="Structured information parsed from speech turns"
              icon={Sparkles}
            />
            {call.extractedData && Object.keys(call.extractedData).length > 0 ? (
              <div className="space-y-2 text-xs">
                {Object.entries(call.extractedData).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center"
                  >
                    <span className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No structured data extracted.</p>
            )}
          </Card>

          {/* Event Timeline */}
          <Card padding="p-5" className="space-y-3">
            <CardHeader
              title="Event Timeline"
              subtitle="Sequential call progression milestones"
              icon={Clock}
            />
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 text-xs">
              {(call.timeline || []).map((ev, i) => (
                <div key={i} className="relative pl-4 space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[21px] top-1 border-2 border-white dark:border-slate-900" />
                  <span className="font-mono text-[10px] text-slate-400">{ev.time}</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {ev.event}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI Summary, Interactive Transcript, Internal Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Executive Summary Card */}
          <Card padding="p-5" className="space-y-3 border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/30 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                AI Executive Conversation Summary
              </h3>
              <Badge variant="purple" size="sm">
                LLM Synthesized
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {call.summary || 'Summary pending generation.'}
            </p>
          </Card>

          {/* Turn-by-Turn Transcript Viewer */}
          <Card padding="p-0" className="overflow-hidden flex flex-col">
            {/* Transcript Top Search & Action Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Interactive Transcript ({call.transcript?.length || 0} turns)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <SearchInput
                  value={transcriptSearch}
                  onChange={e => setTranscriptSearch(e.target.value)}
                  placeholder="Search in transcript..."
                  className="w-48 sm:w-60"
                />
              </div>
            </div>

            {/* Conversation Bubbles */}
            <div className="p-6 space-y-5 max-h-[550px] overflow-y-auto">
              {filteredTranscript.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No dialog turns match your search keyword.
                </div>
              ) : (
                filteredTranscript.map(turn => {
                  const isAgent = turn.speaker === 'agent';
                  return (
                    <div
                      key={turn.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {turn.speakerName}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{turn.time}</span>
                        {turn.language && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {turn.language}
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                          isAgent
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 rounded-tl-xs border border-indigo-100 dark:border-indigo-900/40'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-xs border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {turn.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Internal Notes Section */}
          <Card padding="p-5" className="space-y-4">
            <CardHeader
              title="Internal Notes & Handoff Logs"
              subtitle="Notes visible only to operators and sales managers"
              icon={FileText}
            />

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Write an internal follow-up note..."
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isAddingNote}
                  icon={Send}
                >
                  Add Note
                </Button>
              </div>
            </form>

            {/* List Notes */}
            <div className="space-y-3 pt-2">
              {(call.notes || []).map(note => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {note.author}
                    </span>
                    <span className="font-mono">{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Follow-up Modal */}
      <Modal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        title="Schedule Follow-up"
        subtitle={`Schedule reminder for ${call.contactName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Follow-up Reason
            </label>
            <input
              type="text"
              value={followUpReason}
              onChange={e => setFollowUpReason(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setFollowUpModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleScheduleFollowUp}>
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CallDetailPage;
