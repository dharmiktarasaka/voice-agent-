import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Globe,
  Mic,
  ArrowDownLeft,
  ArrowUpRight,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  Edit,
  Power,
  Volume2,
  Sparkles,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';

export function AgentCard({ agent, onStatusToggle, onDuplicate, onDelete }) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleVoicePreview = e => {
    e.stopPropagation();
    setIsPlayingPreview(true);
    toast.info(`Voice preview playing: "${agent.voice?.voiceName || 'Voice Pilot Neural'}" (Demo Audio Simulation)`);
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, 2500);
  };

  const handleToggle = async e => {
    e.stopPropagation();
    const action = agent.status === 'active' ? 'pause' : 'activate';
    const confirmed = await confirm({
      title: `${action === 'activate' ? 'Activate' : 'Pause'} Agent?`,
      message: `Are you sure you want to ${action} ${agent.name}? Active campaigns using this agent will update their routing state.`,
      confirmText: action === 'activate' ? 'Activate' : 'Pause',
      variant: action === 'activate' ? 'primary' : 'warning',
    });
    if (confirmed) {
      onStatusToggle(agent.id);
    }
  };

  const handleDelete = async e => {
    e.stopPropagation();
    setMenuOpen(false);
    const confirmed = await confirm({
      title: 'Delete AI Agent?',
      message: `Are you sure you want to delete ${agent.name}? This will remove its conversation configurations. This action cannot be undone.`,
      confirmText: 'Delete Agent',
      variant: 'danger',
    });
    if (confirmed) {
      onDelete(agent.id);
    }
  };

  const handleDuplicate = e => {
    e.stopPropagation();
    setMenuOpen(false);
    onDuplicate(agent.id);
  };

  return (
    <Card
      hover
      onClick={() => navigate(`/agents/${agent.id}`)}
      className="flex flex-col justify-between h-full border border-slate-200 dark:border-slate-800 transition-all duration-150"
      padding="p-5"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {agent.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {agent.businessName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            <StatusBadge status={agent.status} />
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-20 text-xs animate-in zoom-in-95 duration-100"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/agents/${agent.id}`);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Agent
                </button>
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button
                  type="button"
                  onClick={handleToggle}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Power className="w-3.5 h-3.5" />{' '}
                  {agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Agent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {agent.description}
        </p>

        {/* Key Attributes Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <Badge variant="default" size="sm">
            {agent.purpose}
          </Badge>

          {/* Direction tag */}
          {agent.calling?.inbound && agent.calling?.outbound ? (
            <Badge variant="purple" size="sm">
              In & Outbound
            </Badge>
          ) : agent.calling?.inbound ? (
            <Badge variant="info" size="sm">
              <ArrowDownLeft className="w-3 h-3 mr-0.5 inline" /> Inbound
            </Badge>
          ) : (
            <Badge variant="primary" size="sm">
              <ArrowUpRight className="w-3 h-3 mr-0.5 inline" /> Outbound
            </Badge>
          )}

          {/* Languages */}
          <Badge variant="default" size="sm">
            <Globe className="w-3 h-3 mr-1 inline text-indigo-500" />
            {agent.language?.supportedLanguages?.map(l => l.toUpperCase()).join(', ')}
          </Badge>
        </div>

        {/* Voice Persona & Preview */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Mic className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
              {agent.voice?.voiceName || 'Default Neural Voice'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleVoicePreview}
            disabled={isPlayingPreview}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors shrink-0"
          >
            <Volume2 className={`w-3 h-3 ${isPlayingPreview ? 'animate-bounce text-indigo-500' : ''}`} />
            {isPlayingPreview ? 'Playing...' : 'Preview Voice'}
          </button>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Calls</div>
          <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {agent.stats?.totalCalls || 0}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Avg Duration</div>
          <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {agent.stats?.avgDuration || '0m 00s'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Qual Rate</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {agent.stats?.qualificationRate || 0}%
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AgentCard;
