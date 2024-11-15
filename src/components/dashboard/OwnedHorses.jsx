import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function OwnedHorses({ contract, account }) {
  const [horses, setHorses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sellPrice, setSellPrice] = useState({})

  useEffect(() => {
    loadHorses()
  }, [contract, account])

  const loadHorses = async () => {
    if (!contract) return
    try {
      setLoading(true)
      const horseCount = await contract.getHorseCount()
      const ownedHorses = []
      
      for (let i = 0; i < horseCount; i++) {
        const horse = await contract.getHorse(i)
        if (horse.owner.toLowerCase() === account.toLowerCase()) {
          const listing = await contract.getHorseListing(i)
          ownedHorses.push({ 
            id: i, 
            ...horse,
            isListed: listing.isListed,
            listPrice: listing.isListed ? ethers.utils.formatEther(listing.price) : ''
          })
        }
      }
      
      setHorses(ownedHorses)
    } catch (error) {
      console.error('Error loading horses:', error)
    } finally {
      setLoading(false)
    }
  }

  const listHorseForSale = async (horseId) => {
    if (!sellPrice[horseId]) return
    try {
      const price = ethers.utils.parseEther(sellPrice[horseId])
      const tx = await contract.listHorseForSale(horseId, price)
      await tx.wait()
      loadHorses()
      setSellPrice(prev => ({ ...prev, [horseId]: '' }))
    } catch (error) {
      console.error('Error listing horse:', error)
    }
  }

  const cancelListing = async (horseId) => {
    try {
      const tx = await contract.cancelHorseListing(horseId)
      await tx.wait()
      loadHorses()
    } catch (error) {
      console.error('Error canceling listing:', error)
    }
  }

  if (loading) return <div className="loading">Loading horses...</div>

  return (
    <div className="owned-horses">
      <h3>My Horses</h3>
      <div className="horse-grid">
        {horses.map(horse => (
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
            
            <div className="horse-actions">
              {horse.isListed ? (
                <div className="listing-info">
                  <p>Listed for {horse.listPrice} ETH</p>
                  <button onClick={() => cancelListing(horse.id)}>
                    Cancel Listing
                  </button>
                </div>
              ) : (
                <div className="sell-form">
                  <input
                    type="number"
                    step="0.01"
                    value={sellPrice[horse.id] || ''}
                    onChange={(e) => setSellPrice(prev => ({
                      ...prev,
                      [horse.id]: e.target.value
                    }))}
                    placeholder="Price in ETH"
                  />
                  <button onClick={() => listHorseForSale(horse.id)}>
                    List for Sale
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OwnedHorses
