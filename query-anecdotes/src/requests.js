import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useNotication } from './hooks/useNotification'

const baseUrl = 'http://localhost:3001/anecdotes'

const get = async () => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('failed to get anecdotes')
  }

  return res.json()
}

const create = async (anecdote) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

  if (!res.ok) {
    throw new Error('failed to create anecdotes')
  }

  return res.json()
}

const update = async (anecdote) => {
  const res = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

  if (!res.ok) {
    throw new Error('failed to update vote')
  }

  return res.json()
}

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { updateNotification } = useNotication()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: get,
    refetchOnWindowFocus: true,
    retry: 1,
  })

  const createAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (createdAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(createdAnecdote))
      updateNotification(`a new anecdote: ${createdAnecdote.content} was created`)
    },
    onError: () => {
      updateNotification('too short anecdote, must have length 5 or more')
    },
  })

  const updateVoteMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnectode) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((x) => (x.id === updatedAnectode.id ? updatedAnectode : x)),
      )
      updateNotification(`${updatedAnectode.content} voted`)
    },
    onError: (error) => {
      updateNotification(error.message)
    },
  })

  return {
    result: result,
    createAnecdote: (content) => createAnecdoteMutation.mutate({ content, vote: 0 }),
    addVote: (anecdote) => updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
