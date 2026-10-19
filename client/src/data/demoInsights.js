// Demo Conversation Insights dataset

export const demoObjections = [
  {
    id: 'obj-1',
    objection: 'Budget / Pricing is perceived as higher than nearby projects',
    frequency: 412,
    percentage: '31.2%',
    sentiment: 'Negative',
    suggestedHandling: 'Highlight inclusive luxury amenities, zero maintenance for year 1, and RERA registration compliance.',
  },
  {
    id: 'obj-2',
    objection: 'Needs to consult family elder / spouse before committing to site visit',
    frequency: 340,
    percentage: '25.8%',
    sentiment: 'Neutral',
    suggestedHandling: 'Offer weekend family pass with complimentary chauffeur pickup or digital walkthrough link.',
  },
  {
    id: 'obj-3',
    objection: 'Possession date is too far (prefer ready-to-move units)',
    frequency: 285,
    percentage: '21.6%',
    sentiment: 'Neutral',
    suggestedHandling: 'Pitch Tower A which reaches structural completion in Q1 2027.',
  },
  {
    id: 'obj-4',
    objection: 'Concerns regarding bank loan pre-qualification and down payment percentage',
    frequency: 182,
    percentage: '13.8%',
    sentiment: 'Neutral',
    suggestedHandling: 'Offer free pre-qualification consultation with in-house HDFC/SBI banking desk.',
  },
  {
    id: 'obj-5',
    objection: 'Competitor offering lower booking token amount',
    frequency: 98,
    percentage: '7.4%',
    sentiment: 'Negative',
    suggestedHandling: 'Emphasize construction warranty, carpet area efficiency, and superior brand trust.',
  },
];

export const demoTopFaqs = [
  { question: 'What is the RERA registration number of the project?', count: 680, resolutionRate: '98.5%' },
  { question: 'Do you accept dental insurance coverage like Delta or Cigna?', count: 520, resolutionRate: '96.2%' },
  { question: 'What is the minimum wholesale order parcel size for transport?', count: 440, resolutionRate: '94.0%' },
  { question: 'Are there any hidden clubhouse or covered parking charges?', count: 390, resolutionRate: '92.8%' },
  { question: 'Can I reschedule my appointment if I have work conflicts?', count: 310, resolutionRate: '99.1%' },
];

export const demoUnresolvedQuestions = [
  {
    question: 'Can I install a commercial EV supercharger in the basement parking bay?',
    count: 38,
    impact: 'Medium',
    action: 'Add EV charging clause to Project KB',
  },
  {
    question: 'Are dental crown replacements covered under Medicare Advantage part C?',
    count: 24,
    impact: 'High',
    action: 'Provide dental insurance table to Priya agent prompt',
  },
  {
    question: 'Can you export fabric shipments via Dubai transit ports with customs clearance?',
    count: 19,
    impact: 'Medium',
    action: 'Add export clearance policy to Surat KB',
  },
];

export const demoFailureReasons = [
  { reason: 'Customer hung up during initial greeting (< 6 seconds)', percentage: 42, count: 546 },
  { reason: 'Answering Machine / Voicemail detected and disconnected', percentage: 28, count: 364 },
  { reason: 'Language mismatch before auto-detect triggered', percentage: 12, count: 156 },
  { reason: 'Silence timeout reached after multiple re-prompts', percentage: 10, count: 130 },
  { reason: 'Customer requested human transfer but all agents were busy', percentage: 8, count: 104 },
];

export const demoExtractedRequirements = [
  { field: '3BHK Unit Size', count: 1840, percentage: '52%' },
  { field: 'Budget ₹80L - ₹1.1Cr', count: 1420, percentage: '40%' },
  { field: 'Possession in < 6 Months', count: 1210, percentage: '34%' },
  { field: 'Pre-approved Loan', count: 1090, percentage: '31%' },
  { field: 'Balcony / Garden Facing', count: 980, percentage: '28%' },
];
