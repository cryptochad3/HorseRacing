import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function Betting({ contract, account }) {
  const [activeRaces, setActiveRaces] = useState([])
  const [betAmount, setBetAmount] = useState('')
  const [selectedHorse, setSelectedHorse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActiveRaces()
  }, [contract])

  const loadActiveRaces = async () => {
    if (!contract) return
    try {
      setLoading(true)
      const races = await contract.getActiveRaces()
      setActiveRaces(races)
    } catch (error) {
      console.error('Error loading active races:', error)
    } finally {
      setLoading(false)
    }
  }

  const placeBet = async (raceId) => {
    if (!selectedHorse || !betAmount) return
    try {
      const tx = await contract.placeBet(raceId, selectedHorse, {
        value: ethers.utils.parseEther(betAmount)
      })
      await tx.wait()
      loadActiveRaces()
      setBetAmount('')
      setSelectedHorse('')
    } catch (error) {
      console.error('Error placing bet:', error)
    }
  }

  if (loading) return <div className="loading">Loading betting options...</div>

  return (
    <div className="betting">
      <h3>Place Your Bets</h3>
      <div className="betting-list">
        {activeRaces.length === 0 ? (
          <div className="no-races">No active races to bet on</div>
        ) : (
          activeRaces.map(race => (
            <div key={race.id} className="betting-card">
              <div className="race-info">
                <h4>Race #{race.id}</h4>
                <p>Total Bets: {ethers.utils.formatEther(race.totalBets)} ETH</p>
                <p>Participants: {race.participants.length}</p>
              </div>
              <div className="betting-form">
                <select 
                  value={selectedHorse} 
                  onChange={(e) => setSelectedHorse(e.target.value)}
                >
                  <option value="">Select a horse</option>
                  {race.participants.map(horse => (
                    <option key={horse.id} value={horse.id}>
                      {horse.name} (Odds: {horse.odds}x)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Bet amount in ETH"
                />
                <button 
                  onClick={() => placeBet(race.id)}
                  disabled={!selectedHorse || !betAmount}
                >
                  Place Bet
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Betting
