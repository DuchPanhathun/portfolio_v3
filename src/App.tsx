import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { SpaceStation }         from './components/world/SpaceStation'
import { SpaceEnvironment }     from './components/world/Environment'
import { HolographicPanel }     from './components/world/HolographicPanel'
import { ExperiencePortal }     from './components/world/ExperiencePortal'
import { GalleryScene }         from './components/world/GalleryScene'
import { CharacterController }  from './components/character/CharacterController'
import { PanelOverlay }         from './components/ui/PanelOverlay'
import { ProjectDetailOverlay } from './components/ui/ProjectDetailOverlay'
import { HUD }                  from './components/ui/HUD'
import { useGameStore }         from './stores/useGameStore'

// About, Contact, Skills only — Projects replaced by the Experience Gallery portal
const PANELS: { id: 'about' | 'contact' | 'skills'; position: [number, number, number]; rotation: [number, number, number] }[] = [
  { id: 'about',   position: [0, 1.2,  -11.5], rotation: [0, 0, 0] },
  { id: 'contact', position: [0, 1.2,   11.5], rotation: [0, Math.PI, 0] },
  { id: 'skills',  position: [-11.5, 1.2, 0],  rotation: [0, Math.PI / 2, 0] },
]

function SceneContent() {
  const galleryMode = useGameStore(s => s.galleryMode)

  return (
    <>
      {/* SpaceEnvironment only for main station; gallery provides its own lighting + stars */}
      {!galleryMode && <SpaceEnvironment />}
      {!galleryMode && (
        <>
          <SpaceStation />
          {PANELS.map((p) => (
            <HolographicPanel key={p.id} id={p.id} position={p.position} rotation={p.rotation} />
          ))}
          <ExperiencePortal />
        </>
      )}
      {galleryMode && <GalleryScene />}
      <CharacterController />
    </>
  )
}

function TransitionOverlay() {
  const isTransitioning = useGameStore(s => s.isTransitioning)
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 300,
      pointerEvents: 'none',
      opacity: isTransitioning ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }} />
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020b18', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 4, 12], fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.8 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      <PanelOverlay />
      <ProjectDetailOverlay />
      <HUD />
      <TransitionOverlay />
    </div>
  )
}
