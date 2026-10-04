import { useAnecdotes, useAnecdotesActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { addVote, removeAnecdote } = useAnecdotesActions()

  const { setMessage, removeMessage } = useNotificationActions()

  const vote = (id) => {
    addVote(id)
    const votedAnecdote = anecdotes.find((n) => n.id === id)
    setMessage(`you voted '${votedAnecdote.content}'`)
    removeMessage()
  }

  const handleDelete = (id) => {
    removeAnecdote(id)
  }

  const anecdotesSorted = anecdotes.toSorted(
    (anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes,
  )
  return (
    <>
      {anecdotesSorted.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {!anecdote.votes && <button onClick={() => handleDelete(anecdote.id)}>delete</button>}
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
