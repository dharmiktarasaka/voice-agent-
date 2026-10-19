// Demo Integrations dataset with configuration schemas

export const initialIntegrations = [
  {
    id: 'vapi',
    name: 'Vapi Voice AI',
    category: 'Voice Engine',
    description: 'High-performance conversational voice orchestration platform with low latency turn-taking.',
    status: 'Demo', // 'Connected' | 'Demo' | 'Not Connected'
    icon: 'Radio',
    lastSync: '2026-10-19T11:00:00Z',
    setupInstructions: [
      'Create an account at vapi.ai and obtain your Public and Private API keys.',
      'Configure webhook URLs in the Vapi dashboard to route call events to VoicePilot AI.',
      'In Phase 2, these keys will authenticate real-time WebSockets and neural audio streams.',
    ],
    fields: [
      { name: 'apiKey', label: 'Vapi Private Key', type: 'password', placeholder: 'vapi_live_••••••••••••••••' },
      { name: 'assistantId', label: 'Default Assistant ID', type: 'text', placeholder: 'asst_94f83b2...' },
    ],
  },
  {
    id: 'retell',
    name: 'Retell AI',
    category: 'Voice Engine',
    description: 'Customizable LLM voice agent infrastructure with built-in telephony and barge-in intelligence.',
    status: 'Not Connected',
    icon: 'PhoneCall',
    lastSync: 'Never',
    setupInstructions: [
      'Log into the Retell AI developer portal.',
      'Generate an API key under Project Settings > API Credentials.',
      'Copy your Agent Key to connect inbound SIP trunks.',
    ],
    fields: [
      { name: 'apiKey', label: 'Retell API Key', type: 'password', placeholder: 'retell_key_••••••••••••••••' },
    ],
  },
  {
    id: 'twilio',
    name: 'Twilio Telephony',
    category: 'Telephony & Trunking',
    description: 'Global carrier connectivity for local, toll-free, and mobile phone numbers with SMS fallback.',
    status: 'Connected',
    icon: 'PhoneForwarded',
    lastSync: '2026-10-19T11:40:00Z',
    setupInstructions: [
      'Locate your Account SID and Auth Token on the Twilio Console homepage.',
      'Ensure SIP trunking or Programmable Voice is provisioned for your country of operation.',
      'VoicePilot will configure Webhook callbacks for call status changes automatically in Phase 3.',
    ],
    fields: [
      { name: 'accountSid', label: 'Twilio Account SID', type: 'text', placeholder: 'AC••••••••••••••••••••••••••••••••' },
      { name: 'authToken', label: 'Auth Token', type: 'password', placeholder: '••••••••••••••••••••••••••••••••' },
      { name: 'webhookUrl', label: 'Status Callback URL', type: 'text', placeholder: 'https://api.voicepilot.ai/v1/webhooks/twilio' },
    ],
  },
  {
    id: 'mongodb',
    name: 'MongoDB Enterprise Database',
    category: 'Data Storage',
    description: 'Primary document database storing agent configurations, transcripts, contacts, and analytical telemetry.',
    status: 'Demo',
    icon: 'Database',
    lastSync: '2026-10-19T11:45:00Z',
    setupInstructions: [
      'Create a MongoDB Atlas cluster (M10+ recommended for production workloads).',
      'Whitelist VoicePilot server IP addresses in Network Access.',
      'Phase 2 backend server will use MONGODB_URI connection string with TLS certificate.',
    ],
    fields: [
      { name: 'connectionString', label: 'MongoDB Connection String (URI)', type: 'password', placeholder: 'mongodb+srv://admin:••••@cluster0.mongodb.net/voicepilot' },
      { name: 'dbName', label: 'Database Name', type: 'text', placeholder: 'voicepilot_production' },
    ],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar & Workspace',
    category: 'Scheduling',
    description: 'Sync booked appointments directly to doctor, executive, or sales advisor calendars in real time.',
    status: 'Connected',
    icon: 'Calendar',
    lastSync: '2026-10-19T11:30:00Z',
    setupInstructions: [
      'Authorize Google OAuth 2.0 with Calendar.ReadWrite scope.',
      'Select default calendars for appointment confirmation and conflict detection.',
    ],
    fields: [
      { name: 'calendarId', label: 'Default Calendar ID', type: 'text', placeholder: 'clinic-appointments@apexclinic.com' },
    ],
  },
  {
    id: 'crm-webhook',
    name: 'CRM Webhooks (HubSpot / Salesforce)',
    category: 'CRM Automation',
    description: 'Instantly push qualified leads, notes, and call transcripts to external CRM pipelines.',
    status: 'Connected',
    icon: 'Workflow',
    lastSync: '2026-10-19T11:28:00Z',
    setupInstructions: [
      'Create a private app token or incoming webhook endpoint in HubSpot or Salesforce.',
      'Configure trigger events (e.g. Lead Qualified, Site Visit Booked, DNC Requested).',
    ],
    fields: [
      { name: 'webhookUrl', label: 'Endpoint URL', type: 'text', placeholder: 'https://api.hubspot.com/crm/v3/objects/contacts/sync' },
      { name: 'secretKey', label: 'Webhook Secret Header', type: 'password', placeholder: 'whsec_••••••••••••••••' },
    ],
  },
  {
    id: 'sendgrid',
    name: 'SendGrid Email Notifications',
    category: 'Messaging',
    description: 'Send automated email appointment confirmations, daily activity digests, and escalation alerts.',
    status: 'Not Connected',
    icon: 'Mail',
    lastSync: 'Never',
    setupInstructions: [
      'Generate a SendGrid API Key with Mail Send permissions.',
      'Verify a sender domain (e.g., notifications@voicepilot.ai) via DNS records.',
    ],
    fields: [
      { name: 'apiKey', label: 'SendGrid API Key', type: 'password', placeholder: 'SG.••••••••••••••••' },
      { name: 'fromEmail', label: 'Verified Sender Email', type: 'email', placeholder: 'notifications@voicepilot.ai' },
    ],
  },
];
