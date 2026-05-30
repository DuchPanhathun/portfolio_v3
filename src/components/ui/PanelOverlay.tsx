import { useEffect } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import type { PanelId } from '../../stores/useGameStore'
import { AboutContent }    from '../sections/AboutContent'
import { ProjectsContent } from '../sections/ProjectsContent'
import { SkillsContent }   from '../sections/SkillsContent'
import { ContactContent }  from '../sections/ContactContent'

const PANEL_CONFIG: Record<NonNullable<PanelId>, {
  title: string; icon: string; color: string; component: React.FC
}> = {
  about:    { title: 'ABOUT ME',   icon: '👤', color: '#4fc3f7', component: AboutContent    },
  projects: { title: 'PROJECTS',   icon: '🚀', color: '#ce93d8', component: ProjectsContent },
  skills:   { title: 'SKILLS',     icon: '⚡', color: '#ffcc80', component: SkillsContent   },
  contact:  { title: 'CONTACT',    icon: '📡', color: '#80cbc4', component: ContactContent  },
}

export function PanelOverlay() {
  const { activePanelId, setActivePanel } = useGameStore()

  useEffect(() => {
    if (!activePanelId) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activePanelId, setActivePanel])

  if (!activePanelId) return null
  const cfg = PANEL_CONFIG[activePanelId]
  const Content = cfg.component

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{
        width: '520px',
        maxHeight: '80vh',
        background: 'rgba(7,16,32,0.95)',
        border: `1px solid ${cfg.color}40`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: `0 0 40px ${cfg.color}30, 0 0 80px ${cfg.color}15`,
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${cfg.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${cfg.color}10, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{cfg.icon}</span>
            <span style={{ color: cfg.color, fontSize: '14px', fontWeight: 'bold', letterSpacing: '3px' }}>
              {cfg.title}
            </span>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            style={{
              background: 'none', border: `1px solid ${cfg.color}40`,
              color: cfg.color, cursor: 'pointer',
              width: '28px', height: '28px', borderRadius: '4px',
              fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scanning line */}
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
          animation: 'scanline 2s linear infinite',
          opacity: 0.5,
        }} />

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
          <Content />
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 24px',
          borderTop: `1px solid ${cfg.color}20`,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <span style={{ color: `${cfg.color}60`, fontSize: '10px', letterSpacing: '1px' }}>
            ESC TO CLOSE
          </span>
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
