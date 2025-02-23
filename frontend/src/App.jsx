import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Dashboard from './components/Dashboard'
import PostAuction from './components/PostAuction'
import './App.css'

function App() {
  return (
    <Router>
      <header className="header">
        <h1>Auction App</h1>
        <nav className="nav-vertical">
          <Link to="/signup">Signup</Link>
          <Link to="/signin">Signin</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/post-auction">Post Auction</Link>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-auction" element={<PostAuction />} />
          <Route path="/" element={
            <div className="welcome-container">
              <p className="welcome-text">© 2024 Auction App. All rights reserved.</p>
              <p className="welcome-text">Welcome to the best place to buy and sell items through auctions!</p>
            </div>
          } />
        </Routes>
      </main>
    </Router>
  )
}

export default App
