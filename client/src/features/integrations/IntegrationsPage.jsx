import React, { useState } from 'react';
import {
  Plug,
  Radio,
  PhoneCall,
  PhoneForwarded,
  Database,
  Calendar,
  Workflow,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { initialIntegrations } from '../../data/demoIntegrations';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';

export function IntegrationsPage() {
  const toast = useToast();
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  const iconMap = {
    Radio,
    PhoneCall,
    PhoneForwarded,
    Database,
    Calendar,
    Workflow,
    Mail,
  };

  const handleOpenConfigure = item => {
    setSelectedIntegration(item);
    setFieldValues({});
    setConfigureModalOpen(true);
  };

  const handleSaveConfiguration = e => {
    e.preventDefault();
    if (!selectedIntegration) return;

    setIntegrations(prev =>
      prev.map(item =>
        item.id === selectedIntegration.id
          ? { ...item, status: 'Connected', lastSync: new Date().toISOString() }
          : item
      )
    );
    setConfigureModalOpen(false);
    toast.success(
      `Integration credentials updated in Phase 1 demo sandbox.`,
      'Config Saved'
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Integrations & Telephony Connectors
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Phase 1 Standalone Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect telephony providers, neural audio synthesis engines, CRM pipelines, and databases.
          </p>
        </div>

        <Badge variant="purple" size="md">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Zero Outbound Auth Calls (Phase 1)
        </Badge>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-start gap-3 text-xs text-indigo-950 dark:text-indigo-200">
        <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Client-Side Security Safeguard:</strong>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            During Phase 1, all integration interfaces are purely frontend abstractions. Real API keys and credentials are never transmitted over the network or saved to LocalStorage. Phase 2 backend will manage encrypted server-side credential vaulting.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(item => {
          const Icon = iconMap[item.icon] || Plug;
          return (
            <Card
              key={item.id}
              className="p-5 flex flex-col justify-between h-full border border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Sync: {item.lastSync === 'Never' ? 'Never' : formatDateTime(item.lastSync)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenConfigure(item)}
                >
                  Configure
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Configure Integration Modal */}
      <Modal
        isOpen={configureModalOpen}
        onClose={() => setConfigureModalOpen(false)}
        title={`Configure ${selectedIntegration?.name}`}
        subtitle="Manage credentials and setup instructions"
        maxWidth="max-w-xl"
      >
        {selectedIntegration && (
          <form onSubmit={handleSaveConfiguration} className="space-y-4 text-xs">
            {/* Setup Instructions */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider block">
                Setup Instructions (Phase 2 & 3 Readiness)
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                {(selectedIntegration.setupInstructions || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              {(selectedIntegration.fields || []).map(f => (
                <div key={f.name}>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={fieldValues[f.name] || ''}
                    onChange={e =>
                      setFieldValues({ ...fieldValues, [f.name]: e.target.value })
                    }
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
              * Phase 1 Demo note: Credentials entered here remain local to this session and will not make live network handshakes.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setConfigureModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save & Verify Connection
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default IntegrationsPage;
