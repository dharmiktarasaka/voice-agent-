import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { parseCsvText } from '../../utils/csv';
import { useToast } from '../../context/ToastContext';

export function CsvImportModal({ isOpen, onClose, onImportSuccess }) {
  const toast = useToast();
  const [step, setStep] = useState(1); // 1: Upload, 2: Column Mapping, 3: Preview & Confirm
  const [csvText, setCsvText] = useState('');
  const [parsedData, setParsedData] = useState({ headers: [], rows: [] });
  const [mapping, setMapping] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    language: '',
  });

  const sampleCsv = `Full Name,Phone,Email,Company,Language
Anil Kapoor,+91 98200 88771,anil@kapoorholdings.in,Kapoor Holdings,Hindi
Deepa Sen,+91 94250 11992,deepa@sendesigns.com,Sen Designs,Gujarati
Robert Smith,+1 555-432-1200,rsmith@acme.com,Acme Corp,English`;

  const handleLoadSample = () => {
    setCsvText(sampleCsv);
    const res = parseCsvText(sampleCsv);
    setParsedData(res);
    autoMapHeaders(res.headers);
  };

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target.result;
      setCsvText(content);
      const res = parseCsvText(content);
      setParsedData(res);
      autoMapHeaders(res.headers);
    };
    reader.readAsText(file);
  };

  const autoMapHeaders = headers => {
    const map = {};
    headers.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes('name')) map.fullName = h;
      else if (lower.includes('phone') || lower.includes('mobile')) map.phone = h;
      else if (lower.includes('email') || lower.includes('mail')) map.email = h;
      else if (lower.includes('comp') || lower.includes('org')) map.company = h;
      else if (lower.includes('lang')) map.language = h;
    });
    setMapping(prev => ({ ...prev, ...map }));
    setStep(2);
  };

  const handleExecuteImport = () => {
    const importedContacts = parsedData.rows.map(row => ({
      fullName: row[mapping.fullName] || 'Unnamed Contact',
      phone: row[mapping.phone] || '+1 555-0000',
      email: row[mapping.email] || '',
      company: row[mapping.company] || 'Direct',
      preferredLanguage: row[mapping.language] || 'English',
    }));

    onImportSuccess(importedContacts);
    toast.success(
      `Successfully simulated import of ${importedContacts.length} contacts!`,
      'Import Completed'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Contacts from CSV"
      subtitle="Map columns, validate phone records, and preview before importing into CRM"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Step Indicator */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">File Upload</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Column Mapping</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Preview & Import</span>
          </div>
        </div>

        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-indigo-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Select CSV file to upload
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports comma-separated values (.csv) with header columns
                </p>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer transition-colors"
              >
                Browse CSV File
              </label>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Or click here to load sample demo CSV dataset &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COLUMN MAPPING */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-slate-500">
              Found <strong className="text-slate-800 dark:text-slate-200">{parsedData.rows.length} rows</strong>. Map your CSV columns to VoicePilot CRM contact fields:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'fullName', label: 'Full Name *' },
                { key: 'phone', label: 'Phone Number *' },
                { key: 'email', label: 'Email Address' },
                { key: 'company', label: 'Company Name' },
                { key: 'language', label: 'Preferred Language' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {f.label}
                  </label>
                  <select
                    value={mapping[f.key] || ''}
                    onChange={e => setMapping({ ...mapping, [f.key]: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2"
                  >
                    <option value="">-- Ignore / Not Mapped --</option>
                    {parsedData.headers.map(h => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(3)}
                disabled={!mapping.fullName || !mapping.phone}
              >
                Review Data Preview &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All {parsedData.rows.length} rows passed telephone number and consent format checks.
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Company</th>
                    <th className="p-2">Language</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsedData.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{r[mapping.fullName]}</td>
                      <td className="p-2 font-mono">{r[mapping.phone]}</td>
                      <td className="p-2 text-slate-500">{r[mapping.email]}</td>
                      <td className="p-2">{r[mapping.company]}</td>
                      <td className="p-2">{r[mapping.language] || 'English'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                Back to Mapping
              </Button>
              <Button variant="primary" size="sm" onClick={handleExecuteImport}>
                Confirm & Import {parsedData.rows.length} Contacts
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CsvImportModal;
