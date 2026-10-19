import apiClient from './apiClient';
import { initialCampaigns } from '../data/demoCampaigns';

let campaignsStore = [...initialCampaigns];

export const campaignsService = {
  async getCampaigns(filters = {}) {
    await apiClient.simulatedDelay(150);
    let list = [...campaignsStore];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.agentName.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }

    return list;
  },

  async getCampaignById(id) {
    await apiClient.simulatedDelay(100);
    const campaign = campaignsStore.find(c => c.id === id);
    if (!campaign) throw new Error(`Campaign with ID ${id} not found`);
    return { ...campaign };
  },

  async createCampaign(data) {
    await apiClient.simulatedDelay(250);
    const newCampaign = {
      id: `camp-${Date.now().toString().slice(-4)}`,
      status: 'Draft',
      eligibleContacts: data.eligibleContacts || 500,
      attemptedCalls: 0,
      answeredCalls: 0,
      qualifiedLeads: 0,
      failureCount: 0,
      conversionRate: 0,
      safeguards: {
        consentVerified: true,
        dncSuppressionActive: true,
        optOutHandling: 'Immediate DNC tag and polite goodbye',
        respectTimezone: true,
      },
      ...data,
    };
    campaignsStore.unshift(newCampaign);
    return newCampaign;
  },

  async toggleCampaignStatus(id) {
    await apiClient.simulatedDelay(200);
    const campaign = campaignsStore.find(c => c.id === id);
    if (!campaign) throw new Error(`Campaign with ID ${id} not found`);

    if (campaign.status === 'Running') {
      campaign.status = 'Paused';
    } else if (campaign.status === 'Paused' || campaign.status === 'Scheduled' || campaign.status === 'Draft') {
      campaign.status = 'Running';
    }
    return campaign;
  },

  async deleteCampaign(id) {
    await apiClient.simulatedDelay(150);
    campaignsStore = campaignsStore.filter(c => c.id !== id);
    return { success: true, id };
  },
};

export default campaignsService;
