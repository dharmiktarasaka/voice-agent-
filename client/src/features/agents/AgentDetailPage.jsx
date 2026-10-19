import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Save,
  Play,
  Volume2,
  Plus,
  Trash2,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Settings,
  Mic,
  MessageSquare,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { agentsService } from '../../services/agentsService';
import { callsService } from '../../services/callsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDuration, formatDateTime } from '../../utils/formatters';

export function AgentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [testCallModalOpen, setTestCallModalOpen] = useState(false);
  const [agentCalls, setAgentCalls] = useState([]);

  // Form states initialized when agent loads
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const ag = await agentsService.getAgentById(id);
        setAgent(ag);
        setFormData(JSON.parse(JSON.stringify(ag)));

        // Load calls handled by this agent
        const calls = await callsService.getCalls({ agentId: id });
        setAgentCalls(calls);
      } catch (err) {
        toast.error('Agent not found.');
        navigate('/agents');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading || !agent) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Bot className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        Loading voice agent configuration...
      </div>
    );
  }

  const handleFieldChange = (section, field, value) => {
    setFormData(prev => {
      if (!section) {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: value,
        },
      };
    });
  };

  const handleSave = async (activate = false) => {
    setIsSaving(true);
    try {
      const payload = { ...formData };
      if (activate) {
        payload.status = 'active';
      }
      const updated = await agentsService.updateAgent(agent.id, payload);
      setAgent(updated);
      setFormData(JSON.parse(JSON.stringify(updated)));
      toast.success(
        activate
          ? `Agent "${updated.name}" is now Activated in Demo Mode.`
          : 'Agent configuration saved successfully.',
        'Settings Saved'
      );
    } catch (err) {
      toast.error('Failed to save agent changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoicePreview = () => {
    setIsPlayingPreview(true);
    toast.info(`Playing simulated sample: "${formData.voice?.voiceName || 'Neural Voice'}"`);
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, 2800);
  };

  const tabsList = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'calling', label: 'Calling Rules', icon: PhoneCall },
    { id: 'language', label: 'Languages', icon: Globe },
    { id: 'voice', label: 'Voice & Persona', icon: Mic },
    { id: 'instructions', label: 'Instructions & Prompt', icon: MessageSquare },
    { id: 'behavior', label: 'Turn-taking & Behavior', icon: Activity },
    { id: 'extraction', label: 'Post-Call Extraction', icon: Layers },
    { id: 'history', label: 'Activity History', icon: Bot, count: agentCalls.length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/agents')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {formData.name}
              </h1>
              <StatusBadge status={agent.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {formData.businessName} • Created {formatDateTime(agent.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTestCallModalOpen(true)}
            icon={PhoneCall}
          >
            Test Call Simulator
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave(false)}
            isLoading={isSaving}
            icon={Save}
          >
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave(true)}
            isLoading={isSaving}
            icon={CheckCircle2}
          >
            {agent.status === 'active' ? 'Save & Sync' : 'Activate Agent'}
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB CONTENT: GENERAL */}
      {activeTab === 'general' && (
        <Card className="space-y-5">
          <CardHeader
            title="General Agent Information"
            subtitle="Core identification and greeting metadata used during call initiation"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Agent Display Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => handleFieldChange(null, 'name', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Business / Organization Name
              </label>
              <input
                type="text"
                value={formData.businessName || ''}
                onChange={e => handleFieldChange(null, 'businessName', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Agent Description
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={e => handleFieldChange(null, 'description', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Agent Purpose
              </label>
              <select
                value={formData.purpose || 'Lead Qualification'}
                onChange={e => handleFieldChange(null, 'purpose', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              >
                <option value="Lead Qualification">Lead Qualification</option>
                <option value="Appointment Booking">Appointment Booking</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Lead Follow-up">Lead Follow-up</option>
                <option value="Receptionist">Receptionist / IVR Gatekeeper</option>
                <option value="Custom Purpose">Custom Purpose</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Operating Time Zone
              </label>
              <select
                value={formData.timeZone || 'Asia/Kolkata (IST)'}
                onChange={e => handleFieldChange(null, 'timeZone', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="America/New_York (EST)">America/New_York (EST - UTC-5)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST - UTC-8)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT - UTC+0)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: CALLING RULES */}
      {activeTab === 'calling' && (
        <Card className="space-y-5">
          <CardHeader
            title="Telephony & Routing Behavior"
            subtitle="Configure call limits, silence thresholds, and transfer rules"
          />
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.calling?.inbound ?? true}
                  onChange={e => handleFieldChange('calling', 'inbound', e.target.checked)}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Accept Inbound Calls
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Allow virtual phone numbers to route incoming caller traffic to this agent.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.calling?.outbound ?? true}
                  onChange={e => handleFieldChange('calling', 'outbound', e.target.checked)}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Enable Outbound Dialing
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Allow automated campaigns and speed-to-lead follow-ups to dial out with this agent.
                  </div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Call Transfer Mode
                </label>
                <select
                  value={formData.calling?.transferPreference || 'warm_transfer'}
                  onChange={e => handleFieldChange('calling', 'transferPreference', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="warm_transfer">Warm Transfer (AI briefs human before handoff)</option>
                  <option value="blind_transfer">Blind Transfer (Immediate SIP bridge)</option>
                  <option value="disabled">Disabled (No live human transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Human Escalation Phone Number
                </label>
                <input
                  type="text"
                  value={formData.calling?.transferPhone || ''}
                  onChange={e => handleFieldChange('calling', 'transferPhone', e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  End of Call Behavior
                </label>
                <select
                  value={formData.calling?.endOfCallBehavior || 'polite_goodbye'}
                  onChange={e => handleFieldChange('calling', 'endOfCallBehavior', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="polite_goodbye">Polite Goodbye & Hang Up</option>
                  <option value="send_calendar_invite">Send Calendar Invite + Hang Up</option>
                  <option value="send_whatsapp_catalog">Dispatch WhatsApp Catalog + Hang Up</option>
                  <option value="create_zendesk_ticket">Create Zendesk Ticket</option>
                </select>
              </div>
            </div>

            {/* Duration Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Max Call Duration Limit</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {Math.floor((formData.calling?.maxCallDuration || 600) / 60)} minutes (
                    {formData.calling?.maxCallDuration || 600}s)
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="1800"
                  step="60"
                  value={formData.calling?.maxCallDuration || 600}
                  onChange={e =>
                    handleFieldChange('calling', 'maxCallDuration', Number(e.target.value))
                  }
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 min</span>
                  <span>10 mins</span>
                  <span>30 mins</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Silence Timeout (Re-prompt Trigger)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {formData.calling?.silenceTimeout || 6} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={formData.calling?.silenceTimeout || 6}
                  onChange={e =>
                    handleFieldChange('calling', 'silenceTimeout', Number(e.target.value))
                  }
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>3s (Aggressive)</span>
                  <span>6s (Recommended)</span>
                  <span>15s (Patient)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: LANGUAGES */}
      {activeTab === 'language' && (
        <Card className="space-y-5">
          <CardHeader
            title="Multilingual Configuration"
            subtitle="Configure Indian regional dialect support: English, Hindi, and Gujarati"
            icon={Globe}
          />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Supported Languages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'en', name: 'English (Indian / Global)' },
                  { id: 'hi', name: 'Hindi (हिन्दी)' },
                  { id: 'gu', name: 'Gujarati (ગુજરાતી)' },
                ].map(lang => {
                  const supported = formData.language?.supportedLanguages || [];
                  const isChecked = supported.includes(lang.id);
                  return (
                    <label
                      key={lang.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const current = [...(formData.language?.supportedLanguages || [])];
                          const next = e.target.checked
                            ? [...current, lang.id]
                            : current.filter(x => x !== lang.id);
                          handleFieldChange('language', 'supportedLanguages', next);
                        }}
                        className="rounded text-indigo-600 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {lang.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Starting Language
                </label>
                <select
                  value={formData.language?.primaryLanguage || 'en'}
                  onChange={e => handleFieldChange('language', 'primaryLanguage', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.language?.autoDetect ?? true}
                    onChange={e => handleFieldChange('language', 'autoDetect', e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Enable Real-Time Automatic Language Detection
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Automatically detects caller speech in Hindi or Gujarati and switches audio models.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Language Switching Prompt Directives
              </label>
              <textarea
                rows={3}
                value={formData.language?.languageSwitchPrompt || ''}
                onChange={e =>
                  handleFieldChange('language', 'languageSwitchPrompt', e.target.value)
                }
                placeholder="e.g. When caller greets with 'Namaste' or responds in Hindi, smoothly transition to courteous Hindi phrasing."
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: VOICE & PERSONA */}
      {activeTab === 'voice' && (
        <Card className="space-y-5">
          <CardHeader
            title="Voice Model & Personality"
            subtitle="Select neural voice engine and test audio output"
            icon={Mic}
          />
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Voice Engine Provider
                </label>
                <select
                  value={formData.voice?.provider || 'VoicePilot Neural'}
                  onChange={e => handleFieldChange('voice', 'provider', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="VoicePilot Neural (ElevenLabs compatible)">VoicePilot Neural (ElevenLabs Ultra-Low Latency)</option>
                  <option value="VoicePilot Neural (OpenAI Realtime compatible)">VoicePilot Neural (OpenAI Realtime WebSocket)</option>
                  <option value="VoicePilot Multilingual DeepTone">VoicePilot DeepTone (Optimized for Gujarati / Hindi)</option>
                  <option value="VoicePilot Neural (Cartesia compatible)">VoicePilot Sonic (Cartesia 95ms Streaming)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Voice Model Selection
                </label>
                <select
                  value={formData.voice?.voiceId || 'neer-in-warm'}
                  onChange={e => handleFieldChange('voice', 'voiceId', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="neer-in-warm">Neeraj — Confident Indian Male (English / Hindi)</option>
                  <option value="priya-in-gentle">Priya — Empathetic Indian Female (Healthcare / Support)</option>
                  <option value="meera-gu-warm">Meera — Authentic Gujarati & Hindi Female</option>
                  <option value="aarav-en-tech">Aarav — Crisp Silicon Valley Male</option>
                  <option value="vikram-executive">Vikram — Senior Enterprise B2B Executive Male</option>
                  <option value="ananya-in-finance">Ananya — Polite Financial Services Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tone and Persona Style
                </label>
                <select
                  value={formData.voice?.tone || 'Professional & Empathetic'}
                  onChange={e => handleFieldChange('voice', 'tone', e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="Professional & Empathetic">Professional & Empathetic</option>
                  <option value="Formal & Authoritative">Formal & Authoritative</option>
                  <option value="Friendly & Casual">Friendly & Casual</option>
                  <option value="Efficient & Concise">Efficient & Concise</option>
                  <option value="Courteous & Welcoming Gujarati">Courteous & Welcoming Gujarati</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Speaking Speed Multiplier
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={formData.voice?.speed || 1.0}
                    onChange={e =>
                      handleFieldChange('voice', 'speed', parseFloat(e.target.value))
                    }
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 w-12 text-right">
                    {formData.voice?.speed || 1.0}x
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Preview Box */}
            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Voice Sample Preview
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300">
                    Demo Audio
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{formData.voice?.previewAudioText || 'Namaste! How may I assist you today?'}"
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleVoicePreview}
                disabled={isPlayingPreview}
                icon={Volume2}
                className="shrink-0"
              >
                {isPlayingPreview ? 'Simulating Playback...' : 'Listen to Preview'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: INSTRUCTIONS & SYSTEM PROMPT */}
      {activeTab === 'instructions' && (
        <Card className="space-y-5">
          <CardHeader
            title="Conversation Directives & System Prompt"
            subtitle="Fine-tune how the voice agent responds, qualifies, and escalates conversations"
            icon={MessageSquare}
          />
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Master System Prompt (LLM Instructions)
                </label>
                <span className="text-[11px] text-slate-400">
                  {(formData.instructions?.systemPrompt || '').length} characters
                </span>
              </div>
              <textarea
                rows={8}
                value={formData.instructions?.systemPrompt || ''}
                onChange={e => handleFieldChange('instructions', 'systemPrompt', e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Prohibited Topics (Safety & Boundary Guardrails)
              </label>
              <textarea
                rows={3}
                value={(formData.instructions?.prohibitedTopics || []).join('\n')}
                onChange={e =>
                  handleFieldChange(
                    'instructions',
                    'prohibitedTopics',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                placeholder="Enter topics separated by line breaks. (e.g. Never ask for credit card OTPs or guarantee unauthorized returns)"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Escalation Protocol
              </label>
              <input
                type="text"
                value={formData.instructions?.escalationRules || ''}
                onChange={e =>
                  handleFieldChange('instructions', 'escalationRules', e.target.value)
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: BEHAVIOR */}
      {activeTab === 'behavior' && (
        <Card className="space-y-5">
          <CardHeader
            title="Turn-Taking & Conversational Behavior"
            subtitle="Configure barge-in interruption sensitivity and response length"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Interruption Handling (Barge-in)
              </label>
              <select
                value={formData.behavior?.interruptionHandling || 'graceful_yield'}
                onChange={e =>
                  handleFieldChange('behavior', 'interruptionHandling', e.target.value)
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              >
                <option value="graceful_yield">Graceful Yield (AI immediately pauses speech)</option>
                <option value="wait_until_pause">Finish Current Sentence before listening</option>
                <option value="ignore">Disable Barge-in (Complete full thought)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Maximum Response Length: {formData.behavior?.maxResponseLength || 100} words
              </label>
              <input
                type="range"
                min="40"
                max="250"
                step="10"
                value={formData.behavior?.maxResponseLength || 100}
                onChange={e =>
                  handleFieldChange('behavior', 'maxResponseLength', Number(e.target.value))
                }
                className="w-full mt-2 accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Concise (40w)</span>
                <span>Balanced (100w)</span>
                <span>Explanatory (250w)</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Call Completion Conditions
              </label>
              <input
                type="text"
                value={formData.behavior?.callCompletionConditions || ''}
                onChange={e =>
                  handleFieldChange('behavior', 'callCompletionConditions', e.target.value)
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: POST-CALL EXTRACTION */}
      {activeTab === 'extraction' && (
        <Card className="space-y-5">
          <CardHeader
            title="Post-Call Intelligence & Structured Extraction"
            subtitle="Automatically extract structured fields into CRM schemas upon call conclusion"
            icon={Layers}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.extraction?.summaryEnabled ?? true}
                  onChange={e =>
                    handleFieldChange('extraction', 'summaryEnabled', e.target.checked)
                  }
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Generate AI Executive Call Summary
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.extraction?.leadInterestScoring ?? true}
                  onChange={e =>
                    handleFieldChange('extraction', 'leadInterestScoring', e.target.checked)
                  }
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Calculate Lead Interest Score (High/Medium/Low)
                </span>
              </label>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Custom Extracted Attributes
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {(formData.extraction?.customFields || []).map((field, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {field.name}
                      </span>
                      <span className="ml-2 text-slate-400 font-mono text-[11px]">
                        ({field.type})
                      </span>
                      {field.description && (
                        <p className="text-slate-500 text-[11px] mt-0.5">{field.description}</p>
                      )}
                    </div>
                    <Badge variant="default" size="sm">
                      Extracted
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: ACTIVITY HISTORY */}
      {activeTab === 'history' && (
        <Card className="space-y-4" padding="p-0">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Calls Handled by {agent.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              History of conversations completed using this agent profile
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agentCalls.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/calls/${c.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {c.contactName}
                    </td>
                    <td className="py-3 px-4">{c.language}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(c.startTime)}</td>
                    <td className="py-3 px-4 font-mono">{formatDuration(c.durationSeconds)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.outcome} />
                    </td>
                    <td className="py-3 px-4 text-right text-indigo-600 font-semibold">
                      Inspect &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Test Call Modal */}
      <Modal
        isOpen={testCallModalOpen}
        onClose={() => setTestCallModalOpen(false)}
        title={`Simulate Call with ${agent.name}`}
        subtitle="Test conversation responses without real carrier connection"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
            <strong>Simulated Sandbox:</strong> This will place a simulated call on the Live Calls monitor using the currently active instructions.
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Language
            </label>
            <select className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setTestCallModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={PhoneCall}
              onClick={() => {
                setTestCallModalOpen(false);
                toast.success(`Simulated call session opened for ${agent.name}.`);
                navigate('/live-calls');
              }}
            >
              Start Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AgentDetailPage;
