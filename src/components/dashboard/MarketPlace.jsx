import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function MarketPlace({ contract, account }) {
  const [listedHorses, setListedHorses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListedHorses()
  }, [contract])

  const loadListedHorses = async () => {
    if (!contract) return
    try {
      setLoading(true)
      const horseCount = await contract.getHorseCount()
      const listed = []
      
      for (let i = 0; i < horseCount; i++) {
        const horse = await contract.getHorse(i)
        const listing = await contract.getHorseListing(i)
        if (listing.isListed && horse.owner.toLowerCase() !== account.toLowerCase()) {
          listed.push({
            id: i,
            ...horse,
            price: ethers.utils.formatEther(listing.price)
          })
        }
      }
      
      setListedHorses(listed)
    } catch (error) {
      console.error('Error loading listed horses:', error)
    } finally {
      setLoading(false)
    }
  }

  const buyHorse = async (horseId, price) => {
    try {
      const tx = await contract.buyHorse(horseId, {
        value: ethers.utils.parseEther(price)
      })
      await tx.wait()
      loadListedHorses()
    } catch (error) {
      console.error('Error buying horse:', error)
    }
  }

  if (loading) return <div className="loading">Loading marketplace...</div>

  return (
    <div className="marketplace">
      <h3>Horse Marketplace</h3>
      <div className="horse-grid">
        {listedHorses.length === 0 ? (
          <div className="no-horses">No horses available for sale</div>
        ) : (
          listedHorses.map(horse => (
            <div key={horse.id} className="horse-card">
              <div className="horse-avatar">🐎</div>
              <h4>{horse.name}</h4>
              <div className="horse-stats">
                <div className="stat">
                  <span>Speed</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${horse.speed}%` }} />
                  </div>
                </div>
                <div className="stat">
                  <span>Stamina</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${horse.stamina}%` }} />
                  </div>
                </div>
              </div>
              <div className="horse-price">
                <span>{horse.price} ETH</span>
                <button onClick={() => buyHorse(horse.id, horse.price)}>
                  Buy Horse
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MarketPlace
