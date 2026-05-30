import { create } from 'zustand'

export type PanelId = 'about' | 'projects' | 'contact' | 'skills' | null

interface GameStore {
  // Main station panels
  activePanelId: PanelId
  nearbyPanelId: PanelId
  setActivePanel: (id: PanelId) => void
  setNearbyPanel: (id: PanelId) => void
  // Gallery
  galleryMode: boolean
  enterGallery: () => void
  exitGallery: () => void
  // Portal proximity (set by CharacterController)
  nearPortal: boolean
  setNearPortal: (v: boolean) => void
  // Projects in gallery
  activeProjectId: string | null
  nearbyProjectId: string | null
  setActiveProject: (id: string | null) => void
  setNearbyProject: (id: string | null) => void
  // Scene transition
  isTransitioning: boolean
  setTransitioning: (v: boolean) => void
}

export const useGameStore = create<GameStore>((set) => ({
  activePanelId: null,
  nearbyPanelId: null,
  setActivePanel: (id) => set({ activePanelId: id }),
  setNearbyPanel: (id) => set({ nearbyPanelId: id }),
  galleryMode: false,
  enterGallery: () => set({ galleryMode: true }),
  exitGallery:  () => set({ galleryMode: false }),
  nearPortal: false,
  setNearPortal: (v) => set({ nearPortal: v }),
  activeProjectId: null,
  nearbyProjectId: null,
  setActiveProject: (id) => set({ activeProjectId: id }),
  setNearbyProject: (id) => set({ nearbyProjectId: id }),
  isTransitioning: false,
  setTransitioning: (v) => set({ isTransitioning: v }),
}))
