import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'

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
    },
  })

  return {
    result: result,
    createAnecdote: (content) => createAnecdoteMutation.mutate({ content, vote: 0 }),
    addVote: (anecdote) => updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
