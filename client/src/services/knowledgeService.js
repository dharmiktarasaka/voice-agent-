import apiClient from './apiClient';
import { initialKnowledgeArticles, initialKnowledgeDocuments } from '../data/demoKnowledgeBase';

let articlesStore = [...initialKnowledgeArticles];
let documentsStore = [...initialKnowledgeDocuments];

export const knowledgeService = {
  async getArticles(category = 'All Categories', search = '') {
    await apiClient.simulatedDelay(120);
    let list = [...articlesStore];

    if (category && category !== 'All Categories') {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async createArticle(data) {
    await apiClient.simulatedDelay(200);
    const newArticle = {
      id: `kb-${Date.now().toString().slice(-4)}`,
      updatedAt: new Date().toISOString(),
      views: 0,
      tags: data.tags || ['Custom'],
      ...data,
    };
    articlesStore.unshift(newArticle);
    return newArticle;
  },

  async updateArticle(id, data) {
    await apiClient.simulatedDelay(150);
    const idx = articlesStore.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Article not found');

    articlesStore[idx] = {
      ...articlesStore[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return articlesStore[idx];
  },

  async deleteArticle(id) {
    await apiClient.simulatedDelay(150);
    articlesStore = articlesStore.filter(a => a.id !== id);
    return { success: true, id };
  },

  // Document attachments
  async getDocuments() {
    await apiClient.simulatedDelay(100);
    return [...documentsStore];
  },

  async uploadDocument(fileName, fileSize = '2.4 MB', category = 'General') {
    await apiClient.simulatedDelay(250);
    const newDoc = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      fileName,
      fileSize,
      category,
      uploadedAt: new Date().toISOString(),
      status: 'Processing',
      vectorChunks: 0,
    };
    documentsStore.unshift(newDoc);
    return newDoc;
  },

  async processDocument(docId) {
    await apiClient.simulatedDelay(400);
    const doc = documentsStore.find(d => d.id === docId);
    if (doc) {
      doc.status = 'Indexed';
      doc.vectorChunks = Math.floor(Math.random() * 80) + 20;
    }
    return doc;
  },
};

export default knowledgeService;
