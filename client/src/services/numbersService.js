import apiClient from './apiClient';
import { initialPhoneNumbers } from '../data/demoPhoneNumbers';

let numbersStore = [...initialPhoneNumbers];

export const numbersService = {
  async getNumbers() {
    await apiClient.simulatedDelay(120);
    return [...numbersStore];
  },

  async addNumber(data) {
    await apiClient.simulatedDelay(250);
    const newNumber = {
      id: `pn-${Date.now().toString().slice(-4)}`,
      status: 'active',
      lastActivity: new Date().toISOString(),
      callsHandled: 0,
      ...data,
    };
    numbersStore.unshift(newNumber);
    return newNumber;
  },

  async assignAgent(numberId, agentId, agentName) {
    await apiClient.simulatedDelay(150);
    const item = numbersStore.find(n => n.id === numberId);
    if (!item) throw new Error('Phone number not found');

    item.assignedAgentId = agentId;
    item.assignedAgentName = agentName || (agentId ? 'Assigned Agent' : 'Unassigned');
    item.status = agentId ? 'active' : 'unassigned';
    return item;
  },

  async deleteNumber(id) {
    await apiClient.simulatedDelay(150);
    numbersStore = numbersStore.filter(n => n.id !== id);
    return { success: true, id };
  },
};

export default numbersService;
