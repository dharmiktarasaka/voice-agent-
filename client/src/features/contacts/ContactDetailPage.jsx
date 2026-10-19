import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  Globe,
  Clock,
  Calendar,
  ShieldAlert,
  PhoneCall,
  Save,
  Trash2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import { contactsService } from '../../services/contactsService';
import { callsService } from '../../services/callsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDateTime, formatDuration } from '../../utils/formatters';

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [contact, setContact] = useState(null);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const c = await contactsService.getContactById(id);
        setContact(c);
        const contactCalls = await callsService.getCalls({ search: c.fullName });
        setCalls(contactCalls);
      } catch (err) {
        toast.error('Contact not found.');
        navigate('/contacts');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading || !contact) {
    return (
      <div className="py-20 text-center text-slate-500">
        <User className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        Loading contact profile...
      </div>
    );
  }

  const handleStageChange = async newStage => {
    try {
      const updated = await contactsService.updateContact(contact.id, { stage: newStage });
      setContact(updated);
      toast.success(`Lead stage updated to ${newStage}.`);
    } catch (err) {
      toast.error('Failed to update stage.');
    }
  };

  const handleToggleDnc = async () => {
    const action = contact.stage === 'Do Not Contact' ? 'remove from DNC' : 'mark as Do Not Contact';
    const confirmed = await confirm({
      title: `${action.toUpperCase()}?`,
      message: `Are you sure you want to ${action} for ${contact.fullName}?`,
      confirmText: 'Confirm',
      variant: 'danger',
    });
    if (confirmed) {
      try {
        const updated = await contactsService.toggleDnc(contact.id);
        setContact(updated);
        toast.success(`Contact DNC status updated.`);
      } catch (err) {
        toast.error('Failed to update DNC status.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {contact.fullName}
              </h1>
              <StatusBadge status={contact.stage} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {contact.company} • Preferred Language: {contact.preferredLanguage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={contact.stage === 'Do Not Contact' ? 'secondary' : 'danger'}
            size="sm"
            onClick={handleToggleDnc}
            icon={ShieldAlert}
          >
            {contact.stage === 'Do Not Contact' ? 'Remove DNC Suppression' : 'Add to DNC List'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Profile */}
        <Card padding="p-5" className="space-y-4">
          <CardHeader title="Contact Profile" subtitle="Lead details and consent records" icon={User} />

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Phone</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {contact.phone}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-800 dark:text-slate-200">{contact.email}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Lead Stage</span>
              <select
                value={contact.stage}
                onChange={e => handleStageChange(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-xs"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Interested">Interested</option>
                <option value="Callback Requested">Callback Requested</option>
                <option value="Converted">Converted</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Do Not Contact">Do Not Contact</option>
              </select>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Consent Status</span>
              <Badge variant={contact.consentStatus?.includes('DNC') ? 'danger' : 'success'} size="sm">
                {contact.consentStatus}
              </Badge>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Lead Source</span>
              <span className="text-slate-800 dark:text-slate-200">{contact.source}</span>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 block mb-1">CRM Notes:</span>
              <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {contact.notes || 'No notes added.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Right Column Call History */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-0" className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-500" />
                Call History with {contact.fullName}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">Start Time</th>
                    <th className="py-3 px-4">Agent</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calls.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/calls/${c.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono">{formatDateTime(c.startTime)}</td>
                      <td className="py-3 px-4">{c.agentName.split('-')[0]}</td>
                      <td className="py-3 px-4 font-mono">{formatDuration(c.durationSeconds)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={c.outcome} />
                      </td>
                      <td className="py-3 px-4 text-right text-indigo-600 font-semibold">
                        View &rarr;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ContactDetailPage;
