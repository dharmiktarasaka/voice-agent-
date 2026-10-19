import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  PhoneCall,
  Activity,
  Plus,
  Sparkles,
  Command,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export function Topbar({ onOpenMobileSidebar, isSidebarCollapsed }) {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [testCallModalOpen, setTestCallModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('+91 98200 12345');
  const [testAgent, setTestAgent] = useState('agent-1');
  const [testLanguage, setTestLanguage] = useState('hi');
  const [isCalling, setIsCalling] = useState(false);

  const handleSimulateCall = e => {
    e.preventDefault();
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setTestCallModalOpen(false);
      toast.success(`Simulated call placed to ${testPhone}. Monitoring active session.`, 'Test Call Placed');
      navigate('/live-calls');
    }, 1200);
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-150">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search Shortcut */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 w-64 md:w-80 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="flex-1 truncate">Search agents, calls, leads...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Live Calls Indicator Pill */}
          <Link
            to="/live-calls"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="hidden sm:inline">Live Calls:</span> 3 Active
          </Link>

          {/* Simulate Call Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTestCallModalOpen(true)}
            icon={PhoneCall}
            className="hidden md:inline-flex border-indigo-200 text-indigo-600 dark:border-indigo-800/60 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
          >
            Simulate Call
          </Button>

          {/* Create Agent CTA */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/agents/new')}
            icon={Plus}
          >
            <span className="hidden sm:inline">Create</span> Agent
          </Button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile */}
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            SR
          </div>
        </div>
      </header>

      {/* Simulate Voice Call Modal */}
      <Modal
        isOpen={testCallModalOpen}
        onClose={() => setTestCallModalOpen(false)}
        title="Simulate AI Voice Call"
        subtitle="Test turn-taking and multilingual prompt instructions in sandbox mode without dialing carrier networks."
      >
        <form onSubmit={handleSimulateCall} className="space-y-4">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <strong>Phase 1 Simulator:</strong> This triggers an instant simulated active conversation in the Live Calls monitor with transcript progression.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select AI Voice Agent
            </label>
            <select
              value={testAgent}
              onChange={e => setTestAgent(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            >
              <option value="agent-1">Rohan - Real Estate Qualifier (Hindi/English)</option>
              <option value="agent-2">Priya - Clinic Appointment Coordinator (English/Hindi)</option>
              <option value="agent-3">Meera - Gujarati Retail & Order Desk (Gujarati/Hindi)</option>
              <option value="agent-4">Aarav - Inbound SaaS Support (English)</option>
              <option value="agent-5">Vikram - Outbound B2B Lead Followup (English)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Language
            </label>
            <select
              value={testLanguage}
              onChange={e => setTestLanguage(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="en">English</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Test Phone Number
            </label>
            <input
              type="text"
              value={testPhone}
              onChange={e => setTestPhone(e.target.value)}
              placeholder="+91 98200 12345"
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setTestCallModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCalling}
              icon={PhoneCall}
            >
              Start Simulated Call
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Topbar;
