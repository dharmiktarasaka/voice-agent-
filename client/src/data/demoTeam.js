// Demo Team Members dataset with roles and permission matrix

export const initialTeamMembers = [
  {
    id: 'user-1',
    name: 'Siddharth Roy',
    email: 'siddharth@voicepilot.ai',
    role: 'Owner', // Owner | Admin | Manager | Agent | Viewer
    status: 'Active', // Active | Pending Invite | Deactivated
    lastActive: '2026-10-19T11:45:00Z',
    avatar: 'SR',
  },
  {
    id: 'user-2',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@apexclinic.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2026-10-19T10:30:00Z',
    avatar: 'PI',
  },
  {
    id: 'user-3',
    name: 'Alok Nath Sharma',
    email: 'alok.sharma@skylinerealty.in',
    role: 'Manager',
    status: 'Active',
    lastActive: '2026-10-19T09:15:00Z',
    avatar: 'AS',
  },
  {
    id: 'user-4',
    name: 'Tanvi Dave',
    email: 'tanvi@diamondtextiles.in',
    role: 'Agent',
    status: 'Active',
    lastActive: '2026-10-18T18:00:00Z',
    avatar: 'TD',
  },
  {
    id: 'user-5',
    name: 'Robert Vance',
    email: 'robert@nexuslogic.io',
    role: 'Viewer',
    status: 'Pending Invite',
    lastActive: 'Never',
    avatar: 'RV',
  },
];

export const roleDefinitions = [
  {
    role: 'Owner',
    description: 'Full workspace authority, billing control, API keys, and workspace deletion rights.',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  {
    role: 'Admin',
    description: 'Can manage agents, telephony numbers, integrations, and invite team members.',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
  },
  {
    role: 'Manager',
    description: 'Can build campaigns, review analytics, listen to live calls, and manage leads.',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    role: 'Agent',
    description: 'Can view assigned calls, respond to follow-ups, and update lead stages.',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    role: 'Viewer',
    description: 'Read-only access to dashboard metrics and call history summaries.',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
];
