// Demo Knowledge Base dataset with articles and document processing statuses

export const initialKnowledgeArticles = [
  {
    id: 'kb-1',
    title: 'Skyline Sector 62 Towers: Master Pricing & Unit Sizes',
    category: 'Pricing',
    summary: 'Official base sale price, floor rise charges, parking costs, and GST calculation for Tower A and B.',
    content: `Unit Types & Sizes:
- 2BHK Luxury: 1250 sq.ft (Starting from ₹62 Lakhs)
- 3BHK Premium: 1850 sq.ft (Starting from ₹85 Lakhs to ₹92 Lakhs based on floor rise)
- 4BHK Penthouse: 3100 sq.ft (Starting from ₹1.85 Crores)

Payment Plan:
- 10% on Booking Token
- 80% Construction Linked Milestone Payments
- 10% on Final Possession Handover (Target June 2027)`,
    updatedAt: '2026-10-18T10:00:00Z',
    tags: ['Pricing', 'Real Estate', 'Floor Plans'],
    views: 1420,
  },
  {
    id: 'kb-2',
    title: 'Apex Dental: Operating Hours & Emergency Protocol',
    category: 'Policies',
    summary: 'Standard operating hours, weekend roster, triage protocols for acute facial swelling or trauma.',
    content: `Clinic Timings:
- Monday to Saturday: 10:00 AM – 7:00 PM
- Sunday: Closed (Emergency on-call doctor available via hotline)

Emergency Triage Rules for AI Agent:
- If patient mentions uncontrolled bleeding, facial bone fracture, or fever with swelling: Instruct patient to proceed immediately to Apex Hospital ER or connect to emergency line +91 98111 22334.
- Routine toothaches should be booked for the earliest available outpatient slot.`,
    updatedAt: '2026-10-16T14:30:00Z',
    tags: ['Dental', 'Hours', 'Emergency Protocol'],
    views: 890,
  },
  {
    id: 'kb-3',
    title: 'Diamond Textiles: Wholesale MOQ & Dispatch Guidelines',
    category: 'Services',
    summary: 'Minimum order quantities for Gujarati sarees, transport packing guidelines, and payment terms.',
    content: `Wholesale Conditions:
- Minimum Order Quantity (MOQ): 50 pieces across catalog designs
- Standard wholesale discount: 15% on MRP
- Transport: Dispatched via Surat Safe Express Transport within 48 hours of advance NEFT/RTGS payment.
- Return Policy: Defective or damaged pieces must be notified within 7 days of parcel delivery with unboxing video proof.`,
    updatedAt: '2026-10-14T12:00:00Z',
    tags: ['Wholesale', 'Retail', 'Gujarati', 'Shipping'],
    views: 640,
  },
  {
    id: 'kb-4',
    title: 'CloudStack Analytics: API Rate Limiting & Tier Quotas',
    category: 'Company Information',
    summary: 'Rate limit quotas by subscription tier, headers returned, and burst allowance algorithms.',
    content: `Tier Allowances:
- Developer Sandbox: 60 req/min (Burst 100)
- Growth Tier: 600 req/min (Burst 1,200)
- Enterprise Tier: 10,000 req/min or Unthrottled dedicated gateway

Response Headers:
- X-RateLimit-Limit: Total allowed in window
- X-RateLimit-Remaining: Tokens remaining in bucket
- X-RateLimit-Reset: Seconds until token bucket refill`,
    updatedAt: '2026-10-10T16:00:00Z',
    tags: ['API', 'Rate Limits', 'CloudStack'],
    views: 1120,
  },
  {
    id: 'kb-5',
    title: 'Customer FAQs: Data Privacy & Call Recording Consent',
    category: 'FAQs',
    summary: 'Standard responses for callers asking how their audio recordings and personal data are stored.',
    content: `Q: Are phone calls recorded?
A: Yes, calls are recorded and transcribed for quality assurance, training, and appointment accuracy. Callers may request DNC exclusion at any time.

Q: How is my personal information protected?
A: VoicePilot AI operates under SOC2 Type II compliance and ISO 27001 data encryption standards. All audio streams and transcripts are encrypted in transit via TLS 1.3 and at rest with AES-256.`,
    updatedAt: '2026-10-15T09:15:00Z',
    tags: ['Privacy', 'Compliance', 'Security'],
    views: 2150,
  },
];

export const initialKnowledgeDocuments = [
  {
    id: 'doc-1',
    fileName: 'Skyline_Sector62_Brochure_v4.pdf',
    fileSize: '4.8 MB',
    uploadedAt: '2026-10-18T14:20:00Z',
    status: 'Indexed', // Draft, Ready for Processing, Processing, Indexed, Failed
    vectorChunks: 142,
    category: 'Real Estate',
  },
  {
    id: 'doc-2',
    fileName: 'ApexDental_FeeSchedule_2026.docx',
    fileSize: '1.2 MB',
    uploadedAt: '2026-10-17T09:10:00Z',
    status: 'Indexed',
    vectorChunks: 48,
    category: 'Healthcare',
  },
  {
    id: 'doc-3',
    fileName: 'DiamondTextiles_Festive_Catalog_Hindi_Gu.pdf',
    fileSize: '12.4 MB',
    uploadedAt: '2026-10-19T08:00:00Z',
    status: 'Processing',
    vectorChunks: 0,
    category: 'Retail',
  },
  {
    id: 'doc-4',
    fileName: 'CloudStack_API_Spec_OpenAPIv3.json',
    fileSize: '680 KB',
    uploadedAt: '2026-10-19T10:30:00Z',
    status: 'Ready for Processing',
    vectorChunks: 0,
    category: 'Technical',
  },
];

export const knowledgeCategories = [
  'All Categories',
  'Company Information',
  'Services',
  'Pricing',
  'FAQs',
  'Policies',
  'Industry Knowledge',
  'Custom',
];
