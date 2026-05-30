export function AboutContent() {
  return (
    <div>
      <p style={{ color: '#4fc3f7', marginBottom: '12px', lineHeight: 1.7 }}>
        Hi, I'm a <strong style={{ color: '#fff' }}>Full-Stack Developer</strong> passionate about
        building immersive digital experiences. I love crafting elegant solutions to complex problems.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {[
          { label: 'Location', value: '🌍 Earth' },
          { label: 'Role', value: '💻 Developer' },
          { label: 'Focus', value: '🎨 UI/UX + 3D' },
          { label: 'Status', value: '🟢 Available' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(79,195,247,0.08)',
            border: '1px solid rgba(79,195,247,0.2)',
            borderRadius: '6px',
            padding: '8px 12px',
          }}>
            <div style={{ fontSize: '10px', color: '#4fc3f7', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '13px', color: '#fff', marginTop: '2px' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
