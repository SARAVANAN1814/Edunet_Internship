import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuctionItem.css';

function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [bid, setBid] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [bidderUsername, setBidderUsername] = useState('');
  const [tempBidAmount, setTempBidAmount] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please sign in to view auction details');
      navigate('/signin');
      return;
    }

    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auction/${id}`);
        if (res.data) {
          // Check if auction has ended
          const now = new Date();
          const endTime = new Date(res.data.closingTime);
          const isEnded = now >= endTime;
          
          setItem({
            ...res.data,
            isClosed: isEnded || res.data.isClosed,
            winner: isEnded ? (res.data.highestBidder || 'No winner') : res.data.winner
          });
          setError('');
        }
      } catch (err) {
        setError('Error fetching auction details');
        toast.error('Error loading auction details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    // Set up polling to refresh auction data
    const interval = setInterval(fetchItem, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    if (!bid) {
      toast.error('Please enter a bid amount');
      return;
    }

    const bidAmount = parseFloat(bid);
    if (isNaN(bidAmount) || bidAmount <= (item?.currentBid || 0)) {
      toast.error('Bid must be higher than current bid');
      return;
    }

    setTempBidAmount(bidAmount);
    setShowUsernamePrompt(true);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    
    if (!bidderUsername.trim()) {
      toast.error('Please enter your username');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5001/auction/${id}/bid`, {
        amount: tempBidAmount,
        username: bidderUsername
      });

      if (response.data.success) {
        toast.success('Bid placed successfully!');
        setItem(prev => ({
          ...prev,
          currentBid: response.data.auction.currentBid,
          highestBidder: response.data.auction.highestBidder,
          isClosed: response.data.auction.isClosed,
          winner: response.data.auction.winner
        }));
        setBid('');
        setShowUsernamePrompt(false);
        setBidderUsername('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTimeLeft = (closingTime) => {
    const now = new Date();
    const end = new Date(closingTime);
    const diff = end - now;

    if (diff <= 0) return 'Auction Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = '';
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    timeString += `${minutes}m`;

    return timeString;
  };

  if (loading) {
    return <div className="loading">Loading auction details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="auction-container">
      <ToastContainer />
      <div className="auction-details">
        <div className="auction-image">
          {item?.imageUrl ? (
            <img 
              src={`http://localhost:5001${item.imageUrl}`} 
              alt={item?.itemName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          ) : (
            <div className="no-image">No image available</div>
          )}
        </div>

        <div className="auction-info">
          <h2>{item?.itemName}</h2>
          <div className="time-remaining">
            <div className="time-label">Time Remaining:</div>
            <div className="time-value">{getTimeLeft(item?.closingTime)}</div>
          </div>
          <p className="description">{item?.description}</p>
          
          <div className="bid-section">
            <div className="bid-info">
              <div className="starting-bid">
                <h4>Starting Bid:</h4>
                <span>{formatPrice(item?.startingBid || 0)}</span>
              </div>
              <div className="current-bid">
                <h3>Current Bid: {formatPrice(item?.currentBid || 0)}</h3>
                <p className="highest-bidder">
                  {item?.isClosed ? (
                    <>
                      <strong className="status-closed">AUCTION CLOSED</strong>
                      <br />
                      <strong>Winner: {item.winner || 'No winner'}</strong>
                      <br />
                      <span>Winning Bid: {formatPrice(item.currentBid)}</span>
                    </>
                  ) : (
                    <>Highest Bidder: {item?.highestBidder || 'No bids yet'}</>
                  )}
                </p>
              </div>
            </div>

            {!item?.isClosed && (
              <form onSubmit={handleBidSubmit} className="bid-form">
                <div className="bid-input-group">
                  <input
                    type="number"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                    placeholder="Enter your bid amount"
                    min={item?.currentBid ? item.currentBid + 1 : 1}
                    className="bid-input"
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit" 
                    className="bid-button"
                    disabled={isSubmitting}
                  >
                    Place Bid
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="auction-meta">
            <div className="meta-item">
              <span className="label">Category:</span>
              <span className="value">{item?.category}</span>
            </div>
            <div className="meta-item">
              <span className="label">Condition:</span>
              <span className="value">{item?.condition}</span>
            </div>
            <div className="meta-item">
              <span className="label">Seller:</span>
              <span className="value">{item?.seller}</span>
            </div>
            <div className="meta-item">
              <span className="label">Status:</span>
              <span className="value">{item?.isClosed ? 'Closed' : 'Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {showUsernamePrompt && (
        <div className="username-modal">
          <div className="username-modal-content">
            <h3>Enter Your Username</h3>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={bidderUsername}
                onChange={(e) => setBidderUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
              <div className="modal-buttons">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Placing Bid...' : 'Confirm Bid'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowUsernamePrompt(false);
                    setBidderUsername('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionItem;
