// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function AdminPanel() {
  const [animeData, setAnimeData] = useState({
    title: '',
    description: '',
    coverImage: '',
    episodeCount: '',
    status: 'ongoing',
    type: 'tv',
    category: 'action'
  });

  const categories = [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'romance', name: 'Romance' }
  ];
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [existingAnimes, setExistingAnimes] = useState([]);

  useEffect(() => {
    const fetchExistingAnimes = async () => {
      const animesSnapshot = await getDocs(collection(db, 'animes'));
      const animes = animesSnapshot.docs.map(doc => doc.data().title);
      setExistingAnimes(animes);
    };
    fetchExistingAnimes();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Filter existing animes to avoid duplicates
    const filtered = existingAnimes.filter(title =>
      title.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate AI suggestions
    const aiSuggestions = [
      query + ' Season 1',
      query + ' Movie',
      query + ' OVA',
    ].filter(suggestion => !filtered.includes(suggestion));

    setSuggestions([...filtered, ...aiSuggestions].slice(0, 5));
  };

  const handleSuggestionClick = (suggestion) => {
    setAnimeData(prev => ({
      ...prev,
      title: suggestion,
      type: suggestion.toLowerCase().includes('movie') ? 'movie' :
            suggestion.toLowerCase().includes('ova') ? 'ova' : 'tv'
    }));
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'animes'), {
        ...animeData,
        episodeCount: parseInt(animeData.episodeCount),
        createdAt: new Date()
      });
      setMessage({ type: 'success', text: 'Anime added successfully!' });
      setAnimeData({
        title: '',
        description: '',
        coverImage: '',
        episodeCount: '',
        status: 'ongoing',
        type: 'tv'
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding anime: ' + error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>
        
        {message.text && (
          <div className={`p-4 rounded mb-6 ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-white mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={animeData.title}
              onChange={(e) => {
                handleChange(e);
                handleSearch(e.target.value);
              }}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )
          </div>

          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              name="description"
              value={animeData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={animeData.coverImage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2">Episode Count</label>
              <input
                type="number"
                name="episodeCount"
                value={animeData.episodeCount}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Status</label>
              <select
                name="status"
                value={animeData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Type</label>
              <select
                name="type"
                value={animeData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="tv">TV Series</option>
                <option value="movie">Movie</option>
                <option value="ova">OVA</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                name="category"
                value={animeData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-3 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
            } transition-colors`}
          >
            {loading ? 'Adding...' : 'Add Anime'}
          </button>
        </form>
      </div>
    </div>
  );
}

  // AI-powered search suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [existingAnimes, setExistingAnimes] = useState([]);

  useEffect(() => {
    const fetchExistingAnimes = async () => {
      const animesSnapshot = await getDocs(collection(db, 'animes'));
      const animes = animesSnapshot.docs.map(doc => doc.data().title);
      setExistingAnimes(animes);
    };
    fetchExistingAnimes();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Filter existing animes to avoid duplicates
    const filtered = existingAnimes.filter(title =>
      title.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate AI suggestions (in production, this would call an AI API)
    const aiSuggestions = [
      query + ' Season 1',
      query + ' Movie',
      query + ' OVA',
    ].filter(suggestion => !filtered.includes(suggestion));

    setSuggestions([...filtered, ...aiSuggestions].slice(0, 5));
  };

  const handleSuggestionClick = (suggestion) => {
    setAnimeData(prev => ({
      ...prev,
      title: suggestion,
      type: suggestion.toLowerCase().includes('movie') ? 'movie' :
            suggestion.toLowerCase().includes('ova') ? 'ova' : 'tv'
    }));
    setSuggestions([]);
  };
