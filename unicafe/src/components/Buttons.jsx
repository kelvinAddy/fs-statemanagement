import { useStatisticsControls } from '../store'

const Buttons = () => {
  const { handleGood, handleBad, handleNeutral } = useStatisticsControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={handleGood}>good</button>
      <button onClick={handleNeutral}>neutral</button>
      <button onClick={handleBad}>bad</button>
    </div>
  )
}

export default Buttons
