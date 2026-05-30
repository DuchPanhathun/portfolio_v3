const SKILL_GROUPS = [
  {
    category: 'Languages',
    color: '#ffcc80',
    skills: [
      { name: 'Python',                  level: 90 },
      { name: 'JavaScript / TypeScript', level: 80 },
      { name: 'SQL',                     level: 75 },
    ],
  },
  {
    category: 'AI & Machine Learning',
    color: '#00e5ff',
    skills: [
      { name: 'TensorFlow / PyTorch',    level: 82 },
      { name: 'Computer Vision (OpenCV)', level: 78 },
      { name: 'LLM / Vector Search',     level: 72 },
      { name: 'NLP / Transformers',      level: 70 },
    ],
  },
  {
    category: 'Web & Frameworks',
    color: '#ce93d8',
    skills: [
      { name: 'FastAPI / Django',        level: 85 },
      { name: 'React / Next.js',         level: 80 },
      { name: 'Node.js',                 level: 75 },
    ],
  },
  {
    category: 'Tools & Platforms',
    color: '#80cbc4',
    skills: [
      { name: 'Telegram Bot / Mini App', level: 88 },
      { name: 'PostgreSQL / MySQL',      level: 75 },
      { name: 'Docker / Git',            level: 68 },
    ],
  },
]

export function SkillsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {SKILL_GROUPS.map(({ category, color, skills }) => (
        <div key={category}>
          <div style={{
            fontSize: '9px',
            color: color,
            letterSpacing: '3px',
            marginBottom: '10px',
            opacity: 0.9,
          }}>
            ── {category.toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {skills.map(({ name, level }) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#d0e8ff', fontSize: '12px' }}>{name}</span>
                  <span style={{ color: color, fontSize: '10px', opacity: 0.8 }}>{level}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '2px', height: '3px' }}>
                  <div style={{
                    width: `${level}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                    borderRadius: '2px',
                    boxShadow: `0 0 6px ${color}80`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
