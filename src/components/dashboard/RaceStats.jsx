function RaceStats({ contract, account }) {
  return (
    <div className="stats-card">
      <h3>Race Statistics</h3>
      <div className="race-stats-grid">
        <div className="stat-item">
          <span className="stat-label">Best Time</span>
          <span className="stat-value">--:--</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Fastest Horse</span>
          <span className="stat-value">--</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Earnings</span>
          <span className="stat-value">0 ETH</span>
        </div>
      </div>
    </div>
  )
}

export default RaceStats
