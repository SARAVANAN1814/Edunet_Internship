import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Optional for custom styles

function Dashboard() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      nav('/signin'); // Redirect to signin if not authenticated
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/auctions');
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchItems();
  }, []);

  // 🔹 Handle Logout
  // const handleLogout = () => {
  //   localStorage.removeItem('authToken'); // Remove token
  //   navigate('/signin'); // Redirect to Sign In page
  // };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Auction Dashboard</h2>
      <div className="row">
        {items.map((item) => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text">Current Bid: <strong>${item.currentBid}</strong></p>
                <p className="card-text">{item.isClosed ? <span className="text-danger">(Closed)</span> : ''}</p>
                <Link to={`/auction/${item._id}`} className="btn btn-primary">View Auction</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
