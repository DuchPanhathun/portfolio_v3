import { Mail, GitBranch, Briefcase } from 'lucide-react'

const LINKS = [
  { icon: Mail,      label: 'Email',    value: 'duchpanhathun@gmail.com',      href: 'mailto:duchpanhathun@gmail.com' },
  { icon: GitBranch, label: 'GitHub',   value: 'DuchPanhathun',    href: 'https://github.com/DuchPanhathun' },
  { icon: Briefcase, label: 'LinkedIn', value: 'Duch Panhathun', href: 'https://www.linkedin.com/in/duch-panhathun-406336235/' },
]

export function ContactContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ color: '#80cbc4', fontSize: '12px', lineHeight: 1.6, marginBottom: '4px' }}>
        Ready to collaborate? Transmit a signal across the cosmos.
      </p>
      {LINKS.map(({ icon: Icon, label, value, href }) => (
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
          <Icon size={14} color="#80cbc4" style={{ flexShrink: 0 }} />
          <span style={{ color: '#80cbc4', fontSize: '12px', minWidth: '72px' }}>{label}</span>
          <span style={{ color: '#e0f2f1', fontSize: '12px' }}>{value}</span>
        </a>
      ))}
    </div>
  )
}
