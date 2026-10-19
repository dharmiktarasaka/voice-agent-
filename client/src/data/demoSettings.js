// Demo Settings dataset with workspace defaults, calling preferences, and security policies

export const initialSettings = {
  workspace: {
    workspaceName: 'Acme Enterprise Call Center',
    businessType: 'B2B Sales & Customer Support',
    timezone: 'Asia/Kolkata (IST)',
    defaultLanguage: 'English',
    companyWebsite: 'https://acme-enterprise.com',
    supportEmail: 'support@voicepilot.ai',
  },
  agentDefaults: {
    defaultGreeting: 'Hello! Thank you for calling Acme Customer Service. How may I assist you today?',
    defaultLanguage: 'en',
    defaultVoice: 'Neeraj (Warm & Confident Indian English / Hindi)',
    defaultSpeed: 1.0,
    systemInstructionPrefix: 'You are an intelligent, polite AI assistant representing Acme Corp. Always verify customer identity before sharing order details.',
  },
  callingPreferences: {
    defaultMaxCallDurationMinutes: 10,
    silenceTimeoutSeconds: 6,
    defaultRetryLimit: 3,
    callingWindowStart: '09:00',
    callingWindowEnd: '19:00',
    dailyCallLimit: 2500,
    enforceDncGlobally: true,
  },
  notifications: {
    onCallCompleted: false,
    onCallFailed: true,
    onQualifiedLead: true,
    onFollowUpDue: true,
    onCampaignCompleted: true,
    dailySummaryEmail: true,
    notificationEmail: 'alerts@voicepilot.ai',
  },
  appearance: {
    theme: 'dark', // light | dark | system
    sidebarCollapsedByDefault: false,
    tableDensity: 'comfortable', // compact | comfortable
  },
  dataPrivacy: {
    transcriptVisibility: 'all_team_members', // all_team_members | managers_only
    recordingRetentionDays: 90,
    maskSensitiveDigits: true, // redact credit card / phone numbers in transcript
    consentDisclaimerRequired: true,
    dncRetentionDays: 365,
  },
};
