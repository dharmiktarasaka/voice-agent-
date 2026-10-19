// Demo data for Dashboard Overview & KPIs

export const demoKpiData = {
  totalCalls: {
    value: 14820,
    change: 14.8,
    isPositive: true,
    previous: 12905,
    sparkline: [420, 480, 460, 510, 580, 540, 620, 690, 710, 750],
  },
  answeredCalls: {
    value: 12480,
    change: 12.3,
    isPositive: true,
    rate: '84.2%',
    sparkline: [350, 405, 390, 430, 490, 455, 520, 585, 600, 630],
  },
  successfulConversations: {
    value: 9815,
    change: 18.5,
    isPositive: true,
    rate: '78.6%',
    sparkline: [270, 310, 305, 340, 395, 370, 415, 460, 480, 505],
  },
  qualifiedLeads: {
    value: 3542,
    change: 22.1,
    isPositive: true,
    rate: '28.4%',
    sparkline: [95, 110, 105, 125, 145, 138, 160, 175, 185, 195],
  },
  avgCallDuration: {
    value: '3m 24s',
    rawSeconds: 204,
    change: -4.2, // lower duration while maintaining high qual rate is positive in sales/support
    isPositive: true,
    sparkline: [225, 220, 215, 210, 208, 205, 206, 204, 203, 204],
  },
  estimatedCost: {
    value: '$1,778.40',
    change: -8.4,
    isPositive: true, // cost savings
    costPerMin: '$0.035',
    sparkline: [210, 195, 190, 185, 180, 178, 175, 174, 170, 168],
  },
};

export const demoCallsOverTime = [
  { date: 'Oct 10', total: 420, answered: 354, qualified: 102 },
  { date: 'Oct 11', total: 450, answered: 382, qualified: 115 },
  { date: 'Oct 12', total: 390, answered: 325, qualified: 94 },
  { date: 'Oct 13', total: 510, answered: 433, qualified: 130 },
  { date: 'Oct 14', total: 580, answered: 495, qualified: 148 },
  { date: 'Oct 15', total: 640, answered: 544, qualified: 165 },
  { date: 'Oct 16', total: 610, answered: 518, qualified: 152 },
  { date: 'Oct 17', total: 690, answered: 586, qualified: 178 },
  { date: 'Oct 18', total: 720, answered: 612, qualified: 188 },
  { date: 'Oct 19', total: 750, answered: 638, qualified: 195 },
];

export const demoDirectionBreakdown = [
  { name: 'Outbound Campaigns', value: 8940, color: '#4F46E5' },
  { name: 'Inbound Inquiries', value: 5880, color: '#06B6D4' },
];

export const demoOutcomeDistribution = [
  { name: 'Qualified Lead', value: 3542, color: '#10B981' },
  { name: 'Appointment Booked', value: 2180, color: '#3B82F6' },
  { name: 'Callback Requested', value: 2410, color: '#F59E0B' },
  { name: 'Voicemail / No Answer', value: 2340, color: '#94A3B8' },
  { name: 'Not Interested', value: 2890, color: '#EF4444' },
  { name: 'Wrong Number / Invalid', value: 1458, color: '#64748B' },
];

export const demoLanguageDistribution = [
  { name: 'English', calls: 7114, percentage: 48, color: '#6366F1' },
  { name: 'Hindi', calls: 5335, percentage: 36, color: '#EC4899' },
  { name: 'Gujarati', calls: 2371, percentage: 16, color: '#F97316' },
];

export const demoAgentPerformance = [
  { agent: 'Rohan (Real Estate)', calls: 4120, conversion: 32.4, rating: 4.8 },
  { agent: 'Priya (Healthcare)', calls: 3450, conversion: 29.8, rating: 4.7 },
  { agent: 'Aarav (Tech Support)', calls: 2890, conversion: 24.1, rating: 4.6 },
  { agent: 'Meera (Retail Gujarati)', calls: 2410, conversion: 27.5, rating: 4.9 },
  { agent: 'Vikram (B2B Followup)', calls: 1950, conversion: 31.0, rating: 4.7 },
];

export const demoHourlyActivity = [
  { hour: '08 AM', calls: 120 },
  { hour: '09 AM', calls: 380 },
  { hour: '10 AM', calls: 620 },
  { hour: '11 AM', calls: 810 },
  { hour: '12 PM', calls: 540 },
  { hour: '01 PM', calls: 490 },
  { hour: '02 PM', calls: 680 },
  { hour: '03 PM', calls: 790 },
  { hour: '04 PM', calls: 840 },
  { hour: '05 PM', calls: 710 },
  { hour: '06 PM', calls: 450 },
  { hour: '07 PM', calls: 210 },
];

export const demoRecentActivity = [
  {
    id: 'act-1',
    type: 'qualification',
    title: 'Lead Qualified: Rajesh Patel',
    description: 'Agent Meera qualified buyer for 3BHK in Ahmedabad (Budget: ₹85 Lakhs)',
    time: '4 mins ago',
    badge: 'Gujarati',
    badgeColor: 'orange',
  },
  {
    id: 'act-2',
    type: 'appointment',
    title: 'Appointment Booked: Dr. Mehta Dental',
    description: 'Agent Priya scheduled routine checkup for Sarah Jenkins on Oct 22, 10:30 AM',
    time: '12 mins ago',
    badge: 'English',
    badgeColor: 'indigo',
  },
  {
    id: 'act-3',
    type: 'callback',
    title: 'Callback Requested: Amit Sharma',
    description: 'Agent Rohan logged callback for commercial warehouse leasing discussion',
    time: '28 mins ago',
    badge: 'Hindi',
    badgeColor: 'pink',
  },
  {
    id: 'act-4',
    type: 'escalation',
    title: 'Call Escalated to Human Agent',
    description: 'Customer requested immediate supervisor regarding billing adjustment #INV-8891',
    time: '45 mins ago',
    badge: 'English',
    badgeColor: 'indigo',
  },
  {
    id: 'act-5',
    type: 'campaign_complete',
    title: 'Campaign Batch Finished',
    description: 'Q4 Festival Promo batch completed 500 contacts with 81% answer rate',
    time: '1 hour ago',
    badge: 'Multilingual',
    badgeColor: 'emerald',
  },
];
