import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const loggedInUsername = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please sign in to access the dashboard');
      navigate('/signin');
      return;
    }

    fetchItems();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5001/auctions');
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching auctions');
      setLoading(false);
    }
  };

  const handleRemoveAuction = async (auctionId, seller) => {
    // Check if the logged-in user is the seller
    if (loggedInUsername !== seller) {
      toast.error('You can only remove your own auctions');
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/auction/${auctionId}`);
      toast.success('Auction removed successfully');
      // Update the items list
      setItems(items.filter(item => item._id !== auctionId));
    } catch (error) {
      toast.error('Error removing auction');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const getTimeLeft = (closingTime) => {
    const now = new Date();
    const end = new Date(closingTime);
    const diff = end - now;

    if (diff <= 0) return 'Auction Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `http://localhost:5001${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-header">
        <h2>Active Auctions</h2>
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by item name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Garden</option>
            <option value="sports">Sports</option>
            <option value="art">Art & Collectibles</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <i className="fas fa-box-open"></i>
          <p>No auctions found</p>
          <Link to="/post-auction" className="create-auction-btn">
            Create New Auction
          </Link>
        </div>
      ) : (
        <div className="auction-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="auction-card">
              {loggedInUsername === item.seller && (
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAuction(item._id, item.seller);
                  }}
                >
                  <span>Remove Auction</span>
                  ×
                </button>
              )}
              <div className="auction-image">
                <img 
                  src={item.imageUrl ? `http://localhost:5001${item.imageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={item.itemName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className="auction-card-content">
                <h3>{item.itemName}</h3>
                <p className="description">{item.description}</p>
                <div className="bid-info">
                  <p><strong>Initial Bid:</strong> {formatPrice(item.startingBid)}</p>
                  <p><strong>Current Bid:</strong> {formatPrice(item.currentBid || item.startingBid)}</p>
                </div>
                <div className="auction-details">
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Condition:</strong> {item.condition}</p>
                  <p><strong>Status:</strong> {item.isClosed ? 'Closed' : 'Active'}</p>
                </div>
                <div className="auction-status">
                  {new Date(item.closingTime) <= new Date() || item.isClosed ? (
                    <div className="winner-info">
                      <span className="status-tag closed">Auction Closed</span>
                      <p className="winner">
                        Winner: <strong>{item.winner || item.highestBidder || 'No winner'}</strong>
                      </p>
                      <p className="final-bid">
                        Final Bid: <strong>{formatPrice(item.currentBid)}</strong>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="time-left">
                        <i className="far fa-clock"></i>
                        {getTimeLeft(item.closingTime)}
                      </div>
                      {item.highestBidder && (
                        <p className="highest-bidder">
                          Highest Bidder: {item.highestBidder}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="auction-footer">
                  <span className="seller">
                    By {item.seller}
                  </span>
                  <Link 
                    to={`/auction/${item._id}`} 
                    className="view-auction-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/post-auction" className="floating-action-btn">
        <i className="fas fa-plus"></i>
      </Link>
    </div>
  );
}

export default Dashboard;
