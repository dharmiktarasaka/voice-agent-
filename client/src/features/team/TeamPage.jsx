import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  MoreVertical,
  Mail,
  User,
  Shield,
  Trash2,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { initialTeamMembers, roleDefinitions } from '../../data/demoTeam';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDateTime } from '../../utils/formatters';

export function TeamPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [members, setMembers] = useState(initialTeamMembers);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Agent',
  });

  const handleInvite = e => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) {
      toast.error('Name and email are required.');
      return;
    }

    const created = {
      id: `user-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'Pending Invite',
      lastActive: 'Never',
      avatar: newMember.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };

    setMembers(prev => [...prev, created]);
    setInviteModalOpen(false);
    toast.success(`Invitation dispatched to ${created.email} (Simulated).`, 'Invite Sent');
  };

  const handleChangeRole = async (member, newRole) => {
    const confirmed = await confirm({
      title: 'Change Team Role?',
      message: `Change ${member.name}'s role from ${member.role} to ${newRole}?`,
      confirmText: 'Change Role',
      variant: 'primary',
    });
    if (confirmed) {
      setMembers(prev =>
        prev.map(m => (m.id === member.id ? { ...m, role: newRole } : m))
      );
      toast.success(`${member.name}'s role updated to ${newRole}.`);
    }
  };

  const handleRemoveMember = async member => {
    const confirmed = await confirm({
      title: 'Remove Team Member?',
      message: `Are you sure you want to remove ${member.name} (${member.email}) from this workspace?`,
      confirmText: 'Remove Member',
      variant: 'danger',
    });
    if (confirmed) {
      setMembers(prev => prev.filter(m => m.id !== member.id));
      toast.success(`Removed ${member.name} from team.`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Team & Role-Based Access
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage operator permissions, supervisor monitoring privileges, and administrative roles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setInviteModalOpen(true)}
          icon={UserPlus}
        >
          Invite Team Member
        </Button>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {roleDefinitions.map(r => (
          <div
            key={r.role}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 text-xs"
          >
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.badge}`}>
              {r.role}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug pt-1">
              {r.description}
            </p>
          </div>
        ))}
      </div>

      {/* Team Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Name & Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map(member => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={member.role}
                      disabled={member.role === 'Owner'}
                      onChange={e => handleChangeRole(member, e.target.value)}
                      className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-60"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Agent">Agent</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={member.status} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {member.lastActive === 'Never' ? 'Never' : formatDateTime(member.lastActive)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {member.role !== 'Owner' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Team Member"
        subtitle="Send an invitation to join your VoicePilot workspace"
      >
        <form onSubmit={handleInvite} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neha Sharma"
              value={newMember.name}
              onChange={e => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="neha@company.com"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Workspace Role
            </label>
            <select
              value={newMember.role}
              onChange={e => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            >
              <option value="Admin">Admin (Agent configuration & settings)</option>
              <option value="Manager">Manager (Campaigns, analytics & live monitoring)</option>
              <option value="Agent">Agent (Assigned calls & follow-ups)</option>
              <option value="Viewer">Viewer (Read-only reports)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeamPage;
