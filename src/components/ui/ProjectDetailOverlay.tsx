import { useEffect } from 'react'
import { Circle, Diamond, GitBranch, ExternalLink, X } from 'lucide-react'
import { useGameStore } from '../../stores/useGameStore'
import { projects, SECTOR_CONFIG } from '../../data/projects'

export function ProjectDetailOverlay() {
  const { activeProjectId, setActiveProject } = useGameStore()
  const project = projects.find(p => p.id === activeProjectId)

  useEffect(() => {
    if (!activeProjectId) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveProject(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeProjectId, setActiveProject])

  if (!project) return null

  const sectorCfg = SECTOR_CONFIG[project.sector]
  const color     = project.color

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{
        width: '680px',
        maxHeight: '85vh',
        background: 'rgba(4, 12, 28, 0.97)',
        border: `1px solid ${color}50`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: `0 0 60px ${color}25, 0 0 120px ${color}10, inset 0 0 40px rgba(0,0,0,0.5)`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ── Header ── */}
        <div style={{
          padding: '20px 28px 16px',
          borderBottom: `1px solid ${color}30`,
          background: `linear-gradient(135deg, ${color}12 0%, transparent 60%)`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '9px',
                  color: sectorCfg.color,
                  letterSpacing: '3px',
                  padding: '2px 8px',
                  border: `1px solid ${sectorCfg.color}50`,
                  borderRadius: '3px',
                  textShadow: `0 0 8px ${sectorCfg.color}`,
                }}>
                  {sectorCfg.label}
                </span>
                <span style={{
                  fontSize: '9px',
                  color: project.status === 'completed' ? '#00ff88' : '#ffcc00',
                  letterSpacing: '2px',
                }}>
                  <Circle size={7} fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {project.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>
                  {project.date}
                </span>
              </div>
              <h2 style={{ margin: 0, color: '#e8f4ff', fontSize: '22px', letterSpacing: '2px', fontWeight: 'bold' }}>
                {project.title}
              </h2>
              <p style={{ margin: '4px 0 0', color: `${color}90`, fontSize: '12px', letterSpacing: '1px' }}>
                {project.subtitle}
              </p>
            </div>
            <button
              onClick={() => setActiveProject(null)}
              style={{
                background: 'none',
                border: `1px solid ${color}40`,
                color: color,
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scanning line */}
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: 'scanline 2.5s linear infinite',
          opacity: 0.6,
          flexShrink: 0,
        }} />

        {/* ── Body ── */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {/* Description */}
          <section style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', color: color, letterSpacing: '3px', marginBottom: '8px', opacity: 0.8 }}>
              ── OVERVIEW
            </div>
            <p style={{ margin: 0, color: 'rgba(200,220,255,0.85)', fontSize: '13px', lineHeight: 1.7 }}>
              {project.description}
            </p>
          </section>

          {/* Tech stack */}
          <section style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', color: color, letterSpacing: '3px', marginBottom: '10px', opacity: 0.8 }}>
              ── TECH STACK
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.techStack.map(tech => (
                <span key={tech} style={{
                  fontSize: '11px',
                  color: '#b8d4ee',
                  padding: '4px 12px',
                  background: `${color}12`,
                  border: `1px solid ${color}35`,
                  borderRadius: '4px',
                  letterSpacing: '1px',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Features */}
          <section style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', color: color, letterSpacing: '3px', marginBottom: '10px', opacity: 0.8 }}>
              ── KEY FEATURES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {project.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Diamond size={9} color={color} style={{ flexShrink: 0 }} fill={color} />
                  <span style={{ color: 'rgba(180,210,240,0.8)', fontSize: '12px' }}>{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Links */}
          {(project.github || project.demo) && (
            <section>
              <div style={{ fontSize: '9px', color: color, letterSpacing: '3px', marginBottom: '10px', opacity: 0.8 }}>
                ── LINKS
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: color,
                      textDecoration: 'none',
                      fontSize: '12px',
                      padding: '6px 16px',
                      border: `1px solid ${color}50`,
                      borderRadius: '6px',
                      letterSpacing: '1px',
                    }}
                  >
                    <GitBranch size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    GITHUB
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#00ff88',
                      textDecoration: 'none',
                      fontSize: '12px',
                      padding: '6px 16px',
                      border: '1px solid #00ff8850',
                      borderRadius: '6px',
                      letterSpacing: '1px',
                    }}
                  >
                    <ExternalLink size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    LIVE DEMO
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '10px 28px',
          borderTop: `1px solid ${color}20`,
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          <span style={{ color: `${color}50`, fontSize: '10px', letterSpacing: '2px' }}>ESC TO CLOSE</span>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  )
}
