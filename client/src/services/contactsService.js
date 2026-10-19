import apiClient from './apiClient';
import { initialContacts } from '../data/demoContacts';

let contactsStore = [...initialContacts];

export const contactsService = {
  async getContacts(filters = {}) {
    await apiClient.simulatedDelay(150);
    let list = [...contactsStore];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        c =>
          c.fullName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (filters.stage && filters.stage !== 'all') {
      list = list.filter(c => c.stage.toLowerCase() === filters.stage.toLowerCase());
    }

    if (filters.language && filters.language !== 'all') {
      list = list.filter(c => c.preferredLanguage.toLowerCase() === filters.language.toLowerCase());
    }

    return list;
  },

  async getContactById(id) {
    await apiClient.simulatedDelay(100);
    const contact = contactsStore.find(c => c.id === id);
    if (!contact) throw new Error(`Contact with ID ${id} not found`);
    return { ...contact };
  },

  async createContact(data) {
    await apiClient.simulatedDelay(200);
    const newContact = {
      id: `contact-${Date.now().toString().slice(-4)}`,
      lastCallDate: null,
      callCount: 0,
      consentStatus: 'Opted In (Verified)',
      stage: 'New',
      ...data,
    };
    contactsStore.unshift(newContact);
    return newContact;
  },

  async updateContact(id, data) {
    await apiClient.simulatedDelay(150);
    const index = contactsStore.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Contact with ID ${id} not found`);

    contactsStore[index] = {
      ...contactsStore[index],
      ...data,
    };
    return contactsStore[index];
  },

  async toggleDnc(id) {
    await apiClient.simulatedDelay(150);
    const contact = contactsStore.find(c => c.id === id);
    if (!contact) throw new Error(`Contact with ID ${id} not found`);

    const isDnc = contact.stage === 'Do Not Contact';
    contact.stage = isDnc ? 'Contacted' : 'Do Not Contact';
    contact.consentStatus = isDnc ? 'Opted In (Verified)' : 'Opted Out (DNC)';
    return contact;
  },

  async bulkImport(contactsList) {
    await apiClient.simulatedDelay(350);
    const imported = contactsList.map((c, i) => ({
      id: `contact-imp-${Date.now()}-${i}`,
      fullName: c.fullName || c.name || 'Unnamed Contact',
      company: c.company || 'Direct',
      phone: c.phone || c.phoneNumber || '+1 555-0000',
      email: c.email || 'no-email@domain.com',
      source: 'CSV Bulk Import',
      preferredLanguage: c.preferredLanguage || c.language || 'English',
      interestLevel: 'Medium',
      stage: 'New',
      consentStatus: 'Opted In (Imported)',
      assignedAgentId: 'agent-1',
      assignedAgentName: 'Rohan (Real Estate)',
      lastCallDate: null,
      nextFollowUp: null,
      notes: 'Imported via CSV batch upload.',
      callCount: 0,
    }));

    contactsStore = [...imported, ...contactsStore];
    return { count: imported.length, contacts: imported };
  },

  async deleteContact(id) {
    await apiClient.simulatedDelay(150);
    contactsStore = contactsStore.filter(c => c.id !== id);
    return { success: true, id };
  },
};

export default contactsService;
