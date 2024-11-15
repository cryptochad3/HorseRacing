import { useState, useEffect } from 'react'

function UserStats({ contract, account }) {
  const [stats, setStats] = useState({
    totalHorses: 0,
    totalRaces: 0,
    winRate: 0
  })

  useEffect(() => {
    loadStats()
  }, [contract, account])

  const loadStats = async () => {
    if (!contract) return
    
    try {
      const horseCount = await contract.getHorseCount()
      let ownedHorses = 0
      
      for (let i = 0; i < horseCount; i++) {
        const horse = await contract.getHorse(i)
        if (horse.owner.toLowerCase() === account.toLowerCase()) {
          ownedHorses++
        }
      }
      
      setStats(prev => ({
        ...prev,
        totalHorses: ownedHorses
      }))
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  return (
    <div className="stats-card">
      <h3>Your Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Owned Horses</span>
          <span className="stat-value">{stats.totalHorses}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Races</span>
          <span className="stat-value">{stats.totalRaces}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{stats.winRate}%</span>
        </div>
      </div>
    </div>
  )
}

export default UserStats
