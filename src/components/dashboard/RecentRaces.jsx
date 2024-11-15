import { useState, useEffect } from 'react'

function RecentRaces({ contract, account }) {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRaces()
  }, [contract, account])

  const loadRaces = async () => {
    if (!contract) return
    setLoading(false) // For now, since we don't have race history yet
  }

  if (loading) return <div className="loading">Loading races...</div>

  return (
    <div className="recent-races">
      <h3>Recent Races</h3>
      <div className="race-list">
        {races.length === 0 ? (
          <div className="no-races">
            <p>No races yet. Start racing your horses!</p>
          </div>
        ) : (
          races.map(race => (
            <div key={race.id} className="race-item">
              <div className="race-info">
                <span className="race-horse">{race.horseName}</span>
                <span className="race-result">{race.result}</span>
                <span className="race-time">{race.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentRaces
