import { useGameStore } from '../../stores/useGameStore'
import { projects } from '../../data/projects'

export function HUD() {
  const { nearbyPanelId, activePanelId, activeProjectId, galleryMode, nearbyProjectId } = useGameStore()

  if (activePanelId || activeProjectId) return null

  const nearbyProject = nearbyProjectId ? projects.find(p => p.id === nearbyProjectId) : null

  return (
    <>
      {/* Controls bar */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px', letterSpacing: '1px',
        pointerEvents: 'none',
      }}>
        {['W', 'A', 'S', 'D'].map(k => (
          <kbd key={k} style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px', padding: '3px 7px', fontSize: '11px',
          }}>{k}</kbd>
        ))}
        <span style={{ margin: '0 4px' }}>MOVE</span>
        <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
        <kbd style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px', padding: '3px 10px', fontSize: '11px',
        }}>SPACE</kbd>
        <span style={{ margin: '0 4px' }}>JUMP</span>
        <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
        <span>DRAG MOUSE</span>
        <span style={{ margin: '0 4px', opacity: 0.5 }}>ROTATE CAM</span>

        {/* Panel interact hint (station) */}
        {nearbyPanelId && !galleryMode && (
          <>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
            <kbd style={{
              background: 'rgba(0,229,255,0.15)',
              border: '1px solid rgba(0,229,255,0.4)',
              borderRadius: '4px', padding: '3px 10px', fontSize: '11px',
              color: '#00e5ff', animation: 'pulse 1s infinite',
            }}>E</kbd>
            <span style={{ color: '#00e5ff', opacity: 0.8 }}>INTERACT</span>
          </>
        )}

        {/* Pod interact hint (gallery) */}
        {nearbyProjectId && galleryMode && (
          <>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
            <kbd style={{
              background: `rgba(${nearbyProject ? hexToRgb(nearbyProject.color) : '0,229,255'}, 0.15)`,
              border: `1px solid rgba(${nearbyProject ? hexToRgb(nearbyProject.color) : '0,229,255'}, 0.4)`,
              borderRadius: '4px', padding: '3px 10px', fontSize: '11px',
              color: nearbyProject?.color ?? '#00e5ff', animation: 'pulse 1s infinite',
            }}>E</kbd>
            <span style={{ color: nearbyProject?.color ?? '#00e5ff', opacity: 0.8 }}>
              EXPLORE {nearbyProject?.title.toUpperCase()}
            </span>
          </>
        )}

        {/* ESC exit hint in gallery */}
        {galleryMode && (
          <>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
            <kbd style={{
              background: 'rgba(255,100,100,0.1)',
              border: '1px solid rgba(255,100,100,0.3)',
              borderRadius: '4px', padding: '3px 8px', fontSize: '11px',
              color: '#ff8888',
            }}>ESC</kbd>
            <span style={{ color: '#ff8888', opacity: 0.7 }}>EXIT GALLERY</span>
          </>
        )}
      </div>

      {/* Top-right mini map */}
      <div style={{
        position: 'fixed', top: '24px', right: '24px',
        fontFamily: "'Courier New', monospace",
        color: 'rgba(255,255,255,0.35)',
        fontSize: '10px', letterSpacing: '1px', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        {!galleryMode ? (
          <>
            <div style={{ marginBottom: '4px', color: 'rgba(0,229,255,0.5)' }}>SPACE STATION</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '9px' }}>
              {[
                { dir: '↑ N', label: 'ABOUT'   },
                { dir: '→ E', label: 'GALLERY' },
                { dir: '↓ S', label: 'CONTACT' },
                { dir: '← W', label: 'SKILLS'  },
              ].map(({ dir, label }) => (
                <div key={label} style={{
                  background: label === 'GALLERY' ? 'rgba(0,229,255,0.1)' : 'rgba(0,229,255,0.05)',
                  border: `1px solid rgba(0,229,255,${label === 'GALLERY' ? '0.25' : '0.1'})`,
                  borderRadius: '3px', padding: '3px 6px',
                  display: 'flex', gap: '4px',
                  color: label === 'GALLERY' ? '#00e5ff' : undefined,
                }}>
                  <span style={{ color: 'rgba(0,229,255,0.4)' }}>{dir}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '6px', color: 'rgba(0,229,255,0.6)', letterSpacing: '2px' }}>EXPERIENCE CENTER</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px' }}>
              {[
                { color: '#00e5ff', label: 'AI & ML',    dir: '↑ N' },
                { color: '#ce93d8', label: 'BUSINESS',   dir: '→ E' },
                { color: '#80cbc4', label: 'RESEARCH',   dir: '↓ S' },
                { color: '#ffcc80', label: 'INNOVATION', dir: '← W' },
              ].map(({ color, label, dir }) => (
                <div key={label} style={{
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  borderRadius: '3px', padding: '2px 8px',
                  display: 'flex', gap: '6px', alignItems: 'center',
                }}>
                  <span style={{ color: `${color}80` }}>{dir}</span>
                  <span style={{ color: `${color}cc` }}>{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
