import { MapPin, Code2, Briefcase, Cpu } from 'lucide-react'

const STATS = [
  { icon: MapPin,     label: 'Location',  value: 'Phnom Penh, Cambodia' },
  { icon: Code2,      label: 'Role',      value: 'Python & Full-Stack Engineer' },
  { icon: Briefcase,  label: 'Current',   value: 'Ailsa HQ · Save the Children' },
  { icon: Cpu,        label: 'Focus',     value: 'AI / ML + Web Systems' },
]

export function AboutContent() {
  return (
    <div>
      <p style={{ color: '#e0f4ff', fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '1px' }}>
        Duch Panhathun
      </p>
      <p style={{ color: '#4fc3f7', marginBottom: '16px', lineHeight: 1.75, fontSize: '12px' }}>
        Software engineer based in Cambodia with hands-on experience building{' '}
        <strong style={{ color: '#fff' }}>AI/ML systems</strong>,{' '}
        <strong style={{ color: '#fff' }}>full-stack web platforms</strong>, and{' '}
        <strong style={{ color: '#fff' }}>Telegram-based tools</strong> for real-world impact.
        Currently contributing as a Python Engineer at{' '}
        <strong style={{ color: '#00e5ff' }}>Ailsa HQ Limited</strong> and IT Consultant at{' '}
        <strong style={{ color: '#00e5ff' }}>Save the Children Cambodia</strong> — building
        ML models, intelligent scrapers, and end-to-end business systems that reach communities
        across Southeast Asia.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} style={{
            background: 'rgba(79,195,247,0.07)',
            border: '1px solid rgba(79,195,247,0.18)',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon size={11} color="#4fc3f7" />
              <span style={{ fontSize: '9px', color: '#4fc3f7', letterSpacing: '1px' }}>{label.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#e0f4ff' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
