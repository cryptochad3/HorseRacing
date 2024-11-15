function HorseList({ horses }) {
  return (
    <div className="horse-list">
      <h2>Your Horses</h2>
      <div className="horses">
        {horses.map(horse => (
          <div key={horse.id} className="horse-card">
            <h3>{horse.name}</h3>
            <p>Speed: {horse.speed.toString()}</p>
            <p>Stamina: {horse.stamina.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HorseList
