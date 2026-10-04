import { useAnecdotesActions, useNotificationActions } from '../store'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotesActions()
  const { setMessage, removeMessage } = useNotificationActions()

  const handleCreateAnecdote = (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value
    addAnecdote(anecdote)
    setMessage(`A new note : ${anecdote} was added`)
    removeMessage()
    e.target.reset()
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
