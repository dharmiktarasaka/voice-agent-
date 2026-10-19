import apiClient from './apiClient';
import { initialAgents } from '../data/demoAgents';

// In-memory store for Phase 1 frontend interactivity
let agentsStore = [...initialAgents];

export const agentsService = {
  async getAgents(filters = {}) {
    await apiClient.simulatedDelay(150);
    let list = [...agentsStore];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.businessName.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(a => a.status === filters.status);
    }

    if (filters.language && filters.language !== 'all') {
      list = list.filter(a => a.language?.supportedLanguages?.includes(filters.language));
    }

    if (filters.direction && filters.direction !== 'all') {
      if (filters.direction === 'inbound') {
        list = list.filter(a => a.calling?.inbound);
      } else if (filters.direction === 'outbound') {
        list = list.filter(a => a.calling?.outbound);
      }
    }

    return list;
  },

  async getAgentById(id) {
    await apiClient.simulatedDelay(100);
    const agent = agentsStore.find(a => a.id === id);
    if (!agent) throw new Error(`Agent with ID ${id} not found`);
    return { ...agent };
  },

  async createAgent(data) {
    await apiClient.simulatedDelay(250);
    const newAgent = {
      id: `agent-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'draft',
      stats: {
        totalCalls: 0,
        answeredCalls: 0,
        qualifiedLeads: 0,
        avgDuration: '0m 00s',
        qualificationRate: 0,
        satisfactionScore: 0,
      },
      ...data,
    };
    agentsStore.unshift(newAgent);
    return newAgent;
  },

  async updateAgent(id, data) {
    await apiClient.simulatedDelay(200);
    const index = agentsStore.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Agent with ID ${id} not found`);
    
    agentsStore[index] = {
      ...agentsStore[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return agentsStore[index];
  },

  async toggleAgentStatus(id) {
    await apiClient.simulatedDelay(150);
    const agent = agentsStore.find(a => a.id === id);
    if (!agent) throw new Error(`Agent with ID ${id} not found`);

    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    agent.status = newStatus;
    agent.updatedAt = new Date().toISOString();
    return agent;
  },

  async duplicateAgent(id) {
    await apiClient.simulatedDelay(200);
    const original = agentsStore.find(a => a.id === id);
    if (!original) throw new Error(`Agent with ID ${id} not found`);

    const copy = {
      ...JSON.parse(JSON.stringify(original)),
      id: `agent-${Date.now().toString().slice(-4)}`,
      name: `${original.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalCalls: 0,
        answeredCalls: 0,
        qualifiedLeads: 0,
        avgDuration: '0m 00s',
        qualificationRate: 0,
        satisfactionScore: 0,
      },
    };
    agentsStore.unshift(copy);
    return copy;
  },

  async deleteAgent(id) {
    await apiClient.simulatedDelay(200);
    agentsStore = agentsStore.filter(a => a.id !== id);
    return { success: true, id };
  },
};

export default agentsService;
