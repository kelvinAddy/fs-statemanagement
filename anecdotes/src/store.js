import { create } from 'zustand'
import anecdotesService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const data = await anecdotesService.get()
      set(() => ({ anecdotes: data }))
    },

    addVote: async (id) => {
      const anecdoteToVote = get().anecdotes.find((anecdote) => anecdote.id === id)
      const updated = await anecdotesService.update(id, {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) => (anecdote.id === id ? updated : anecdote)),
      }))
    },

    addAnecdote: async (content) => {
      const data = await anecdotesService.create(content)
      set((state) => ({ anecdotes: [...state.anecdotes, data] }))
    },

    removeAnecdote: async (id) => {
      anecdotesService.remove(id)
      set((state) => ({ anecdotes: state.anecdotes.filter((anecdote) => anecdote.id !== id) }))
    },

    setFilter: (value) => set(() => ({ filter: value })),
  },
}))

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setMessage: (value) => set({ message: value }),
    removeMessage: () => setTimeout(() => set({ message: null }), 5000),
  },
}))

export const useMessage = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  )
}
export const useAnecdotesActions = () => useAnecdoteStore((state) => state.actions)
