import { useState } from 'react'
import { toast } from 'react-toastify'

function RaceTrack({ contract, horses }) {
  const [selectedHorse, setSelectedHorse] = useState(null)
  const [isRacing, setIsRacing] = useState(false)

  const startRace = async () => {
    if (!selectedHorse) return
    
    try {
      const tx = await contract.startRace(selectedHorse.id)
      await tx.wait()
      setIsRacing(true)
      simulateRace()
    } catch (error) {
      console.error(error)
      toast.error('Failed to start race')
    }
  }

  const simulateRace = async () => {
    // Simulate race duration based on horse stats
    const duration = Math.floor(10000 / (selectedHorse.speed * 0.8 + selectedHorse.stamina * 0.2))
    
    setTimeout(async () => {
      try {
        const tx = await contract.finishRace(selectedHorse.id)
        await tx.wait()
        setIsRacing(false)
        toast.success('Race finished!')
      } catch (error) {
        console.error(error)
        toast.error('Failed to finish race')
      }
    }, duration)
  }

  return (
    <div className="race-track">
      <h2>Race Track</h2>
      <select 
        value={selectedHorse ? selectedHorse.id : ''} 
        onChange={(e) => setSelectedHorse(horses[e.target.value])}
        disabled={isRacing}
      >
        <option value="">Select a horse</option>
        {horses.map(horse => (
          <option key={horse.id} value={horse.id}>
            {horse.name}
          </option>
        ))}
      </select>
      
      <button 
        onClick={startRace} 
        disabled={!selectedHorse || isRacing}
      >
        {isRacing ? 'Racing...' : 'Start Race'}
      </button>

      {isRacing && (
        <div className="race-animation">
          🐎 Racing...
        </div>
      )}
    </div>
  )
}

export default RaceTrack
