import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Modal from '../../components/ui/Modal';
import CsvImportModal from './CsvImportModal';
import { contactsService } from '../../services/contactsService';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/csv';
import { formatDateTime } from '../../utils/formatters';

export function ContactsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  // Modals
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    preferredLanguage: 'English',
    source: 'Manual Entry',
    notes: '',
  });

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState([]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await contactsService.getContacts({
        search,
        stage: stageFilter,
        language: languageFilter,
      });
      setContacts(data);
    } catch (err) {
      toast.error('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [search, stageFilter, languageFilter]);

  const handleCreateContact = async e => {
    e.preventDefault();
    if (!newContact.fullName || !newContact.phone) {
      toast.error('Full name and phone are required.');
      return;
    }
    try {
      const added = await contactsService.createContact(newContact);
      setContacts(prev => [added, ...prev]);
      setAddModalOpen(false);
      toast.success(`Contact ${added.fullName} added successfully.`);
    } catch (err) {
      toast.error('Failed to create contact.');
    }
  };

  const handleExportCsv = () => {
    const rows = contacts.map(c => ({
      FullName: c.fullName,
      Company: c.company,
      Phone: c.phone,
      Email: c.email,
      Language: c.preferredLanguage,
      Stage: c.stage,
      Consent: c.consentStatus,
      LastCallDate: c.lastCallDate,
      Notes: c.notes,
    }));
    exportToCsv(`contacts_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.success(`Exported ${rows.length} contacts to CSV.`);
  };

  const handleImportSuccess = importedContacts => {
    contactsService.bulkImport(importedContacts).then(() => {
      loadContacts();
    });
  };

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedIds(contacts.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Leads & Contacts CRM
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {contacts.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage prospect consent, qualification stages, and multi-language communication preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            icon={Upload}
          >
            Import CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            icon={Download}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            icon={Plus}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, phone, email, company..."
          className="w-full sm:w-80"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-2"
          >
            <option value="all">All Lead Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Interested">Interested</option>
            <option value="Callback Requested">Callback Requested</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Do Not Contact">Do Not Contact (DNC)</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-2"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === contacts.length && contacts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-indigo-600"
                  />
                </th>
                <th className="py-3 px-4">Full Name & Org</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Lead Stage</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4">Last Call</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contacts.map(c => {
                const isChecked = selectedIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/contacts/${c.id}`)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isChecked ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handleSelectOne(c.id, e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.company} • {c.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {c.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {c.preferredLanguage}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={c.stage} />
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={c.consentStatus?.includes('DNC') ? 'danger' : 'success'}
                        size="sm"
                      >
                        {c.consentStatus}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {c.lastCallDate ? formatDateTime(c.lastCallDate) : 'Never Dialed'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        Profile &rarr;
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Contact Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Contact"
        subtitle="Add individual lead to CRM queue with explicit consent record"
      >
        <form onSubmit={handleCreateContact} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anand Mahindra"
              value={newContact.fullName}
              onChange={e => setNewContact({ ...newContact, fullName: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+91 98200 12345"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="anand@example.com"
                value={newContact.email}
                onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="Mahindra Group"
                value={newContact.company}
                onChange={e => setNewContact({ ...newContact, company: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Language
              </label>
              <select
                value={newContact.preferredLanguage}
                onChange={e =>
                  setNewContact({ ...newContact, preferredLanguage: e.target.value })
                }
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Internal Notes
            </label>
            <textarea
              rows={2}
              placeholder="Initial lead context or referral notes..."
              value={newContact.notes}
              onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}

export default ContactsPage;
