import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger', // danger | warning | primary
  });

  const resolverRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    setConfig({
      title: options.title || 'Are you sure?',
      message: options.message || 'This action cannot be undone.',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant || 'danger',
    });
    setIsOpen(true);
    return new Promise(resolve => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transform transition-all animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  config.variant === 'danger'
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                    : config.variant === 'warning'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                }`}
              >
                {config.variant === 'danger' && <AlertCircle className="w-6 h-6" />}
                {config.variant === 'warning' && <AlertTriangle className="w-6 h-6" />}
                {config.variant === 'primary' && <HelpCircle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {config.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {config.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
              >
                {config.cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${
                  config.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
                    : config.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'
                }`}
              >
                {config.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
}
