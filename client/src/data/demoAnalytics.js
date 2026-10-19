// Comprehensive demo Analytics metrics with formula explanations

export const analyticsFormulas = {
  answerRate: 'Total Answered Calls ÷ Total Placed Calls × 100',
  completionRate: 'Completed Conversations without Abrupt Drop ÷ Total Answered Calls × 100',
  qualificationRate: 'Qualified Leads (Meeting All Criteria) ÷ Total Answered Calls × 100',
  conversionRate: 'Appointments / Deals Booked ÷ Qualified Leads × 100',
  costPerCall: 'Total Telephony + AI Neural Compute Cost ÷ Total Answered Calls',
  costPerQualifiedLead: 'Total Campaign Cost ÷ Total Qualified Leads',
};

export const analyticsDateRanges = {
  today: {
    totalVolume: 750,
    answerRate: '85.1%',
    completionRate: '92.4%',
    avgDuration: '3m 18s',
    qualificationRate: '26.0%',
    conversionRate: '61.5%',
    costPerCall: '$0.12',
    costPerLead: '$0.46',
    callsByDay: [
      { time: '08:00', calls: 35, answered: 30, qualified: 8 },
      { time: '10:00', calls: 140, answered: 122, qualified: 34 },
      { time: '12:00', calls: 195, answered: 168, qualified: 42 },
      { time: '14:00', calls: 180, answered: 154, qualified: 39 },
      { time: '16:00', calls: 200, answered: 164, qualified: 44 },
    ],
  },
  '7d': {
    totalVolume: 5120,
    answerRate: '84.6%',
    completionRate: '91.8%',
    avgDuration: '3m 22s',
    qualificationRate: '28.1%',
    conversionRate: '63.2%',
    costPerCall: '$0.12',
    costPerLead: '$0.43',
    callsByDay: [
      { day: 'Mon', calls: 710, answered: 602, qualified: 172 },
      { day: 'Tue', calls: 780, answered: 665, qualified: 194 },
      { day: 'Wed', calls: 820, answered: 698, qualified: 208 },
      { day: 'Thu', calls: 790, answered: 668, qualified: 198 },
      { day: 'Fri', calls: 850, answered: 722, qualified: 215 },
      { day: 'Sat', calls: 690, answered: 580, qualified: 164 },
      { day: 'Sun', calls: 480, answered: 395, qualified: 98 },
    ],
  },
  '30d': {
    totalVolume: 14820,
    answerRate: '84.2%',
    completionRate: '91.5%',
    avgDuration: '3m 24s',
    qualificationRate: '28.4%',
    conversionRate: '61.8%',
    costPerCall: '$0.12',
    costPerLead: '$0.42',
    callsByDay: [
      { week: 'Week 1', calls: 3200, answered: 2710, qualified: 765 },
      { week: 'Week 2', calls: 3650, answered: 3080, qualified: 885 },
      { week: 'Week 3', calls: 3980, answered: 3350, qualified: 952 },
      { week: 'Week 4', calls: 3990, answered: 3340, qualified: 940 },
    ],
  },
  '90d': {
    totalVolume: 42100,
    answerRate: '83.9%',
    completionRate: '90.7%',
    avgDuration: '3m 28s',
    qualificationRate: '27.8%',
    conversionRate: '60.4%',
    costPerCall: '$0.13',
    costPerLead: '$0.47',
    callsByDay: [
      { month: 'Month 1', calls: 12400, answered: 10420, qualified: 2890 },
      { month: 'Month 2', calls: 14200, answered: 11950, qualified: 3340 },
      { month: 'Month 3', calls: 15500, answered: 13020, qualified: 3680 },
    ],
  },
};

export const demoDurationDistribution = [
  { range: '< 1 min (Drop/Voicemail)', count: 2640, percentage: 17.8 },
  { range: '1 - 2 mins', count: 3410, percentage: 23.0 },
  { range: '2 - 4 mins (Ideal Qualified)', count: 5820, percentage: 39.3 },
  { range: '4 - 6 mins', count: 2150, percentage: 14.5 },
  { range: '> 6 mins (Complex Inquiry)', count: 800, percentage: 5.4 },
];

export const demoCampaignComparison = [
  { name: 'Diwali Real Estate', dials: 1820, answered: 1547, qualRate: 33.1, costPerLead: '$0.39' },
  { name: 'Dental Reactivation', dials: 620, answered: 540, qualRate: 38.8, costPerLead: '$0.31' },
  { name: 'Surat Wholesale', dials: 840, answered: 710, qualRate: 34.5, costPerLead: '$0.35' },
];
