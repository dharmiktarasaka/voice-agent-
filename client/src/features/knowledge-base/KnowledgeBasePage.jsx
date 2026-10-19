import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  FileText,
  Upload,
  Search,
  Tag,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Modal from '../../components/ui/Modal';
import { knowledgeService } from '../../services/knowledgeService';
import { knowledgeCategories } from '../../data/demoKnowledgeBase';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDateTime } from '../../utils/formatters';

export function KnowledgeBasePage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [articles, setArticles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'documents'

  // Modals
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Pricing',
    summary: '',
    content: '',
    tags: 'Pricing, Real Estate',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [artList, docList] = await Promise.all([
        knowledgeService.getArticles(activeCategory, search),
        knowledgeService.getDocuments(),
      ]);
      setArticles(artList);
      setDocuments(docList);
    } catch (err) {
      toast.error('Failed to load knowledge base.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCategory, search]);

  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Company Information',
      summary: '',
      content: '',
      tags: '',
    });
    setArticleModalOpen(true);
  };

  const handleOpenEditArticle = art => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      category: art.category,
      summary: art.summary,
      content: art.content,
      tags: (art.tags || []).join(', '),
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async e => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      toast.error('Article title is required.');
      return;
    }

    const payload = {
      title: articleForm.title,
      category: articleForm.category,
      summary: articleForm.summary,
      content: articleForm.content,
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingArticle) {
        const updated = await knowledgeService.updateArticle(editingArticle.id, payload);
        setArticles(prev => prev.map(a => (a.id === updated.id ? updated : a)));
        toast.success('Knowledge article updated.');
      } else {
        const created = await knowledgeService.createArticle(payload);
        setArticles(prev => [created, ...prev]);
        toast.success('New knowledge article created.');
      }
      setArticleModalOpen(false);
    } catch (err) {
      toast.error('Failed to save article.');
    }
  };

  const handleDeleteArticle = async art => {
    const confirmed = await confirm({
      title: 'Delete Knowledge Article?',
      message: `Are you sure you want to delete "${art.title}"? Voice agents will no longer reference this information.`,
      confirmText: 'Delete',
      variant: 'danger',
    });
    if (confirmed) {
      try {
        await knowledgeService.deleteArticle(art.id);
        setArticles(prev => prev.filter(a => a.id !== art.id));
        toast.success('Article deleted.');
      } catch (err) {
        toast.error('Failed to delete article.');
      }
    }
  };

  const handleProcessDocument = async docId => {
    toast.info('Simulating document chunking and vector embeddings generation...');
    try {
      const updated = await knowledgeService.processDocument(docId);
      setDocuments(prev => prev.map(d => (d.id === docId ? updated : d)));
      toast.success(`Document indexed with ${updated.vectorChunks} embedding chunks!`, 'Indexed');
    } catch (err) {
      toast.error('Failed to process document.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              AI Knowledge Base
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {articles.length} Articles • {documents.length} Documents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ground voice agents with verified company facts, product catalogs, service FAQs, and PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={activeTab === 'articles' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('articles')}
          >
            Articles & FAQs
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('documents')}
            icon={Upload}
          >
            Upload Documents
          </Button>
        </div>
      </div>

      {/* RAG & Embeddings Simulation Notice Banner */}
      <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong>Phase 1 RAG Simulation:</strong> In Phase 2, articles and uploaded PDFs will be automatically parsed, split into semantically coherent chunks, and indexed into MongoDB Vector Search for sub-80ms grounding during live speech turns.
        </div>
      </div>

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {/* Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {knowledgeCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SearchInput
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full sm:w-60"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateArticle}
                icon={Plus}
              >
                Add Article
              </Button>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(art => (
              <Card key={art.id} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="purple" size="sm">
                      {art.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditArticle(art)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {art.content}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(art.tags || []).map(t => (
                      <span key={t} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>{art.views || 0} agent lookups</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Upload Dropzone */}
          <Card className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center space-y-3">
            <Upload className="w-10 h-10 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Upload business brochures, price books, and PDFs
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports PDF, DOCX, and TXT files up to 25MB each
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Upload}
              onClick={() => {
                knowledgeService.uploadDocument('Product_Catalog_2026_Updated.pdf', '3.8 MB', 'Catalog').then(doc => {
                  setDocuments(prev => [doc, ...prev]);
                  toast.success('Simulated file upload complete. Document ready for indexing.');
                });
              }}
            >
              Simulate Document Upload
            </Button>
          </Card>

          {/* Document Status List */}
          <Card padding="p-0" className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Uploaded Documents & Indexing Status
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {doc.fileName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.fileSize} • Uploaded {formatDateTime(doc.uploadedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {doc.vectorChunks > 0 && (
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {doc.vectorChunks} chunks
                      </span>
                    )}

                    <StatusBadge status={doc.status} />

                    {doc.status !== 'Indexed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProcessDocument(doc.id)}
                        icon={Cpu}
                      >
                        Process & Index
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Article Modal */}
      <Modal
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        title={editingArticle ? 'Edit Knowledge Article' : 'Add Knowledge Article'}
        subtitle="Write verified business policies or FAQ answers for AI agent reference"
      >
        <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Skyline Sector 62 Towers Master Pricing"
              value={articleForm.title}
              onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={articleForm.category}
                onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              >
                {knowledgeCategories.filter(c => c !== 'All Categories').map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="Pricing, Luxury, Tower A"
                value={articleForm.tags}
                onChange={e => setArticleForm({ ...articleForm, tags: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Brief Summary (1-2 sentences)
            </label>
            <input
              type="text"
              placeholder="Short summary for semantic lookup..."
              value={articleForm.summary}
              onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Article Content / Instructions
            </label>
            <textarea
              rows={6}
              placeholder="Detailed terms, answers to FAQs, or service rules..."
              value={articleForm.content}
              onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
              className="w-full font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setArticleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Article
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default KnowledgeBasePage;
