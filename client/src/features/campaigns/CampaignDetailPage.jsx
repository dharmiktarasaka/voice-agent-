import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Megaphone,
  Play,
  Pause,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import ChartCard from '../../components/charts/ChartCard';
import { campaignsService } from '../../services/campaignsService';
import { initialCalls } from '../../data/demoCalls';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatNumber, formatDuration, formatDateTime } from '../../utils/formatters';

export function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      setLoading(true);
      try {
        const camp = await campaignsService.getCampaignById(id);
        setCampaign(camp);
      } catch (err) {
        toast.error('Campaign not found.');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [id, navigate]);

  if (loading || !campaign) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Megaphone className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        Loading campaign metrics...
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const action = campaign.status === 'Running' ? 'pause' : 'resume';
    const confirmed = await confirm({
      title: `${action === 'resume' ? 'Launch' : 'Pause'} Outbound Campaign?`,
      message: `Are you sure you want to ${action} "${campaign.name}"?`,
      confirmText: action === 'resume' ? 'Simulate Launch' : 'Pause Campaign',
      variant: action === 'resume' ? 'primary' : 'warning',
    });
    if (confirmed) {
      try {
        const updated = await campaignsService.toggleCampaignStatus(campaign.id);
        setCampaign(updated);
        toast.success(`Campaign is now ${updated.status}.`);
      } catch (err) {
        toast.error('Failed to update status.');
      }
    }
  };

  const chartData = [
    { name: 'Eligible', value: campaign.eligibleContacts, color: '#94A3B8' },
    { name: 'Attempted', value: campaign.attemptedCalls, color: '#6366F1' },
    { name: 'Answered', value: campaign.answeredCalls, color: '#3B82F6' },
    { name: 'Qualified', value: campaign.qualifiedLeads, color: '#10B981' },
    { name: 'Failed', value: campaign.failureCount, color: '#EF4444' },
  ];

  const progressPercent = campaign.eligibleContacts
    ? Math.round((campaign.attemptedCalls / campaign.eligibleContacts) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assigned Agent: {campaign.agentName} • Timezone: {campaign.timeZone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={campaign.status === 'Running' ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggleStatus}
            icon={campaign.status === 'Running' ? Pause : Play}
          >
            {campaign.status === 'Running' ? 'Pause Campaign' : 'Simulate Launch'}
          </Button>
        </div>
      </div>

      {/* Progress & KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-4">
          <span className="text-xs text-slate-500 uppercase font-semibold">Contacts Dialed</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(campaign.attemptedCalls)} / {formatNumber(campaign.eligibleContacts)}
          </div>
          <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {progressPercent}% Complete
          </div>
        </Card>

        <Card padding="p-4">
          <span className="text-xs text-slate-500 uppercase font-semibold">Answer Rate</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {campaign.attemptedCalls
              ? `${Math.round((campaign.answeredCalls / campaign.attemptedCalls) * 100)}%`
              : '0%'}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {formatNumber(campaign.answeredCalls)} connected calls
          </div>
        </Card>

        <Card padding="p-4">
          <span className="text-xs text-slate-500 uppercase font-semibold">Qualified Leads</span>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatNumber(campaign.qualifiedLeads)}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            {campaign.conversionRate}% qualification conversion
          </div>
        </Card>

        <Card padding="p-4">
          <span className="text-xs text-slate-500 uppercase font-semibold">Calling Window</span>
          <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
            {campaign.callingWindowStart} - {campaign.callingWindowEnd}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Max {campaign.maxDailyCalls} dials/day
          </div>
        </Card>
      </div>

      {/* Campaign Visual Pipeline Chart & Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Campaign Dialing Pipeline"
          subtitle="Funnel from eligible contacts to qualified sales conversations"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Safeguards Card */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader
            title="Compliance & Safeguards"
            subtitle="Configured parameters enforcing consumer telecommunication laws"
            icon={ShieldCheck}
          />

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Prior Express Consent:</strong> Certified for all contact records in batch.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>National DNC Scrubbing:</strong> Numbers matching suppression lists are omitted.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong>Permitted Calling Window:</strong> Restricted to recipient local hours ({campaign.callingWindowStart} - {campaign.callingWindowEnd}).
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Results Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Dialed Contact Results in Campaign
          </h3>
          <span className="text-xs text-slate-400">Sample of latest records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {initialCalls.slice(0, 4).map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/calls/${c.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {c.contactName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {c.phoneNumber}
                  </td>
                  <td className="py-3 px-4">{c.language}</td>
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
    </div>
  );
}

export default CampaignDetailPage;
