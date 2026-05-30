const PROJECTS = [
  { name: 'Project Alpha', tech: 'React · Three.js · WebGL', desc: 'Interactive 3D visualization dashboard.', link: '#' },
  { name: 'Project Beta',  tech: 'Node.js · PostgreSQL · Redis', desc: 'High-performance real-time API.', link: '#' },
  { name: 'Project Gamma', tech: 'Python · ML · FastAPI', desc: 'AI-powered recommendation engine.', link: '#' },
]

export function ProjectsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {PROJECTS.map((p) => (
        <div key={p.name} style={{
          background: 'rgba(206,147,216,0.08)',
          border: '1px solid rgba(206,147,216,0.25)',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(206,147,216,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(206,147,216,0.25)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ce93d8', fontWeight: 'bold', fontSize: '13px' }}>{p.name}</span>
            <a href={p.link} style={{ color: '#ce93d8', fontSize: '11px', textDecoration: 'none' }}>→ View</a>
          </div>
          <div style={{ color: '#9c64a6', fontSize: '10px', margin: '4px 0', letterSpacing: '0.5px' }}>{p.tech}</div>
          <div style={{ color: '#ccc', fontSize: '11px' }}>{p.desc}</div>
        </div>
      ))}
    </div>
  )
}
