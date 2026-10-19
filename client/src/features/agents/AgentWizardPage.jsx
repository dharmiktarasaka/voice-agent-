import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Bot,
  Globe,
  Mic,
  MessageSquare,
  Sparkles,
  Volume2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader } from '../../components/ui/Card';
import { agentsService } from '../../services/agentsService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

const SIMPLE_STEPS = [
  { id: 1, title: 'Name & Business', desc: 'Who is your AI caller?' },
  { id: 2, title: 'Language & Voice', desc: 'How do they speak?' },
  { id: 3, title: 'Job & Greeting', desc: 'What should they say?' },
  { id: 4, title: 'Finish & Test', desc: 'Review & Activate' },
];

export function AgentWizardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    purpose: 'Lead Qualification',
    supportedLanguages: ['en', 'hi'],
    primaryLanguage: 'en',
    voiceName: 'Neeraj (Indian English & Hindi)',
    voiceId: 'neer-in-warm',
    greeting: 'Hello! Thank you for calling. How can I help you today?',
    goal: 'Understand what the customer needs, answer questions, and schedule a callback or appointment.',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = 'Please give your AI caller a name';
      if (!formData.businessName.trim()) errs.businessName = 'Please enter your business name';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTestVoice = () => {
    setIsPlayingVoice(true);
    toast.info(`Playing sample voice: "${formData.voiceName}" (Demo)`);
    setTimeout(() => setIsPlayingVoice(false), 2000);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const created = await agentsService.createAgent({
        name: formData.name,
        businessName: formData.businessName,
        description: `AI voice assistant for ${formData.businessName}. Goals: ${formData.goal}`,
        purpose: formData.purpose,
        status: 'active',
        calling: {
          inbound: true,
          outbound: true,
          transferPreference: 'warm_transfer',
          transferPhone: '+91 98200 12345',
          maxCallDuration: 600,
          silenceTimeout: 6,
          endOfCallBehavior: 'polite_goodbye',
        },
        language: {
          supportedLanguages: formData.supportedLanguages,
          primaryLanguage: formData.primaryLanguage,
          autoDetect: true,
          languageSwitchPrompt: 'Switch between Hindi, Gujarati, and English automatically.',
        },
        voice: {
          provider: 'VoicePilot Neural',
          voiceId: formData.voiceId,
          voiceName: formData.voiceName,
          speed: 1.0,
          pitch: 1.0,
          tone: 'Friendly & Professional',
          previewAudioText: formData.greeting,
        },
        instructions: {
          systemPrompt: `You are ${formData.name}, representing ${formData.businessName}.
Greet customers warmly with: "${formData.greeting}".
Primary goal: ${formData.goal}.
Always be polite, helpful, and concise.`,
          conversationGoals: [formData.goal],
          questionsToAsk: ['How may I help you today?'],
          prohibitedTopics: ['Never share unauthorized customer confidential data.'],
          escalationRules: 'If caller asks for a human supervisor, offer to transfer immediately.',
          humanHandoffPhone: '+91 98200 12345',
        },
        behavior: {
          interruptionHandling: 'graceful_yield',
          maxResponseLength: 100,
          retryBehavior: 2,
          callCompletionConditions: 'Goal completed.',
        },
        extraction: {
          summaryEnabled: true,
          leadInterestScoring: true,
          callbackRequest: true,
          followUpDate: true,
          customFields: [],
        },
      });

      toast.success(`AI Caller "${created.name}" is ready!`);
      navigate(`/agents/${created.id}`);
    } catch (err) {
      toast.error('Failed to create caller.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/agents')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Create a Simple AI Voice Caller
            </h1>
            <p className="text-xs text-slate-500">
              Step {currentStep} of 4: {SIMPLE_STEPS[currentStep - 1].title}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/agents')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        >
          Cancel
        </button>
      </div>

      {/* Friendly Step Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {SIMPLE_STEPS.map(s => (
          <div
            key={s.id}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              currentStep === s.id
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                : currentStep > s.id
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-xs font-bold">Step {s.id}</div>
            <div className="text-[11px] truncate hidden sm:block">{s.title}</div>
          </div>
        ))}
      </div>

      {/* STEP 1: Name & Business */}
      {currentStep === 1 && (
        <Card padding="p-6" className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Who is your AI Caller?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Give your assistant a friendly name and company name.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Caller Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rohan, Priya, Alex"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100"
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Business or Store Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Health Clinic, Skyline Realty, My Store"
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100"
              />
              {errors.businessName && (
                <p className="text-xs text-rose-500 mt-1">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What is this caller's main job?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: 'Lead Qualification', label: '🏡 Property & Sales Leads', desc: 'Ask buyer budget & location' },
                  { id: 'Appointment Booking', label: '📅 Booking Appointments', desc: 'Schedule patient or client visits' },
                  { id: 'Customer Support', label: '💬 Answering Customer Questions', desc: 'Help with hours, orders & pricing' },
                  { id: 'Lead Follow-up', label: '📞 Following Up with Leads', desc: 'Call back people who requested info' },
                ].map(p => (
                  <label
                    key={p.id}
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                      formData.purpose === p.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="purpose"
                        checked={formData.purpose === p.id}
                        onChange={() => setFormData({ ...formData, purpose: p.id })}
                        className="text-indigo-600"
                      />
                      <span className="text-xs text-slate-900 dark:text-slate-100">{p.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 pl-5 font-normal">{p.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: Language & Voice */}
      {currentStep === 2 && (
        <Card padding="p-6" className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Languages & Voice
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select what languages this caller can speak.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Supported Languages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'en', name: 'English' },
                  { id: 'hi', name: 'Hindi (हिन्दी)' },
                  { id: 'gu', name: 'Gujarati (ગુજરાતી)' },
                ].map(lang => {
                  const isChecked = formData.supportedLanguages.includes(lang.id);
                  return (
                    <label
                      key={lang.id}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const current = [...formData.supportedLanguages];
                          const next = e.target.checked
                            ? [...current, lang.id]
                            : current.filter(x => x !== lang.id);
                          setFormData({ ...formData, supportedLanguages: next });
                        }}
                        className="rounded text-indigo-600 w-4 h-4"
                      />
                      <span className="text-xs text-slate-900 dark:text-slate-100">{lang.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Choose Voice Sound
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'neer-in-warm', name: 'Neeraj (Friendly Indian Male)' },
                  { id: 'priya-in-gentle', name: 'Priya (Gentle Indian Female)' },
                  { id: 'meera-gu-warm', name: 'Meera (Authentic Gujarati / Hindi)' },
                  { id: 'aarav-en-tech', name: 'Aarav (Crisp Professional Male)' },
                ].map(v => (
                  <label
                    key={v.id}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                      formData.voiceId === v.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="voice"
                        checked={formData.voiceId === v.id}
                        onChange={() => setFormData({ ...formData, voiceId: v.id, voiceName: v.name })}
                        className="text-indigo-600"
                      />
                      <span className="text-xs text-slate-900 dark:text-slate-100">{v.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestVoice}
                  icon={Volume2}
                  disabled={isPlayingVoice}
                >
                  {isPlayingVoice ? 'Playing sample...' : 'Listen to Voice Sample'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Job & Greeting */}
      {currentStep === 3 && (
        <Card padding="p-6" className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              What should your caller say?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the opening greeting and simple goal in plain words.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Greeting Message (What they say first when call connects)
              </label>
              <textarea
                rows={2}
                value={formData.greeting}
                onChange={e => setFormData({ ...formData, greeting: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What is the goal of the conversation?
              </label>
              <textarea
                rows={3}
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Write in simple words. The AI will follow this naturally during the conversation.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Review & Test */}
      {currentStep === 4 && (
        <Card padding="p-6" className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Review & Ready to Call
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Check your settings and click Activate to start using your caller.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Caller & Company</span>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{formData.name}</div>
              <div className="text-slate-500">{formData.businessName}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Languages & Voice</span>
              <div className="font-bold text-slate-900 dark:text-slate-100">{formData.voiceName}</div>
              <div className="text-slate-500">{formData.supportedLanguages.map(l => l.toUpperCase()).join(', ')}</div>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Opening Greeting</span>
              <p className="text-slate-700 dark:text-slate-300 italic">"{formData.greeting}"</p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          icon={ArrowLeft}
        >
          Back
        </Button>

        {currentStep === 4 ? (
          <Button
            variant="primary"
            onClick={handleFinish}
            isLoading={isSubmitting}
            icon={Check}
          >
            Activate & Finish
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next Step
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default AgentWizardPage;
