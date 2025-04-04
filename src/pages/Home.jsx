// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function Home() {
  const navigate = useNavigate();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleCategorySelect = (categoryId) => {
    setIsFiltering(true);
    setSelectedCategory(categoryId);
    setTimeout(() => setIsFiltering(false), 300); // Simulate smooth transition
  };
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'romance', name: 'Romance' }
  ];

  const filteredAnimes = selectedCategory === 'all'
    ? animes
    : animes.filter(anime => anime.category === selectedCategory);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const animesCollection = collection(db, 'animes');
        const animesSnapshot = await getDocs(animesCollection);
        const animesList = animesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnimes(animesList);
      } catch (error) {
        console.error('Error fetching animes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const featuredAnime = animes[0];

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-10">
      {featuredAnime && (
        <div className="relative overflow-hidden mb-12 bg-gradient-to-b from-purple-900/50 to-gray-900">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${featuredAnime.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)'
            }}
          />
          <div className="max-w-7xl mx-auto px-4 py-16 relative">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-64 flex-shrink-0">
                <img 
                  src={featuredAnime.coverImage}
                  alt={featuredAnime.title}
                  className="w-full rounded-lg shadow-2xl hover-scale"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 gradient-text">
                  {featuredAnime.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {featuredAnime.type.toUpperCase()}
                  </span>
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                    {featuredAnime.episodeCount} Episodes
                  </span>
                </div>
                <p className="text-gray-300 text-lg mb-6">{featuredAnime.description}</p>
                <button 
                  onClick={() => navigate(`/anime/${featuredAnime.id}`)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Latest Releases</h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 min-h-[300px] relative">
          {isFiltering && (
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}
          {filteredAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </div>
    </div>
  );
}