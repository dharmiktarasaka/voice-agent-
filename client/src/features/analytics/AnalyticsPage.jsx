import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Calendar,
  Layers,
  Globe,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import Badge from '../../components/ui/Badge';
import {
  analyticsFormulas,
  analyticsDateRanges,
  demoDurationDistribution,
  demoCampaignComparison,
} from '../../data/demoAnalytics';
import {
  demoLanguageDistribution,
  demoAgentPerformance,
  demoOutcomeDistribution,
} from '../../data/demoDashboard';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const metrics = analyticsDateRanges[selectedRange] || analyticsDateRanges['30d'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analytics & Performance Insights
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Simulated Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluate conversion rates, unit economics, duration bands, and multi-language efficiency.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last Quarter' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRange(r.id)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedRange === r.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards with Formula Tooltips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Call Volume */}
        <Card padding="p-4" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Call Volume</span>
            <PhoneCall className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(metrics.totalVolume)}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Inbound inquiries and automated campaign dials
          </p>
        </Card>

        {/* Answer Rate */}
        <Card padding="p-4" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              Answer Rate
              <span title={analyticsFormulas.answerRate} className="cursor-help text-slate-400 hover:text-indigo-500">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {metrics.answerRate}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 truncate">
            Formula: {analyticsFormulas.answerRate}
          </p>
        </Card>

        {/* Lead Qualification Rate */}
        <Card padding="p-4" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              Qualified Lead Rate
              <span title={analyticsFormulas.qualificationRate} className="cursor-help text-slate-400 hover:text-indigo-500">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.qualificationRate}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 truncate">
            Formula: {analyticsFormulas.qualificationRate}
          </p>
        </Card>

        {/* Cost per Qualified Lead */}
        <Card padding="p-4" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              Cost per Qualified Lead
              <span title={analyticsFormulas.costPerQualifiedLead} className="cursor-help text-slate-400 hover:text-indigo-500">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {metrics.costPerLead}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Avg call cost: {metrics.costPerCall} • ~92% cheaper than BPO
          </p>
        </Card>
      </div>

      {/* Main Charts: Volume Over Time & Duration Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume over selected period */}
        <ChartCard
          title="Call Trajectory & Qualified Outcomes"
          subtitle={`Trend progression for selected period (${selectedRange.toUpperCase()})`}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.callsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey={selectedRange === 'today' ? 'time' : selectedRange === '7d' ? 'day' : selectedRange === '30d' ? 'week' : 'month'}
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
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
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="calls" name="Total Calls" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="answered" name="Answered" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qualified" name="Qualified Leads" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Duration Distribution */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader
              title="Call Duration Distribution"
              subtitle="Percentage of calls by elapsed length"
              icon={Clock}
            />
            <div className="space-y-3 mt-4">
              {demoDurationDistribution.map(item => (
                <div key={item.range} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.range}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.percentage}% ({formatNumber(item.count)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${item.percentage * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
            39.3% of callers stay in the optimal 2-4 minute sweet spot for high conversion.
          </div>
        </Card>
      </div>

      {/* Secondary Charts: Agent Conversion Comparison & Campaign Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Conversion Comparison */}
        <ChartCard
          title="Agent Qualification Conversion Rates"
          subtitle="Benchmarking AI personality performance"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demoAgentPerformance}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
              <YAxis
                type="category"
                dataKey="agent"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="conversion" name="Qualification %" fill="#6366F1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Campaign Comparisons Table */}
        <Card padding="p-0" className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Campaign Economics Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Efficiency metrics across active campaign cohorts
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Dials</th>
                  <th className="py-3 px-4">Answered</th>
                  <th className="py-3 px-4">Qual Rate</th>
                  <th className="py-3 px-4 text-right">Cost/Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {demoCampaignComparison.map(c => (
                  <tr key={c.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono">{formatNumber(c.dials)}</td>
                    <td className="py-3 px-4 font-mono">{formatNumber(c.answered)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.qualRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.costPerLead}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;
