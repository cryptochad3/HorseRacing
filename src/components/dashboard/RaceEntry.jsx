import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function RaceEntry({ contract, account }) {
  const [activeRaces, setActiveRaces] = useState([])
  const [userHorses, setUserHorses] = useState([])
  const [selectedHorse, setSelectedHorse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRacesAndHorses()
  }, [contract])

  const loadRacesAndHorses = async () => {
    if (!contract) return
    try {
      setLoading(true)
      // Load active races
      const races = await contract.getActiveRaces()
      setActiveRaces(races)

      // Load user's horses
      const horseCount = await contract.getHorseCount()
      const horses = []
      
      for (let i = 0; i < horseCount; i++) {
        const horse = await contract.getHorse(i)
        if (horse.owner.toLowerCase() === account.toLowerCase()) {
          horses.push({ id: i, ...horse })
        }
      }
      
      setUserHorses(horses)
    } catch (error) {
      console.error('Error loading races and horses:', error)
    } finally {
      setLoading(false)
    }
  }

  const enterRace = async (raceId) => {
    if (!selectedHorse) return
    try {
      const tx = await contract.enterRace(raceId, selectedHorse)
      await tx.wait()
      loadRacesAndHorses()
    } catch (error) {
      console.error('Error entering race:', error)
    }
  }

  if (loading) return <div className="loading">Loading races...</div>

  return (
    <div className="race-entry">
      <h3>Available Races</h3>
      <div className="race-selection">
        <select 
          value={selectedHorse} 
          onChange={(e) => setSelectedHorse(e.target.value)}
        >
          <option value="">Select a horse</option>
          {userHorses.map(horse => (
            <option key={horse.id} value={horse.id}>
              {horse.name} (Speed: {horse.speed}, Stamina: {horse.stamina})
            </option>
          ))}
        </select>
      </div>

      <div className="race-list">
        {activeRaces.length === 0 ? (
          <div className="no-races">No active races available</div>
        ) : (
          activeRaces.map(race => (
            <div key={race.id} className="race-card">
              <div className="race-info">
                <h4>Race #{race.id}</h4>
                <p>Prize Pool: {ethers.utils.formatEther(race.prizePool)} ETH</p>
                <p>Entry Fee: {ethers.utils.formatEther(race.entryFee)} ETH</p>
                <p>Distance: {race.distance}m</p>
                <p>Participants: {race.participants.length}/{race.maxParticipants}</p>
              </div>
              <button 
                onClick={() => enterRace(race.id)}
                disabled={!selectedHorse}
              >
                Enter Race
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RaceEntry
