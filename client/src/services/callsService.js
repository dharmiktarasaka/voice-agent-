import apiClient from './apiClient';
import { initialCalls } from '../data/demoCalls';
import { initialLiveCalls } from '../data/demoLiveCalls';

let callsStore = [...initialCalls];
let liveCallsStore = [...initialLiveCalls];

export const callsService = {
  async getCalls(filters = {}) {
    await apiClient.simulatedDelay(150);
    let list = [...callsStore];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        c =>
          c.contactName.toLowerCase().includes(q) ||
          c.phoneNumber.toLowerCase().includes(q) ||
          c.contactCompany?.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    if (filters.direction && filters.direction !== 'all') {
      list = list.filter(c => c.direction === filters.direction);
    }

    if (filters.agentId && filters.agentId !== 'all') {
      list = list.filter(c => c.agentId === filters.agentId);
    }

    if (filters.language && filters.language !== 'all') {
      list = list.filter(c => c.languageCode === filters.language || c.language.toLowerCase() === filters.language.toLowerCase());
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.outcome && filters.outcome !== 'all') {
      list = list.filter(c => c.outcome.toLowerCase().includes(filters.outcome.toLowerCase()));
    }

    return list;
  },

  async getCallById(id) {
    await apiClient.simulatedDelay(100);
    const call = callsStore.find(c => c.id === id);
    if (!call) throw new Error(`Call with ID ${id} not found`);
    return { ...call };
  },

  async addCallNote(callId, noteText, author = 'Operations Manager') {
    await apiClient.simulatedDelay(150);
    const call = callsStore.find(c => c.id === callId);
    if (!call) throw new Error(`Call with ID ${callId} not found`);

    const newNote = {
      id: `note-${Date.now()}`,
      author,
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    call.notes = [newNote, ...(call.notes || [])];
    return newNote;
  },

  async updateCallOutcome(callId, outcome) {
    await apiClient.simulatedDelay(150);
    const call = callsStore.find(c => c.id === callId);
    if (!call) throw new Error(`Call with ID ${callId} not found`);

    call.outcome = outcome;
    return call;
  },

  // Live Calls
  async getLiveCalls() {
    await apiClient.simulatedDelay(80);
    return [...liveCallsStore];
  },

  async endLiveCall(liveCallId) {
    await apiClient.simulatedDelay(200);
    const index = liveCallsStore.findIndex(c => c.id === liveCallId);
    if (index === -1) throw new Error('Live call not found');

    const liveCall = liveCallsStore[index];
    liveCallsStore.splice(index, 1);

    // Create a completed call in call history
    const completedCall = {
      id: `call-${Date.now().toString().slice(-5)}`,
      contactName: liveCall.contactName,
      contactCompany: liveCall.contactCompany,
      phoneNumber: liveCall.phoneNumber,
      direction: liveCall.direction,
      agentId: liveCall.agentId,
      agentName: liveCall.agentName,
      language: liveCall.language,
      languageCode: liveCall.languageCode,
      startTime: new Date(liveCall.startedAt).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: Math.floor((Date.now() - liveCall.startedAt) / 1000),
      status: 'Completed',
      outcome: 'Customer Hung Up',
      cost: '$0.09',
      recordingAvailable: true,
      summary: `Live call ended by operator intervention. Last stage: ${liveCall.stage}.`,
      sentiment: liveCall.sentiment,
      notes: [],
      timeline: [
        { time: new Date(liveCall.startedAt).toLocaleTimeString(), event: 'Call answered' },
        { time: new Date().toLocaleTimeString(), event: 'Call ended by operator' },
      ],
      transcript: liveCall.transcriptFeed.map((m, idx) => ({
        id: `t-${idx}`,
        speaker: m.speaker,
        speakerName: m.speakerName,
        time: new Date().toLocaleTimeString(),
        language: liveCall.language,
        text: m.text,
      })),
    };

    callsStore.unshift(completedCall);
    return completedCall;
  },
};

export default callsService;
