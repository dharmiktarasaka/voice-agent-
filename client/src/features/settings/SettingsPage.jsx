import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Bot,
  PhoneCall,
  Bell,
  Palette,
  Shield,
  Save,
  Download,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import { initialSettings } from '../../data/demoSettings';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('workspace');
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'workspace', label: 'Workspace Details', icon: Building2 },
    { id: 'agent_defaults', label: 'Agent Defaults', icon: Bot },
    { id: 'calling', label: 'Calling Preferences', icon: PhoneCall },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance & UI', icon: Palette },
    { id: 'privacy', label: 'Data & Privacy', icon: Shield },
  ];

  const handleUpdate = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Workspace settings updated successfully.', 'Settings Saved');
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global environment configuration, telephony rules, notification alerts, and appearance preferences.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
          icon={Save}
        >
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: WORKSPACE */}
      {activeTab === 'workspace' && (
        <Card className="space-y-4">
          <CardHeader
            title="Organization Profile"
            subtitle="Core business identity and regional parameters"
            icon={Building2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={settings.workspace.workspaceName}
                onChange={e => handleUpdate('workspace', 'workspaceName', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Type / Industry
              </label>
              <input
                type="text"
                value={settings.workspace.businessType}
                onChange={e => handleUpdate('workspace', 'businessType', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Workspace Timezone
              </label>
              <select
                value={settings.workspace.timezone}
                onChange={e => handleUpdate('workspace', 'timezone', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="America/New_York (EST)">America/New_York (EST - UTC-5)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST - UTC-8)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT - UTC+0)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Language
              </label>
              <select
                value={settings.workspace.defaultLanguage}
                onChange={e => handleUpdate('workspace', 'defaultLanguage', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: AGENT DEFAULTS */}
      {activeTab === 'agent_defaults' && (
        <Card className="space-y-4">
          <CardHeader
            title="Global Agent Defaults"
            subtitle="Base directives inherited when creating new voice agents"
            icon={Bot}
          />
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Greeting Phrase
              </label>
              <input
                type="text"
                value={settings.agentDefaults.defaultGreeting}
                onChange={e => handleUpdate('agentDefaults', 'defaultGreeting', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Master System Instruction Prefix
              </label>
              <textarea
                rows={3}
                value={settings.agentDefaults.systemInstructionPrefix}
                onChange={e =>
                  handleUpdate('agentDefaults', 'systemInstructionPrefix', e.target.value)
                }
                className="w-full font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: CALLING PREFERENCES */}
      {activeTab === 'calling' && (
        <Card className="space-y-4">
          <CardHeader
            title="Telephony & Campaign Safeguards"
            subtitle="Global dialing boundaries and retry limits"
            icon={PhoneCall}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Workspace Call Quota Limit
              </label>
              <input
                type="number"
                value={settings.callingPreferences.dailyCallLimit}
                onChange={e =>
                  handleUpdate('callingPreferences', 'dailyCallLimit', Number(e.target.value))
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Max Call Duration (Minutes)
              </label>
              <input
                type="number"
                value={settings.callingPreferences.defaultMaxCallDurationMinutes}
                onChange={e =>
                  handleUpdate(
                    'callingPreferences',
                    'defaultMaxCallDurationMinutes',
                    Number(e.target.value)
                  )
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.callingPreferences.enforceDncGlobally}
                  onChange={e =>
                    handleUpdate('callingPreferences', 'enforceDncGlobally', e.target.checked)
                  }
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Strictly Enforce Workspace-wide National DNC Registry Scrubbing
                </span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <Card className="space-y-4">
          <CardHeader
            title="Notification Triggers"
            subtitle="Configure operational alerts and supervisor notifications"
            icon={Bell}
          />
          <div className="space-y-3 text-xs">
            {[
              { key: 'onQualifiedLead', label: 'Qualified Lead Alert', desc: 'Trigger webhook when a conversation reaches high interest score.' },
              { key: 'onCallFailed', label: 'Call Failure Alerts', desc: 'Notify operators if carrier connection error rate exceeds 5%.' },
              { key: 'onFollowUpDue', label: 'Follow-up Due Alerts', desc: 'Send daily reminder for pending customer callbacks.' },
              { key: 'onCampaignCompleted', label: 'Campaign Batch Finished', desc: 'Receive summary report when an outbound campaign completes.' },
            ].map(item => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={e => handleUpdate('notifications', item.key, e.target.checked)}
                  className="rounded text-indigo-600 w-4 h-4"
                />
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: APPEARANCE */}
      {activeTab === 'appearance' && (
        <Card className="space-y-4">
          <CardHeader
            title="Appearance & Theme Preferences"
            subtitle="Custom styling persisted in browser local storage"
            icon={Palette}
          />
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark Mode (Linear / Stripe style)', icon: Moon },
                  { id: 'light', label: 'Light Mode', icon: Sun },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                        theme === item.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: DATA & PRIVACY */}
      {activeTab === 'privacy' && (
        <Card className="space-y-4">
          <CardHeader
            title="Data Governance & Privacy Policies"
            subtitle="Retention windows and sensitive data redaction policies"
            icon={Shield}
          />
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Audio Recording Retention
                </label>
                <select
                  value={settings.dataPrivacy.recordingRetentionDays}
                  onChange={e =>
                    handleUpdate('dataPrivacy', 'recordingRetentionDays', Number(e.target.value))
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
                >
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days (Recommended)</option>
                  <option value={365}>365 Days (1 Year)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Transcript Visibility Access
                </label>
                <select
                  value={settings.dataPrivacy.transcriptVisibility}
                  onChange={e =>
                    handleUpdate('dataPrivacy', 'transcriptVisibility', e.target.value)
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="all_team_members">All Workspace Team Members</option>
                  <option value="managers_only">Managers and Admins Only</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataPrivacy.maskSensitiveDigits}
                  onChange={e =>
                    handleUpdate('dataPrivacy', 'maskSensitiveDigits', e.target.checked)
                  }
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Automatically redact sensitive digits (Credit card / OTP numbers) in transcripts
                </span>
              </label>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default SettingsPage;
