import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  RefreshCw,
  Clock,
  Calendar,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { callsService } from '../../services/callsService';
import { agentsService } from '../../services/agentsService';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/csv';
import { formatDateTime, formatDuration } from '../../utils/formatters';

export function CallHistoryPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [calls, setCalls] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadCalls = async () => {
    setLoading(true);
    try {
      const [callList, agentList] = await Promise.all([
        callsService.getCalls({
          search,
          direction: directionFilter,
          agentId: agentFilter,
          language: languageFilter,
          status: statusFilter,
          outcome: outcomeFilter,
        }),
        agentsService.getAgents(),
      ]);
      setCalls(callList);
      setAgents(agentList);
    } catch (err) {
      toast.error('Failed to load call history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
    setCurrentPage(1);
  }, [search, directionFilter, agentFilter, languageFilter, statusFilter, outcomeFilter]);

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedIds(calls.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleExportCsv = () => {
    const rowsToExport = calls.map(c => ({
      CallID: c.id,
      ContactName: c.contactName,
      Company: c.contactCompany,
      PhoneNumber: c.phoneNumber,
      Direction: c.direction,
      Agent: c.agentName,
      Language: c.language,
      StartTime: c.startTime,
      DurationSec: c.durationSeconds,
      Status: c.status,
      Outcome: c.outcome,
      Cost: c.cost,
      Sentiment: c.sentiment,
    }));
    exportToCsv(`voicepilot_calls_${new Date().toISOString().slice(0, 10)}.csv`, rowsToExport);
    toast.success(`Exported ${rowsToExport.length} call records to CSV.`, 'CSV Generated');
  };

  // Pagination slice
  const totalPages = Math.ceil(calls.length / pageSize) || 1;
  const paginatedCalls = calls.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Call History
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {calls.length} Logged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, inspect full transcripts, and export historical call records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            icon={Download}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contact, phone, call ID..."
            className="flex-1"
          />

          <div className="flex flex-wrap items-center gap-2">
            {/* Direction Filter */}
            <select
              value={directionFilter}
              onChange={e => setDirectionFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Direction: All</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>

            {/* Agent Filter */}
            <select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Agent: All</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name.split('-')[0]}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Language: All</option>
              <option value="en">English (EN)</option>
              <option value="hi">Hindi (HI)</option>
              <option value="gu">Gujarati (GU)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Status: All (8 States)</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="ringing">Ringing</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
              <option value="no answer">No Answer</option>
              <option value="busy">Busy</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Outcome Filter */}
            <select
              value={outcomeFilter}
              onChange={e => setOutcomeFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Outcome: All</option>
              <option value="Qualified">Qualified Lead</option>
              <option value="Appointment">Appointment Booked</option>
              <option value="Callback">Callback Requested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Escalated">Escalated to Human</option>
              <option value="Voicemail">Voicemail</option>
            </select>
          </div>
        </div>

        {/* Multi-selection Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
              {selectedIds.length} calls selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`Exporting ${selectedIds.length} selected calls.`);
                  const selectedRows = calls
                    .filter(c => selectedIds.includes(c.id))
                    .map(c => ({
                      CallID: c.id,
                      Contact: c.contactName,
                      Phone: c.phoneNumber,
                      Agent: c.agentName,
                      Status: c.status,
                      Outcome: c.outcome,
                    }));
                  exportToCsv('selected_calls.csv', selectedRows);
                }}
              >
                Export Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Calls Table */}
      <Card padding="p-0" className="overflow-hidden">
        {calls.length === 0 ? (
          <EmptyState
            icon={PhoneCall}
            title="No call records found"
            description="No calls match your active search and filter parameters. Try clearing filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setDirectionFilter('all');
              setAgentFilter('all');
              setLanguageFilter('all');
              setStatusFilter('all');
              setOutcomeFilter('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === calls.length && calls.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-indigo-600"
                    />
                  </th>
                  <th className="py-3 px-4">Call ID & Contact</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Agent</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCalls.map(c => {
                  const isChecked = selectedIds.includes(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/calls/${c.id}`)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => handleSelectOne(c.id, e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {c.contactName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {c.phoneNumber} • {c.id}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {c.direction === 'inbound' ? (
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                            <ArrowDownLeft className="w-3.5 h-3.5" /> Inbound
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Outbound
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {c.agentName.split('-')[0]}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.language}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {formatDateTime(c.startTime)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {formatDuration(c.durationSeconds)}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={c.outcome} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                          View &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={calls.length}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}

export default CallHistoryPage;
