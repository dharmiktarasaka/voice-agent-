import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  Percent,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Modal from '../../components/ui/Modal';
import { campaignsService } from '../../services/campaignsService';
import { agentsService } from '../../services/agentsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatNumber, formatDateTime } from '../../utils/formatters';

export function CampaignsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [campaigns, setCampaigns] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create Campaign Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    agentId: 'agent-1',
    purpose: 'Lead Qualification',
    preferredLanguage: 'Hindi & English',
    startDate: '2026-10-25T09:30',
    schedule: 'Mon - Fri (09:30 AM - 06:30 PM)',
    timeZone: 'Asia/Kolkata (IST)',
    maxAttempts: 3,
    retryIntervalHours: 4,
    maxDailyCalls: 500,
    callingWindowStart: '09:30',
    callingWindowEnd: '18:30',
    consentConfirmed: true,
    dncEnforced: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [camps, ags] = await Promise.all([
        campaignsService.getCampaigns({ search, status: statusFilter }),
        agentsService.getAgents(),
      ]);
      setCampaigns(camps);
      setAgents(ags);
    } catch (err) {
      toast.error('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleToggleStatus = async (e, camp) => {
    e.stopPropagation();
    const action = camp.status === 'Running' ? 'pause' : 'resume';
    const confirmed = await confirm({
      title: `${action === 'resume' ? 'Launch' : 'Pause'} Outbound Campaign?`,
      message: `Are you sure you want to ${action} "${camp.name}"? In Phase 1, this toggles simulated dialing progression.`,
      confirmText: action === 'resume' ? 'Simulate Launch' : 'Pause Campaign',
      variant: action === 'resume' ? 'primary' : 'warning',
    });
    if (confirmed) {
      try {
        const updated = await campaignsService.toggleCampaignStatus(camp.id);
        setCampaigns(prev => prev.map(c => (c.id === camp.id ? updated : c)));
        toast.success(`Campaign "${camp.name}" is now ${updated.status}.`);
      } catch (err) {
        toast.error('Could not update campaign status.');
      }
    }
  };

  const handleCreateCampaign = async e => {
    e.preventDefault();
    if (!newCampaign.name.trim()) {
      toast.error('Campaign name is required.');
      return;
    }

    const ag = agents.find(a => a.id === newCampaign.agentId);
    try {
      const created = await campaignsService.createCampaign({
        ...newCampaign,
        agentName: ag ? ag.name : 'Rohan (Real Estate)',
      });
      setCampaigns(prev => [created, ...prev]);
      setCreateModalOpen(false);
      toast.success(`Campaign "${created.name}" created as Draft.`);
    } catch (err) {
      toast.error('Failed to create campaign.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Outbound Campaigns
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {campaigns.length} Active / Scheduled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automate speed-to-lead dialing, festival promotions, and patient reactivation with compliance safeguards.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
          icon={Plus}
        >
          Create Campaign
        </Button>
      </div>

      {/* Compliance & Safety Checklist Banner */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-950 dark:text-amber-200">
              Regulatory Compliance & Calling Window Safeguards Active
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated campaigns strictly enforce recipient timezone windows (09:30 AM - 06:30 PM), National Do Not Call (DNC) registry scrubbing, and explicit prior consent verification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="warning" size="sm">
            DNC Scrubbed
          </Badge>
          <Badge variant="success" size="sm">
            Consent Guard
          </Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full sm:w-80"
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-2"
        >
          <option value="all">All Campaign Statuses</option>
          <option value="running">Running</option>
          <option value="paused">Paused</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map(camp => {
          const progressPercent = camp.eligibleContacts
            ? Math.round((camp.attemptedCalls / camp.eligibleContacts) * 100)
            : 0;

          return (
            <Card
              key={camp.id}
              hover
              onClick={() => navigate(`/campaigns/${camp.id}`)}
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                        {camp.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Assigned Agent: <strong className="text-slate-700 dark:text-slate-300">{camp.agentName}</strong> • {camp.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={camp.status} />
                    <Button
                      variant={camp.status === 'Running' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={e => handleToggleStatus(e, camp)}
                      icon={camp.status === 'Running' ? Pause : Play}
                    >
                      {camp.status === 'Running' ? 'Pause' : 'Simulate Launch'}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-1 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Dialing Progress ({progressPercent}%)
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatNumber(camp.attemptedCalls)} / {formatNumber(camp.eligibleContacts)} dialed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Answered</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {formatNumber(camp.answeredCalls)} ({camp.attemptedCalls ? Math.round((camp.answeredCalls / camp.attemptedCalls) * 100) : 0}%)
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Qualified Leads</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatNumber(camp.qualifiedLeads)} ({camp.conversionRate}%)
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Failed Dials</span>
                  <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {camp.failureCount}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Time Window</span>
                  <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                    {camp.callingWindowStart} - {camp.callingWindowEnd}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Outbound Campaign"
        subtitle="Configure dialing parameters, scheduling windows, and compliance consent"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Festive Home Loan Outreach"
              value={newCampaign.name}
              onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned AI Voice Agent
            </label>
            <select
              value={newCampaign.agentId}
              onChange={e => setNewCampaign({ ...newCampaign, agentId: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.purpose})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Daily Calls
              </label>
              <input
                type="number"
                value={newCampaign.maxDailyCalls}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, maxDailyCalls: Number(e.target.value) })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Retries per Lead
              </label>
              <input
                type="number"
                value={newCampaign.maxAttempts}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, maxAttempts: Number(e.target.value) })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Calling Window Start
              </label>
              <input
                type="time"
                value={newCampaign.callingWindowStart}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, callingWindowStart: e.target.value })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Calling Window End
              </label>
              <input
                type="time"
                value={newCampaign.callingWindowEnd}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, callingWindowEnd: e.target.value })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Compliance Checklist Checkbox */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                required
                checked={newCampaign.consentConfirmed}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, consentConfirmed: e.target.checked })
                }
                className="rounded text-indigo-600"
              />
              I certify that all contacts in this campaign have consented to outreach.
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                required
                checked={newCampaign.dncEnforced}
                onChange={e =>
                  setNewCampaign({ ...newCampaign, dncEnforced: e.target.checked })
                }
                className="rounded text-indigo-600"
              />
              Enforce automated National DNC suppression & opt-out rules.
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Plus}>
              Create Draft Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CampaignsPage;
