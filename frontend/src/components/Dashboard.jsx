import '../styles/Dashboard.css'

function Dashboard() {
  const mockAuctions = [
    { id: 1, title: 'Vintage Watch', currentBid: 150, timeLeft: '2h 30m' },
    { id: 2, title: 'Gaming Console', currentBid: 300, timeLeft: '1h 15m' },
    { id: 3, title: 'Antique Furniture', currentBid: 500, timeLeft: '4h 45m' },
  ]

  return (
    <div className="dashboard-container">
      <h2>Your Dashboard</h2>
      <div className="dashboard-sections">
        <section className="active-bids">
          <h3>Active Bids</h3>
          <div className="auction-grid">
            {mockAuctions.map(auction => (
              <div key={auction.id} className="auction-card">
                <h4>{auction.title}</h4>
                <p>Current Bid: ${auction.currentBid}</p>
                <p>Time Left: {auction.timeLeft}</p>
                <button className="bid-button">Place Bid</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard 