export type Sector = 'ai' | 'business' | 'research' | 'innovation'

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  sector: Sector
  techStack: string[]
  status: 'completed' | 'in-progress' | 'research'
  date: string
  features: string[]
  github?: string
  demo?: string
  color: string
}

export const SECTOR_CONFIG: Record<Sector, { label: string; color: string; description: string }> = {
  ai:         { label: 'AI & MACHINE LEARNING', color: '#00e5ff', description: 'Intelligent systems & ML models' },
  business:   { label: 'BUSINESS SYSTEMS',      color: '#ce93d8', description: 'Enterprise & productivity tools' },
  research:   { label: 'RESEARCH & DATA',       color: '#80cbc4', description: 'Field research & data analysis' },
  innovation: { label: 'INNOVATION WING',       color: '#ffcc80', description: 'Platforms & creative solutions' },
}

export const projects: Project[] = [
  // ── AI & Machine Learning (North) ───────────────────────────────────────────
  {
    id: 'plant-disease-cucumber',
    title: 'Plant Disease AI',
    subtitle: 'Cucumber Family Recognition',
    description: 'ML model deployed as a Telegram Chatbot at Save the Children Cambodia to identify cucumber family plant diseases from photos and recommend treatment plans for farmers.',
    sector: 'ai',
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'Telegram Bot API', 'FastAPI'],
    status: 'completed',
    date: 'Feb 2024 – Mar 2025',
    features: ['Image-based disease detection', 'Telegram Bot interface', 'Treatment recommendations', 'Multi-disease classification'],
    color: '#00e5ff',
  },
  {
    id: 'plant-disease-cauliflower',
    title: 'Plant Disease AI v2',
    subtitle: 'Cauliflower Family Recognition',
    description: 'Upgraded ML model at Save the Children Cambodia targeting cauliflower family diseases, improving accuracy and expanding the disease library for Telegram Chatbot delivery.',
    sector: 'ai',
    techStack: ['Python', 'PyTorch', 'OpenCV', 'Telegram Bot API', 'Docker'],
    status: 'in-progress',
    date: 'Nov 2025 – Present',
    features: ['Extended disease library', 'Higher accuracy model', 'Farmer-friendly chatbot UX', 'Cure & prevention guides'],
    color: '#00e5ff',
  },
  {
    id: 'funding-matching-ml',
    title: 'Funding Match ML',
    subtitle: 'AI Funding Intelligence · Ailsa HQ',
    description: 'ML system at Ailsa HQ matching funding opportunities to companies using embedding vector search. Contributed to curation pipeline, dynamic web scraper, and the matching model.',
    sector: 'ai',
    techStack: ['Python', 'OpenAI Embeddings', 'Pinecone', 'Scrapy', 'PostgreSQL'],
    status: 'in-progress',
    date: 'May 2025 – Present',
    features: ['Vector similarity matching', 'Dynamic opportunity scraper', 'Company data ingestion', 'Curated match scoring'],
    color: '#00e5ff',
  },

  // ── Business Systems (East) ──────────────────────────────────────────────────
  {
    id: 'coffee-business-system',
    title: 'Coffee Biz Platform',
    subtitle: 'Full-Stack Business Suite · STC',
    description: 'End-to-end coffee business system built at Save the Children Cambodia: POS terminal, ERP dashboard, customer ordering website, and a Telegram Mini App for seamless ordering.',
    sector: 'business',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Telegram Mini App', 'Prisma'],
    status: 'completed',
    date: 'Nov 2025 – Present',
    features: ['POS terminal', 'ERP dashboard', 'Customer order website', 'Telegram Mini App ordering'],
    color: '#ce93d8',
  },
  {
    id: 'partnership-management',
    title: 'Partnership Manager',
    subtitle: 'Partnership Data System · STC',
    description: 'Partnership Management System built during internship at Save the Children Cambodia for managing partner data, tracking relationship status, and visualising connection networks.',
    sector: 'business',
    techStack: ['Django', 'React', 'PostgreSQL', 'REST API', 'Chart.js'],
    status: 'completed',
    date: 'Feb 2024 – Mar 2025',
    features: ['Partner registry', 'Relationship tracking', 'Network visualisation', 'Export reports'],
    color: '#ce93d8',
  },
  {
    id: 'positive-parenting-platform',
    title: 'Positive Parenting',
    subtitle: 'Remote Parenting Platform · STC',
    description: 'Remote Positive Parenting platform built at Save the Children Cambodia — a website and Telegram Chatbot to broadcast parenting guidance and child development resources to parents.',
    sector: 'business',
    techStack: ['Python', 'Telegram Bot API', 'React', 'FastAPI', 'MySQL'],
    status: 'completed',
    date: 'Feb 2024 – Mar 2025',
    features: ['Parenting broadcast system', 'Telegram Chatbot delivery', 'Content management web', 'Parent engagement tracking'],
    color: '#ce93d8',
  },

  // ── Research & Data (South) ───────────────────────────────────────────────────
  {
    id: 'cwea-data',
    title: 'CWEA Data Analysis',
    subtitle: 'Freelance Data Interpretation',
    description: 'Freelance data interpretation project for CWEA — processing field data, conducting statistical analysis, and producing insight reports to support programme decisions.',
    sector: 'research',
    techStack: ['Python', 'Pandas', 'Matplotlib', 'Excel', 'Jupyter'],
    status: 'completed',
    date: 'Mar 2025 – May 2025',
    features: ['Field data processing', 'Statistical analysis', 'Insight reporting', 'Data visualisation'],
    color: '#80cbc4',
  },
  {
    id: 'vikasa-data',
    title: 'Vikasa Data Collection',
    subtitle: 'Field Data · Vikasa Advisory',
    description: 'Short-term data collection engagement at Vikasa Advisory and Academy — gathering, validating, and organising structured datasets to support advisory research outputs.',
    sector: 'research',
    techStack: ['Google Forms', 'Excel', 'Python', 'Pandas', 'Google Sheets'],
    status: 'completed',
    date: 'Apr 2026 – May 2026',
    features: ['Structured data collection', 'Data validation', 'Dataset organisation', 'Research support'],
    color: '#80cbc4',
  },

  // ── Innovation (West) ─────────────────────────────────────────────────────────
  {
    id: 'ailsa-hq-platform',
    title: 'Ailsa HQ Platform',
    subtitle: 'Funding Intelligence · Next.js',
    description: 'Full-stack contributions at Ailsa HQ — UI design and API development in Next.js, plus a dynamic scraper harvesting funding opportunities and company data at scale.',
    sector: 'innovation',
    techStack: ['Next.js', 'TypeScript', 'Python', 'Scrapy', 'Tailwind CSS'],
    status: 'in-progress',
    date: 'May 2025 – Present',
    features: ['Next.js frontend & API', 'Dynamic web scraper', 'Funding opportunity feed', 'Company profile ingestion'],
    color: '#ffcc80',
  },
  {
    id: 'ccymcr-portfolio',
    title: 'CCYMCR Portfolio',
    subtitle: 'Web Consultancy · CCYMCR',
    description: 'Designed and built the official portfolio website for CCYMCR as a Web Development Consultant — showcasing the organisation\'s mission, projects, and team.',
    sector: 'innovation',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    status: 'completed',
    date: 'Mar 2026 – Mar 2026',
    features: ['Organisation showcase', 'Responsive design', 'Animated UI', 'Content management'],
    color: '#ffcc80',
  },
]

// Pod positions inside the gallery room — keyed by project id (radius ~20)
export const POD_POSITIONS: Record<string, [number, number, number]> = {
  'plant-disease-cucumber':    [-5,  1.5, -12],
  'plant-disease-cauliflower': [ 0,  2.2, -15],
  'funding-matching-ml':       [ 5,  1.5, -12],
  'coffee-business-system':    [12,  1.5,  -5],
  'partnership-management':    [15,  2.2,   0],
  'positive-parenting-platform':[12, 1.5,   5],
  'cwea-data':                 [ 4,  1.5,  13],
  'vikasa-data':               [-4,  1.5,  13],
  'ailsa-hq-platform':         [-12, 1.5,  -5],
  'ccymcr-portfolio':          [-12, 1.5,   5],
}
