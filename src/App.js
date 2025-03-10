import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AuctionItem from './components/AuctionItem';
import PostAuction from './components/PostAuction';
import Landing from './components/Landing';
import './App.css';

function App() {
  //isAuthenticated is the state, setIsAuthenticated changes the state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  // const navigate = useNavigate();

  //loads when the component load
  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    window.location.href = '/';
    // navigate('/signin');
  };

  return (
    <Router>
      <nav className="navbar">
        <Link className="navbar-brand" to="/">Eco Bid</Link>
        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="welcome-text">Welcome, {username}!</span>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/post-auction">Post Auction</Link>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <header className="header">
        <h1>Build, Sell & Collect Valuables</h1>
        <p>Join our auction platform and start bidding today!</p>
      </header>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={
            <Signin 
              setIsAuthenticated={setIsAuthenticated} 
              setUsername={setUsername} 
            />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auction/:id" element={<AuctionItem />} />
          <Route path="/post-auction" element={<PostAuction />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Auction App. All rights reserved.</p>
        <p>Welcome to the best place to buy and sell items through auctions!</p>
      </footer>
    </Router>
  );
}

export default App;
