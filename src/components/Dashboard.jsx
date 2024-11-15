import { useState } from 'react'
import UserStats from './dashboard/UserStats'
import OwnedHorses from './dashboard/OwnedHorses'
import RecentRaces from './dashboard/RecentRaces'
import RaceStats from './dashboard/RaceStats'
import MarketPlace from './dashboard/MarketPlace'
import RaceEntry from './dashboard/RaceEntry'
import Betting from './dashboard/Betting'

function Dashboard({ contract, account }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'horses' ? 'active' : ''}`}
          onClick={() => setActiveTab('horses')}
        >
          My Horses
        </button>
        <button 
          className={`tab ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          Marketplace
        </button>
        <button 
          className={`tab ${activeTab === 'races' ? 'active' : ''}`}
          onClick={() => setActiveTab('races')}
        >
          Enter Race
        </button>
        <button 
          className={`tab ${activeTab === 'betting' ? 'active' : ''}`}
          onClick={() => setActiveTab('betting')}
        >
          Betting
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <UserStats contract={contract} account={account} />
            <RaceStats contract={contract} account={account} />
          </div>
        )}
        
        {activeTab === 'horses' && (
          <OwnedHorses contract={contract} account={account} />
        )}
        
        {activeTab === 'marketplace' && (
          <MarketPlace contract={contract} account={account} />
        )}
        
        {activeTab === 'races' && (
          <RaceEntry contract={contract} account={account} />
        )}
        
        {activeTab === 'betting' && (
          <Betting contract={contract} account={account} />
        )}
        
        {activeTab === 'history' && (
          <RecentRaces contract={contract} account={account} />
        )}
      </div>
    </div>
  )
}

export default Dashboard
