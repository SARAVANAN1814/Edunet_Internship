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
  // const navigate = useNavigate();

  //loads when the component load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // navigate('/signin');
  };

  return (
    <Router>
      <nav className="navbar">
        <Link className="navbar-brand" to="/">Auction App</Link>
        <div>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/post-auction">Post Auction</Link>
          {isAuthenticated && (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer' }}>Logout</button>
          )}
        </div>
      </nav>

      <header className="header">
        <h1>Build, Sell & Collect Digital Items</h1>
        <p>Join our auction platform and start bidding today!</p>
        <img src="path/to/your/auction-image.jpg" alt="Auction" className="auction-image" />
      </header>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auction/:id" element={<AuctionItem />} />
          <Route path="/post-auction" element={<PostAuction />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Auction App. All rights reserved.</p>
        <p>Welcome to the best place to buy and sell items through auctions!</p>
      </footer>
    </Router>
  );
}

export default App;
