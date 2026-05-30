import { useGameStore } from '../../stores/useGameStore'

export function HUD() {
  const { nearbyPanelId, activePanelId } = useGameStore()

  if (activePanelId) return null

  return (
    <>
      {/* Controls */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px', letterSpacing: '1px',
        pointerEvents: 'none',
      }}>
        {[
          { key: 'W', label: '' }, { key: 'A', label: '' }, { key: 'S', label: '' }, { key: 'D', label: '' },
        ].map(({ key }) => (
          <kbd key={key} style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px', padding: '3px 7px', fontSize: '11px',
          }}>{key}</kbd>
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
        {nearbyPanelId && (
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
      </div>

      {/* Mini-map compass */}
      <div style={{
        position: 'fixed', top: '24px', right: '24px',
        fontFamily: "'Courier New', monospace",
        color: 'rgba(255,255,255,0.35)',
        fontSize: '10px', letterSpacing: '1px', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ marginBottom: '4px', color: 'rgba(0,229,255,0.5)' }}>SPACE STATION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '9px' }}>
          {[
            { dir: '↑ N', label: 'ABOUT'    },
            { dir: '→ E', label: 'PROJECTS' },
            { dir: '↓ S', label: 'CONTACT'  },
            { dir: '← W', label: 'SKILLS'   },
          ].map(({ dir, label }) => (
            <div key={label} style={{
              background: 'rgba(0,229,255,0.05)',
              border: '1px solid rgba(0,229,255,0.1)',
              borderRadius: '3px', padding: '3px 6px',
              display: 'flex', gap: '4px',
            }}>
              <span style={{ color: 'rgba(0,229,255,0.4)' }}>{dir}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}
