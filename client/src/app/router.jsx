import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

import DashboardPage from '../features/dashboard/DashboardPage';
import AgentsPage from '../features/agents/AgentsPage';
import AgentWizardPage from '../features/agents/AgentWizardPage';
import AgentDetailPage from '../features/agents/AgentDetailPage';
import PhoneNumbersPage from '../features/phone-numbers/PhoneNumbersPage';
import CallHistoryPage from '../features/calls/CallHistoryPage';
import CallDetailPage from '../features/calls/CallDetailPage';
import LiveCallsPage from '../features/live-calls/LiveCallsPage';
import CampaignsPage from '../features/campaigns/CampaignsPage';
import CampaignDetailPage from '../features/campaigns/CampaignDetailPage';
import ContactsPage from '../features/contacts/ContactsPage';
import ContactDetailPage from '../features/contacts/ContactDetailPage';
import FollowUpQueuePage from '../features/follow-ups/FollowUpQueuePage';
import KnowledgeBasePage from '../features/knowledge-base/KnowledgeBasePage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import ConversationInsightsPage from '../features/conversation-insights/ConversationInsightsPage';
import IntegrationsPage from '../features/integrations/IntegrationsPage';
import TeamPage from '../features/team/TeamPage';
import SettingsPage from '../features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'agents/new', element: <AgentWizardPage /> },
      { path: 'agents/:id', element: <AgentDetailPage /> },
      { path: 'phone-numbers', element: <PhoneNumbersPage /> },
      { path: 'calls', element: <CallHistoryPage /> },
      { path: 'calls/:id', element: <CallDetailPage /> },
      { path: 'live-calls', element: <LiveCallsPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'campaigns/:id', element: <CampaignDetailPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'contacts/:id', element: <ContactDetailPage /> },
      { path: 'follow-ups', element: <FollowUpQueuePage /> },
      { path: 'knowledge-base', element: <KnowledgeBasePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'conversation-insights', element: <ConversationInsightsPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
