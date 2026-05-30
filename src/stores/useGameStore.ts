import { create } from 'zustand'

export type PanelId = 'about' | 'projects' | 'contact' | 'skills' | null

interface GameStore {
  activePanelId: PanelId
  nearbyPanelId: PanelId
  setActivePanel: (id: PanelId) => void
  setNearbyPanel: (id: PanelId) => void
}

export const useGameStore = create<GameStore>((set) => ({
  activePanelId: null,
  nearbyPanelId: null,
  setActivePanel: (id) => set({ activePanelId: id }),
  setNearbyPanel: (id) => set({ nearbyPanelId: id }),
}))
