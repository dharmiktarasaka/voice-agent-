import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PhoneCall,
  PhoneIncoming,
  Bot,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  Volume2,
  Globe,
  Activity,
  Calendar,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { demoCallsOverTime, demoLanguageDistribution } from '../../data/demoDashboard';
import { initialAgents } from '../../data/demoAgents';
import { initialCalls } from '../../data/demoCalls';
import { formatNumber, formatDuration, formatDateTime } from '../../utils/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // Test Call Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+91 98200 12345');
  const [selectedAgentId, setSelectedAgentId] = useState('agent-1');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isCalling, setIsCalling] = useState(false);

  const handleStartTestCall = e => {
    e.preventDefault();
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setTestModalOpen(false);
      toast.success(`Demo call started with agent to ${phoneNumber}! Opening Live Calls...`);
      navigate('/live-calls');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Friendly Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Voice Calling Made Simple
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to VoicePilot AI!
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Your friendly AI voice callers make and receive real phone calls in <strong>English, Hindi, and Gujarati</strong>. They qualify leads, book appointments, and write summaries automatically.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setTestModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              Try a Test Call Now
            </button>

            <button
              onClick={() => navigate('/agents/new')}
              className="px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Voice Caller
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3-Step Simple Guide for Beginners */}
      <Card padding="p-5" className="border-indigo-100 dark:border-indigo-950/80 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            How It Works in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Choose an AI Caller
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick one of our pre-built callers like <strong>Rohan</strong> (Real Estate), <strong>Priya</strong> (Clinic), or <strong>Meera</strong> (Retail), or create your own.
            </p>
            <Link to="/agents" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-1">
              View AI Callers &rarr;
            </Link>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Start Calling
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload your customer phone list or dial single numbers. Your AI calls and speaks naturally in customer's preferred language.
            </p>
            <Link to="/campaigns" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-1">
              Start a Campaign &rarr;
            </Link>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Get Summaries & Leads
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Read simple bullet summaries, listen to call recordings, and view interested customer details automatically saved.
            </p>
            <Link to="/calls" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-1">
              Check Call Logs &rarr;
            </Link>
          </div>
        </div>
      </Card>

      {/* 4 Simple Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calls Handled */}
        <Card padding="p-5" className="flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Total Calls Handled</span>
              <PhoneCall className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {formatNumber(14820)}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">12,480 people answered</span>
          </div>
        </Card>

        {/* Interested Leads */}
        <Card padding="p-5" className="flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Interested / Qualified Leads</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatNumber(3542)}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            28.4% of callers wanted to proceed
          </div>
        </Card>

        {/* Average Talk Time */}
        <Card padding="p-5" className="flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Average Conversation Time</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              3m 24s
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Natural, human-like call length
          </div>
        </Card>

        {/* Languages Active */}
        <Card padding="p-5" className="flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Languages Supported</span>
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              English, Hindi, Gujarati
            </div>
          </div>
          <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Auto-detects caller language
          </div>
        </Card>
      </div>

      {/* Main Row: Ready AI Callers & Call Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ready AI Callers Box (Left 1 col) */}
        <Card padding="p-5" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                My AI Callers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready to answer or make calls
              </p>
            </div>
            <Link to="/agents" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              See All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {initialAgents.slice(0, 3).map(agent => (
              <div
                key={agent.id}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {agent.name.split('-')[0]}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {agent.purpose} • Speaks: {agent.language?.supportedLanguages?.map(l => l.toUpperCase()).join(', ')}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span>{agent.stats?.totalCalls} calls handled</span>
                  <span>Configure &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/agents/new')}
            className="w-full"
            icon={Plus}
          >
            Create Another AI Caller
          </Button>
        </Card>

        {/* Simple Call Volume Trend (Right 2 cols) */}
        <Card padding="p-5" className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Daily Call Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Calls made and answered over the last 10 days
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Demo Activity
              </span>
            </div>

            <div className="w-full h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoCallsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="friendlyBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Calls"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#friendlyBlue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="answered"
                    name="Answered Calls"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-indigo-600" /> Total Dialed
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
              </span>
            </div>
            <span>84.2% overall answer rate</span>
          </div>
        </Card>
      </div>

      {/* Recent Calls Section with Simple Inspection */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Call Results
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any call to read what the customer said or listen to the conversation
            </p>
          </div>
          <Link
            to="/calls"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Calls &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {initialCalls.slice(0, 5).map(call => (
            <div
              key={call.id}
              onClick={() => navigate(`/calls/${call.id}`)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                  {call.contactName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {call.contactName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {call.phoneNumber} • Spoke with {call.agentName.split('-')[0]} in {call.language}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="text-right text-xs">
                  <div className="font-mono text-slate-700 dark:text-slate-300">
                    {formatDuration(call.durationSeconds)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formatDateTime(call.startTime)}
                  </div>
                </div>

                <StatusBadge status={call.outcome} />

                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:underline">
                  Read &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Simple Test Call Modal */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title="Test Your AI Voice Caller"
        subtitle="Simulate a real phone call in demo mode"
      >
        <form onSubmit={handleStartTestCall} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200">
            <strong>How it works:</strong> Clicking Start Call opens the <strong>Live Calls</strong> page where you can see the AI greeting, transcript turns in real time, and test customer replies.
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select AI Caller
            </label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            >
              <option value="agent-1">Rohan — Real Estate & Property Inquiry (Hindi/English)</option>
              <option value="agent-2">Priya — Dental & Health Clinic Booking (English/Hindi)</option>
              <option value="agent-3">Meera — Retail & Wholesale Orders (Gujarati/Hindi)</option>
              <option value="agent-4">Aarav — Tech Support (English)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="en">English</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setTestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCalling}
              icon={PhoneCall}
            >
              Start Demo Call
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DashboardPage;
