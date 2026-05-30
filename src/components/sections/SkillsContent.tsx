const SKILLS = [
  { name: 'React / Next.js', level: 90 },
  { name: 'TypeScript',      level: 85 },
  { name: 'Three.js / R3F',  level: 75 },
  { name: 'Node.js',         level: 80 },
  { name: 'Python',          level: 70 },
  { name: 'PostgreSQL',      level: 75 },
]

export function SkillsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {SKILLS.map(({ name, level }) => (
        <div key={name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#ffcc80', fontSize: '12px' }}>{name}</span>
            <span style={{ color: '#ffb74d', fontSize: '11px' }}>{level}%</span>
          </div>
          <div style={{ background: 'rgba(255,204,128,0.1)', borderRadius: '2px', height: '4px' }}>
            <div style={{
              width: `${level}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ffb74d, #ffcc80)',
              borderRadius: '2px',
              boxShadow: '0 0 6px #ffb74d',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
