import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotesActions, useAnecdotes } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('anecdotes', () => {
  it('initializes state with data from backend', async () => {
    const mockAnecdotes = [{ id: 1, content: 'test', vote: 0 }]
    anecdoteService.get.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdotesActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesArray } = renderHook(() => useAnecdotes())

    expect(anecdotesArray.current).toEqual(mockAnecdotes)
  })

  it('receives anecdotes sorted by votes', async () => {
    const unsortedAnecdotes = [
      {
        content: 'The Xerus is a must ',
        votes: 14,
        id: 'x0SrWQrCsAM',
      },
      {
        content: 'The return of Zodd',
        votes: 3,
        id: 'MNmHjMn2fG8',
      },
      {
        content: 'Death note is the greatest',
        votes: 3,
        id: 'YGMI7_5Ps84',
      },
    ]

    const sortedAnecdotes = unsortedAnecdotes.sort((a, b) => b.votes - a.votes)

    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes })

    const { result: resultAnecdotes } = renderHook(() => useAnecdotes())

    expect(resultAnecdotes.current).toEqual(sortedAnecdotes)
  })

  describe('updating of anecdotes', () => {
    const testAnecdotes = [
      {
        content: 'The Xerus is a must ',
        votes: 14,
        id: 'x0SrWQrCsAM',
      },
      {
        content: 'The return of Zodd',
        votes: 3,
        id: 'MNmHjMn2fG8',
      },
      {
        content: 'Death note is the greatest',
        votes: 3,
        id: 'YGMI7_5Ps84',
      },
    ]
    beforeEach(() => {
      useAnecdoteStore.setState({ anecdotes: testAnecdotes })
    })

    it('returns the ancedotes that match the filter', () => {
      const filter = 'Xerus'
      const filteredAnecdotes = testAnecdotes.filter((a) =>
        a.content.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
      )

      useAnecdoteStore.setState({ filter: filter })

      const { result } = renderHook(() => useAnecdotes())

      expect(result.current).toEqual(filteredAnecdotes)
    })

    it('increases the number of votes', async () => {
      const anecdote = useAnecdoteStore.getState().anecdotes[0]
      const mockedResult = { ...anecdote, votes: anecdote.votes + 1 }

      anecdoteService.update.mockResolvedValue(mockedResult)

      const { result } = renderHook(() => useAnecdotesActions())

      await act(async () => {
        await result.current.addVote(anecdote.id)
      })

      const { result: updatedAnecdotes } = renderHook(() => useAnecdotes())

      const votedAnecdote = updatedAnecdotes.current.find(({ id }) => id === anecdote.id)

      expect(votedAnecdote).toEqual(mockedResult)
    })
  })
})
