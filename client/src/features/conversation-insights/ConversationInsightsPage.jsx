import React from 'react';
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ThumbsDown,
  MessageSquare,
  TrendingDown,
  Globe,
  Tag,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
  demoObjections,
  demoTopFaqs,
  demoUnresolvedQuestions,
  demoFailureReasons,
  demoExtractedRequirements,
} from '../../data/demoInsights';
import { formatNumber } from '../../utils/formatters';

export function ConversationInsightsPage() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Conversation Insights & Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Demo Model Synthetics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-extracted customer objections, unhandled questions, and call failure patterns across all languages.
          </p>
        </div>

        <Badge variant="purple" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> 14,820 Dialogs Analyzed
        </Badge>
      </div>

      {/* Top Customer Objections & FAQs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customer Objections */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader
            title="Common Customer Objections"
            subtitle="Frequent hesitation points detected during qualification turns"
            icon={ThumbsDown}
          />
          <div className="space-y-3">
            {demoObjections.map(obj => (
              <div
                key={obj.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {obj.objection}
                  </span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono shrink-0">
                    {obj.percentage} ({obj.frequency})
                  </span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <strong className="text-indigo-600 dark:text-indigo-400">Recommended Prompt Counter:</strong>{' '}
                  {obj.suggestedHandling}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Most Frequently Asked Questions */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader
            title="Top FAQs Asked by Callers"
            subtitle="Questions answered directly from the Knowledge Base"
            icon={HelpCircle}
          />
          <div className="space-y-3">
            {demoTopFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    "{faq.question}"
                  </span>
                  <span className="font-mono text-slate-500 font-medium shrink-0">
                    {faq.count} times
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>AI Resolution Rate:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {faq.resolutionRate} Successful
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Unresolved Questions & Failure Dropoff Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unresolved Questions (KB Gaps) */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader
            title="Unresolved Questions (KB Gaps)"
            subtitle="Queries where the voice agent initiated handoff or lacked knowledge"
            icon={AlertTriangle}
          />
          <div className="space-y-3">
            {demoUnresolvedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    "{q.question}"
                  </span>
                  <Badge variant="warning" size="sm">
                    {q.impact} Priority
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Occurrences: <strong>{q.count} callers</strong> • Suggested Action: {q.action}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Common Call Failure Reasons */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader
            title="Call Failure & Disconnect Points"
            subtitle="Root cause analysis of abrupt hang-ups and drops"
            icon={TrendingDown}
          />
          <div className="space-y-3">
            {demoFailureReasons.map((fail, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-800 dark:text-slate-200">
                    {fail.reason}
                  </span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {fail.percentage}% ({fail.count})
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${fail.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Frequently Extracted Lead Requirements */}
      <Card padding="p-5" className="space-y-4">
        <CardHeader
          title="Most Frequently Extracted Lead Parameters"
          subtitle="Key buyer requirements successfully parsed by NLP post-call extraction"
          icon={Tag}
        />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {demoExtractedRequirements.map(req => (
            <div
              key={req.field}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1"
            >
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {req.percentage} of Leads
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {req.field}
              </div>
              <span className="text-[11px] text-slate-500">
                {formatNumber(req.count)} occurrences
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ConversationInsightsPage;
