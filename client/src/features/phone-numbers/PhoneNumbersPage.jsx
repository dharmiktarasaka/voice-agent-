import React, { useState, useEffect } from 'react';
import {
  Phone,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  MoreVertical,
  ExternalLink,
  Bot,
  Globe,
  Radio,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  Layers,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { numbersService } from '../../services/numbersService';
import { agentsService } from '../../services/agentsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { telephonyProviders } from '../../data/demoPhoneNumbers';
import { formatDateTime } from '../../utils/formatters';

export function PhoneNumbersPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [numbers, setNumbers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Number Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newNumberData, setNewNumberData] = useState({
    phoneNumber: '+91 (22) 7100-',
    friendlyName: '',
    provider: 'Twilio Voice (Demo)',
    numberType: 'Local Landline',
    country: 'IN',
    countryName: 'India',
    capabilities: { inbound: true, outbound: true, sms: true },
    assignedAgentId: '',
  });

  // Assign Agent Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [nums, ags] = await Promise.all([
        numbersService.getNumbers(),
        agentsService.getAgents(),
      ]);
      setNumbers(nums);
      setAgents(ags);
    } catch (err) {
      toast.error('Failed to load phone numbers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNumber = async e => {
    e.preventDefault();
    if (!newNumberData.friendlyName) {
      toast.error('Friendly name is required.');
      return;
    }

    const assignedAgent = agents.find(a => a.id === newNumberData.assignedAgentId);
    const generatedPhone =
      newNumberData.phoneNumber + Math.floor(1000 + Math.random() * 9000);

    try {
      const added = await numbersService.addNumber({
        ...newNumberData,
        phoneNumber: generatedPhone,
        assignedAgentName: assignedAgent ? assignedAgent.name : 'Unassigned',
      });
      setNumbers(prev => [added, ...prev]);
      setAddModalOpen(false);
      toast.success(
        `Virtual number ${added.phoneNumber} provisioned in demo pool.`,
        'Number Added'
      );
    } catch (err) {
      toast.error('Failed to add number.');
    }
  };

  const handleOpenAssign = num => {
    setSelectedNumber(num);
    setSelectedAgentId(num.assignedAgentId || '');
    setAssignModalOpen(true);
  };

  const handleSaveAssign = async () => {
    if (!selectedNumber) return;
    const ag = agents.find(a => a.id === selectedAgentId);
    try {
      const updated = await numbersService.assignAgent(
        selectedNumber.id,
        selectedAgentId,
        ag ? ag.name : 'Unassigned'
      );
      setNumbers(prev => prev.map(n => (n.id === updated.id ? updated : n)));
      setAssignModalOpen(false);
      toast.success(
        `Assigned ${ag ? ag.name : 'Unassigned'} to ${selectedNumber.phoneNumber}`,
        'Assignment Updated'
      );
    } catch (err) {
      toast.error('Failed to assign agent.');
    }
  };

  const handleDeleteNumber = async num => {
    const confirmed = await confirm({
      title: 'Remove Virtual Number?',
      message: `Are you sure you want to release ${num.phoneNumber} (${num.friendlyName})? This will detach its agent routing.`,
      confirmText: 'Release Number',
      variant: 'danger',
    });
    if (confirmed) {
      try {
        await numbersService.deleteNumber(num.id);
        setNumbers(prev => prev.filter(n => n.id !== num.id));
        toast.success(`Released ${num.phoneNumber} from demo pool.`);
      } catch (err) {
        toast.error('Failed to delete number.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Phone Numbers
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {numbers.length} Virtual Lines
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage inbound and outbound telephony routes and agent bindings. (Phase 1 Demo Pool)
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setAddModalOpen(true)}
          icon={Plus}
        >
          Add Phone Number
        </Button>
      </div>

      {/* Telephony Phase 3 Architecture Checklist Banner */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Radio className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-indigo-950 dark:text-indigo-200">
              Phase 3 Telephony Readiness Architecture
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              These placeholder numbers illustrate production routing. In Phase 3, carrier SIP trunking (Twilio, Telnyx, Vonage) will be bound directly to Node.js WebSocket media streams without rewriting UI routing components.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="purple" size="sm">
            SIP Trunking Ready
          </Badge>
          <Badge variant="success" size="sm">
            E.164 Compliant
          </Badge>
        </div>
      </div>

      {/* Phone Numbers Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Phone Number & Name</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Capabilities</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {numbers.map(num => (
                <tr
                  key={num.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                      {num.phoneNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {num.friendlyName} • {num.numberType} ({num.country})
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{num.provider}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {num.capabilities?.inbound && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          title="Inbound Enabled"
                        >
                          <ArrowDownLeft className="w-3 h-3 inline mr-0.5" /> In
                        </span>
                      )}
                      {num.capabilities?.outbound && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          title="Outbound Enabled"
                        >
                          <ArrowUpRight className="w-3 h-3 inline mr-0.5" /> Out
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {num.assignedAgentId ? (
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {num.assignedAgentName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned (Dead Air)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={num.status} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {formatDateTime(num.lastActivity)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAssign(num)}
                      >
                        Assign Agent
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNumber(num)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Release number"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Number Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Provision Virtual Phone Number"
        subtitle="Simulate adding a new carrier number to your VoicePilot workspace"
      >
        <form onSubmit={handleAddNumber} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Friendly Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pune Support Hotline"
              value={newNumberData.friendlyName}
              onChange={e =>
                setNewNumberData({ ...newNumberData, friendlyName: e.target.value })
              }
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telephony Provider
              </label>
              <select
                value={newNumberData.provider}
                onChange={e =>
                  setNewNumberData({ ...newNumberData, provider: e.target.value })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                <option value="Twilio Voice (Demo)">Twilio Voice</option>
                <option value="Telnyx SIP (Demo)">Telnyx Global SIP</option>
                <option value="Vonage Telecom (Demo)">Vonage Telecom</option>
                <option value="Plivo Voice (Demo)">Plivo Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Country
              </label>
              <select
                value={newNumberData.country}
                onChange={e => {
                  const c = e.target.value;
                  const prefix = c === 'IN' ? '+91 (22) 7100-' : c === 'US' ? '+1 (800) 555-' : '+44 20 7946-';
                  setNewNumberData({
                    ...newNumberData,
                    country: c,
                    countryName: c === 'IN' ? 'India' : c === 'US' ? 'United States' : 'United Kingdom',
                    phoneNumber: prefix,
                  });
                }}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                <option value="IN">India (+91)</option>
                <option value="US">United States (+1)</option>
                <option value="GB">United Kingdom (+44)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assign to AI Voice Agent
            </label>
            <select
              value={newNumberData.assignedAgentId}
              onChange={e =>
                setNewNumberData({ ...newNumberData, assignedAgentId: e.target.value })
              }
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            >
              <option value="">Leave Unassigned</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
            <strong>Demo Simulator:</strong> This allocates a sandbox telephone identifier. No telephony billable rates will apply.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Plus}>
              Provision Line
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Agent Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Agent to Phone Number"
        subtitle={`Select which AI voice personality answers incoming calls for ${selectedNumber?.phoneNumber}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned AI Voice Agent
            </label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            >
              <option value="">None (Unassigned / Silent)</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.purpose})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAssign}>
              Save Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PhoneNumbersPage;
