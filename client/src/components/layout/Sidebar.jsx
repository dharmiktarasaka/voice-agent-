import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  Activity,
  Megaphone,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Volume2,
  X,
  Phone,
  BarChart3,
  Plug,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Beginner-friendly, streamlined menu items
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'AI Voice Callers', path: '/agents', icon: Bot, badge: '6 Ready' },
    { name: 'Live Calls', path: '/live-calls', icon: Activity, badge: 'Live', badgeColor: 'bg-emerald-500 text-white animate-pulse' },
    { name: 'Call History', path: '/calls', icon: PhoneCall },
    { name: 'Campaigns (Auto-Dial)', path: '/campaigns', icon: Megaphone },
    { name: 'Contacts & Leads', path: '/contacts', icon: Users },
    { name: 'Knowledge & Training', path: '/knowledge-base', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Phone Numbers', path: '/phone-numbers', icon: Phone },
    { name: 'Integrations', path: '/integrations', icon: Plug },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-200 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  VoicePilot AI
                </span>
                <span className="text-xs text-indigo-400 font-medium">Simple Voice Agent</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Friendly Workspace Indicator */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/80 flex items-center justify-between">
            <div className="truncate">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Current Workspace
              </div>
              <div className="text-xs font-bold text-slate-200 truncate mt-0.5">
                My Call Center
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer with Mode Toggle */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/80">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                  ME
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">My Account</span>
                  <span className="text-[10px] text-emerald-400">Demo Active</span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                ME
              </div>
            )}

            {!isCollapsed && (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
