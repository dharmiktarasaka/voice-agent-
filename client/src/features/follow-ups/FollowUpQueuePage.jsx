import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { initialFollowUps } from '../../data/demoFollowUps';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';

export function FollowUpQueuePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [activeTab, setActiveTab] = useState('due_today');

  // Reschedule Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newScheduleTime, setNewScheduleTime] = useState('');

  const tabs = [
    {
      id: 'due_today',
      label: 'Due Today',
      count: followUps.filter(f => f.status === 'due_today').length,
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: followUps.filter(f => f.status === 'overdue').length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: followUps.filter(f => f.status === 'upcoming').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: followUps.filter(f => f.status === 'completed').length,
    },
  ];

  const filteredItems = followUps.filter(f => f.status === activeTab);

  const handleMarkCompleted = id => {
    setFollowUps(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'completed' } : item))
    );
    toast.success('Follow-up marked as completed.', 'Queue Updated');
  };

  const handleOpenReschedule = item => {
    setSelectedItem(item);
    setNewScheduleTime(item.scheduledTime ? item.scheduledTime.slice(0, 16) : '');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedItem) return;
    setFollowUps(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, scheduledTime: newScheduleTime, status: 'upcoming' }
          : item
      )
    );
    setRescheduleModalOpen(false);
    toast.success('Follow-up rescheduled successfully.');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Follow-up Queue
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {followUps.filter(f => f.status === 'due_today' || f.status === 'overdue').length} Pending Action
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritized advisory callbacks, site visit confirmations, and scheduled outreach tasks.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Queue List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-xs">
            No follow-up tasks in this category.
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.contactName}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {item.phoneNumber}
                  </span>
                  {item.contactCompany && (
                    <span className="text-xs text-slate-400">
                      • {item.contactCompany}
                    </span>
                  )}
                  <StatusBadge status={item.previousOutcome} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.reason}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Scheduled: {formatDateTime(item.scheduledTime)}
                  </span>
                  <span>Agent: {item.assignedAgentName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {item.contactId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/contacts/${item.contactId}`)}
                  >
                    View Contact
                  </Button>
                )}

                {item.status !== 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReschedule(item)}
                      icon={RotateCcw}
                    >
                      Reschedule
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMarkCompleted(item.id)}
                      icon={CheckCircle2}
                    >
                      Complete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Follow-up"
        subtitle={`Select new reminder slot for ${selectedItem?.contactName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Date & Time
            </label>
            <input
              type="datetime-local"
              value={newScheduleTime}
              onChange={e => setNewScheduleTime(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmReschedule}>
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FollowUpQueuePage;
