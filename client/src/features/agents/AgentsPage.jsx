import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import AgentCard from './AgentCard';
import { agentsService } from '../../services/agentsService';
import { useToast } from '../../context/ToastContext';

export function AgentsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await agentsService.getAgents({
        search,
        status: statusFilter,
        language: languageFilter,
        direction: directionFilter,
      });
      setAgents(data);
    } catch (err) {
      toast.error('Failed to load agents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [search, statusFilter, languageFilter, directionFilter]);

  const handleStatusToggle = async id => {
    try {
      const updated = await agentsService.toggleAgentStatus(id);
      setAgents(prev => prev.map(a => (a.id === id ? updated : a)));
      toast.success(
        `Agent "${updated.name}" is now ${updated.status}.`,
        'Status Updated'
      );
    } catch (err) {
      toast.error('Could not update agent status.');
    }
  };

  const handleDuplicate = async id => {
    try {
      const copy = await agentsService.duplicateAgent(id);
      setAgents(prev => [copy, ...prev]);
      toast.success(`Duplicated agent as "${copy.name}".`, 'Agent Duplicated');
    } catch (err) {
      toast.error('Could not duplicate agent.');
    }
  };

  const handleDelete = async id => {
    try {
      await agentsService.deleteAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
      toast.success('Agent has been deleted.', 'Agent Removed');
    } catch (err) {
      toast.error('Could not delete agent.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              AI Voice Agents
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {agents.length} Configured
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build, test, and tune conversational prompts and voice behavior in English, Hindi, and Gujarati.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/agents/new')}
          icon={Plus}
        >
          Create AI Agent
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by agent name, purpose, business..."
            className="w-full sm:w-64"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Languages</option>
            <option value="en">English (EN)</option>
            <option value="hi">Hindi (HI)</option>
            <option value="gu">Gujarati (GU)</option>
          </select>

          {/* Direction Filter */}
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Directions</option>
            <option value="inbound">Inbound Only</option>
            <option value="outbound">Outbound Only</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Agents Grid or List */}
      {agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No voice agents found"
          description={
            search || statusFilter !== 'all' || languageFilter !== 'all' || directionFilter !== 'all'
              ? 'Try adjusting your search criteria or clearing active filters.'
              : 'Create your first AI voice calling agent to automate inbound support or outbound sales campaigns.'
          }
          actionLabel="Create AI Agent"
          onAction={() => navigate('/agents/new')}
          actionIcon={Plus}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onStatusToggle={handleStatusToggle}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {agent.businessName} • {agent.purpose} • Languages:{' '}
                    {agent.language?.supportedLanguages?.map(l => l.toUpperCase()).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                <div className="text-right text-xs hidden md:block">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {agent.stats?.totalCalls || 0} calls
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {agent.stats?.qualificationRate || 0}% qual rate
                  </div>
                </div>

                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {agent.status}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/agents/${agent.id}`);
                  }}
                >
                  Configure &rarr;
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentsPage;
