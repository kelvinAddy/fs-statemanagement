const baseUrl = 'http://localhost:3001/anecdotes'

const get = async () => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('Failed to get anecdotes')
  }

  return await res.json()
}

const create = async (content) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!res.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await res.json()
}

const update = async (id, anecdote) => {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/jsons' },
    body: JSON.stringify(anecdote),
  })

  if (!res.ok) {
    throw new Error('Failed to update vote')
  }

  return await res.json()
}

const remove = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })

  if (!res.ok) {
    throw new Error('Failed to delete anecdote')
  }
}

export default { get, create, update, remove }
