import { ChevronRight } from 'lucide-react'

const EXPERIENCES = [
  {
    period: 'Nov 2025 – Present',
    current: true,
    role: 'IT Consultant',
    company: 'Save the Children Cambodia',
    tag: 'Full-time',
    tagColor: '#00e5ff',
    highlights: [
      'Built ML model for Plant Disease Recognition (cauliflower family) deployed as a Telegram Chatbot that identifies disease and recommends treatment',
      'Built an end-to-end Coffee Business System: POS + ERP dashboard, customer order website, and Telegram Mini App',
    ],
  },
  {
    period: 'May 2025 – Present',
    current: true,
    role: 'Python Engineer',
    company: 'Ailsa HQ Limited',
    tag: 'Full-time',
    tagColor: '#00e5ff',
    highlights: [
      'Funding opportunity curation engine using embedding vector search to match opportunities to companies',
      'Dynamic scrapper for funding opportunities and company data pipelines',
      'ML model for matching funding opportunities to target companies',
      'Frontend & backend contributions (Next.js): UI design and REST API development',
    ],
  },
  {
    period: 'Apr 28 – May 8, 2026',
    current: false,
    role: 'Data Collector',
    company: 'Vikasa Advisory and Academy',
    tag: 'Contract',
    tagColor: '#ffb74d',
    highlights: [],
  },
  {
    period: 'Mar 16 – Mar 30, 2026',
    current: false,
    role: 'Web Development Consultant',
    company: 'CCYMCR',
    tag: 'Freelance',
    tagColor: '#80cbc4',
    highlights: [
      'Designed and built portfolio website for CCYMCR',
    ],
  },
  {
    period: 'Mar 28 – May 1, 2025',
    current: false,
    role: 'Data Interpretation Freelancer',
    company: 'CWEA Project',
    tag: 'Freelance',
    tagColor: '#80cbc4',
    highlights: [],
  },
  {
    period: 'Feb 2024 – Mar 2025',
    current: false,
    role: 'IT Intern',
    company: 'Save the Children Cambodia',
    tag: 'Internship',
    tagColor: '#ce93d8',
    highlights: [
      'Built Remote Positive Parenting platform — Website + Telegram Chatbot to broadcast content to parents',
      'ML model for Plant Disease Recognition (cucumber family) in Telegram Chatbot with cure recommendations',
      'Partnership Management System for tracking partnership data and organisational connections',
    ],
  },
  {
    period: 'Sep 12 – Oct 2, 2023',
    current: false,
    role: 'Data Collector (Freelance)',
    company: 'Confluences Asie Co., Ltd',
    tag: 'Freelance',
    tagColor: '#80cbc4',
    highlights: [],
  },
]

const ACCENT = '#ce93d8'

export function ProjectsContent() {
  return (
    <div style={{ position: 'relative', paddingLeft: '20px' }}>
      {/* Vertical timeline rail */}
      <div style={{
        position: 'absolute',
        left: '6px',
        top: '8px',
        bottom: '8px',
        width: '2px',
        background: `linear-gradient(to bottom, #00e5ff, ${ACCENT}, #3a2050)`,
        borderRadius: '1px',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {EXPERIENCES.map((exp, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '-17px',
              top: '10px',
              width: exp.current ? '12px' : '10px',
              height: exp.current ? '12px' : '10px',
              borderRadius: '50%',
              background: exp.current ? '#00e5ff' : exp.tagColor,
              boxShadow: exp.current ? '0 0 8px #00e5ff' : 'none',
              border: '2px solid rgba(0,0,0,0.5)',
              flexShrink: 0,
            }} />

            {/* Card */}
            <div style={{
              background: exp.current
                ? 'rgba(0,229,255,0.05)'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${exp.current ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderLeft: `3px solid ${exp.current ? '#00e5ff' : exp.tagColor}`,
              borderRadius: '6px',
              padding: '12px 14px',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: exp.current ? '#00e5ff' : '#c8d8f0', fontSize: '13px', fontWeight: 'bold' }}>
                    {exp.role}
                  </div>
                  <div style={{ color: '#8aa8cc', fontSize: '11px', marginTop: '2px' }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '9px',
                    letterSpacing: '1px',
                    color: exp.tagColor,
                    background: `${exp.tagColor}18`,
                    border: `1px solid ${exp.tagColor}40`,
                    borderRadius: '3px',
                    padding: '2px 6px',
                  }}>
                    {exp.tag.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '10px', color: '#5a7a9a', letterSpacing: '0.3px' }}>
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              {exp.highlights.length > 0 && (
                <ul style={{
                  margin: '10px 0 0 0',
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}>
                  {exp.highlights.map((h, j) => (
                    <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#9ab8d8', lineHeight: 1.5 }}>
                      <ChevronRight size={11} color={exp.current ? '#00e5ff' : exp.tagColor} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
