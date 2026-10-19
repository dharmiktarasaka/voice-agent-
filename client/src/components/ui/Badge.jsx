import React from 'react';

export function Badge({
  children,
  variant = 'default', // default | primary | success | warning | danger | info | purple
  size = 'md', // sm | md
  dot = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    primary:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    success:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    warning:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    danger:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    info:
      'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
    purple:
      'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toLowerCase();

  if (s === 'active' || s === 'running' || s === 'completed' || s === 'indexed') {
    return (
      <Badge variant="success" dot size="sm">
        {status}
      </Badge>
    );
  }

  if (s === 'in progress' || s === 'ringing' || s === 'processing') {
    return (
      <Badge variant="primary" dot size="sm" className="animate-pulse-subtle">
        {status}
      </Badge>
    );
  }

  if (s === 'paused' || s === 'queued' || s === 'scheduled' || s === 'ready for processing') {
    return (
      <Badge variant="warning" dot size="sm">
        {status}
      </Badge>
    );
  }

  if (s === 'failed' || s === 'cancelled' || s === 'archived' || s === 'do not contact') {
    return (
      <Badge variant="danger" dot size="sm">
        {status}
      </Badge>
    );
  }

  if (s === 'no answer' || s === 'busy') {
    return (
      <Badge variant="info" dot size="sm">
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="default" dot size="sm">
      {status}
    </Badge>
  );
}

export default Badge;
