import React, { useState } from 'react';
import { Sparkles, Info, X, ShieldAlert } from 'lucide-react';

export function DemoBanner({
  message = 'Phase 1 Frontend Prototype: Voice agents, live monitoring, and telephony metrics are running in simulated demo mode. No live phone calls are placed.',
  showDismiss = true,
  variant = 'info', // info | warning
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 ${
        variant === 'warning'
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200'
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-900 dark:text-indigo-200'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white shrink-0">
          <Sparkles className="w-3 h-3" />
          Phase 1 Demo
        </span>
        <span className="truncate">{message}</span>
      </div>
      {showDismiss && (
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-0.5"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default DemoBanner;
