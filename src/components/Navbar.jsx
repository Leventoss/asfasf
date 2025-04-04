// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-500">AnimeZone</Link>
          
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Search anime..."
                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.email === 'admin@animezone.com' && (
                  <Link to="/admin" className="hover:text-purple-400">Admin Panel</Link>
                )}
                <button onClick={() => auth.signOut()} className="hover:text-purple-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-400">Login</Link>
                <Link to="/register" className="bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}