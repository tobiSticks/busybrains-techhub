export type ServiceCategory = {
  id: string
  name: string
  prefix: string
  sortOrder: number
  /** Core registered pillar (cybersecurity + government contracts). Drives
   * the featured placement on the homepage and /services — everything else
   * is demoted to "also through the BusyBrains Hub network". */
  pillar?: boolean
  blurb: string
  items: string[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Services',
    prefix: 'CYB',
    sortOrder: 1,
    pillar: true,
    blurb: 'From breach response to penetration testing, locked down by certified practitioners.',
    items: [
      'Vulnerability Assessment & Penetration Testing (VAPT)',
      'Security Consulting',
      'Security Awareness Training',
      'Risk Assessment & Compliance',
      'Incident Response & Monitoring',
    ],
  },
  {
    id: 'ai-automation',
    name: 'Artificial Intelligence & Automation',
    prefix: 'AIA',
    sortOrder: 2,
    blurb: 'Practical AI that removes manual work, not buzzword decks.',
    items: [
      'AI Solutions',
      'Business Process Automation',
      'AI Chatbots',
      'Data Analytics',
      'Machine Learning Solutions',
    ],
  },
  {
    id: 'software-it',
    name: 'Software & IT Solutions',
    prefix: 'SIT',
    sortOrder: 3,
    blurb: 'Websites, apps, and the IT backbone to keep them running.',
    items: [
      'Website Design & Development',
      'Software Development',
      'Mobile & Web Applications',
      'ICT Consultancy',
      'IT Support Services',
    ],
  },
  {
    id: 'government-contracts',
    name: 'Government Contract Services',
    prefix: 'GOV',
    sortOrder: 4,
    pillar: true,
    blurb: 'Procurement, tenders, and compliance handled by people who know the process.',
    items: [
      'Government Procurement Support',
      'Public Sector Project Execution',
      'Tender & Bid Preparation',
      'Contract Management & Compliance',
      'Supply of Goods and Services to Government Agencies',
    ],
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Branding',
    prefix: 'DMB',
    sortOrder: 5,
    blurb: 'Brand identity and growth, run with the same rigor as the rest of the business.',
    items: [
      'Social Media Management',
      'Digital Marketing',
      'Branding & Corporate Identity',
      'Content Creation',
      'SEO & Online Advertising',
    ],
  },
  {
    id: 'training-consultancy',
    name: 'Training & Consultancy',
    prefix: 'TRN',
    sortOrder: 6,
    blurb: 'Upskill your team or get a second opinion on a critical project.',
    items: [
      'ICT Training',
      'Cybersecurity Training',
      'Business Consultancy',
      'Project Management Consultancy',
      'Professional Development Programs',
    ],
  },
  {
    id: 'business-corporate',
    name: 'Business & Corporate Services',
    prefix: 'BIZ',
    sortOrder: 7,
    blurb: 'The operational backbone — HR, planning, and support, outsourced properly.',
    items: [
      'Business Development Services',
      'Human Resource Consulting',
      'Corporate Support Services',
      'Project Planning & Management',
      'Administrative Outsourcing',
    ],
  },
  {
    id: 'crypto-forex',
    name: 'Crypto & Forex Services',
    prefix: 'CRF',
    sortOrder: 8,
    blurb: 'Education and analysis for traders who want a real edge, not signals.',
    items: [
      'Cryptocurrency Education',
      'Forex Trading Education',
      'Market Analysis',
      'Risk Management Training',
      'Blockchain Consultancy',
    ],
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy Solutions',
    prefix: 'SOL',
    sortOrder: 9,
    blurb: 'Reliable power, designed and installed for Nigerian conditions.',
    items: [
      'Solar Panel Installation',
      'Solar Inverter Systems',
      'Renewable Energy Consulting',
      'Solar Maintenance Services',
      'Hybrid Power Solutions',
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Agro-Allied Services',
    prefix: 'AGR',
    sortOrder: 10,
    blurb: 'Farming and agro-supply consultancy grounded in real yields.',
    items: [
      'Crop Farming',
      'Poultry Farming',
      'Agro-Allied Products Supply',
      'Agricultural Consultancy',
    ],
  },
]

export type RequestType = 'complaint' | 'service_request' | 'chat_inquiry'
export type Urgency = 'low' | 'normal' | 'high' | 'urgent'
export type RequestStatus = 'new' | 'in_review' | 'in_progress' | 'completed'
export type RequestSource = 'web_form' | 'chat'

export type ConsultationRequest = {
  id: string
  reference_code: string
  full_name: string
  email: string
  phone: string | null
  company_name: string | null
  service_category_id: string
  request_type: RequestType
  subject: string
  details: string
  preferred_approach: string | null
  urgency: Urgency
  status: RequestStatus
  source: RequestSource
  assigned_to: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
}

// Categories that exist in the database (for FK integrity on chat-originated
// tickets) but are intentionally excluded from SERVICE_CATEGORIES above so
// they never appear on the public site or the Get Started form dropdown.
export const INTERNAL_CATEGORY_LABELS: Record<string, string> = {
  'general-inquiry': 'General Inquiry',
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'New',
  in_review: 'In review',
  in_progress: 'In progress',
  completed: 'Completed',
}

export const STATUS_ORDER: RequestStatus[] = ['new', 'in_review', 'in_progress', 'completed']
