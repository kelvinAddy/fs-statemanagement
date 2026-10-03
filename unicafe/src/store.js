import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useStatisticsStore = create((set) => ({
  good: 0,
  bad: 0,
  neutral: 0,
  actions: {
    handleGood: () => set((state) => ({ good: state.good + 1 })),
    handlebad: () => set((state) => ({ bad: state.bad + 1 })),
    handleNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
  },
}))

export const useValues = () =>
  useStatisticsStore(
    useShallow((state) => ({ good: state.good, bad: state.bad, neutral: state.neutral })),
  )

export const useStatisticsControls = () => useStatisticsStore((state) => state.actions)
