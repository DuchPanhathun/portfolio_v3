export function ContactContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ color: '#80cbc4', fontSize: '12px', lineHeight: 1.6, marginBottom: '4px' }}>
        Ready to collaborate? Transmit a signal across the cosmos.
      </p>
      {[
        { label: '📧 Email',    value: 'hello@portfolio.dev',       href: 'mailto:hello@portfolio.dev' },
        { label: '🐙 GitHub',   value: 'github.com/yourhandle',     href: '#' },
        { label: '💼 LinkedIn', value: 'linkedin.com/in/yourname',  href: '#' },
        { label: '🐦 Twitter',  value: '@yourhandle',               href: '#' },
      ].map(({ label, value, href }) => (
        <a
          key={label}
          href={href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(128,203,196,0.08)',
            border: '1px solid rgba(128,203,196,0.2)',
            borderRadius: '6px',
            padding: '10px 14px',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,203,196,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(128,203,196,0.2)')}
        >
          <span style={{ color: '#80cbc4', fontSize: '12px', minWidth: '80px' }}>{label}</span>
          <span style={{ color: '#e0f2f1', fontSize: '12px' }}>{value}</span>
        </a>
      ))}
    </div>
  )
}
