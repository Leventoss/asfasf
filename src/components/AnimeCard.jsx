// src/components/AnimeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AnimeCard({ anime }) {
  const { id, title, coverImage, episodeCount, status } = anime;

  return (
    <Link 
      to={`/anime/${id}`} 
      className="group block anime-card transform transition-all duration-300 hover:scale-105"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-700/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative aspect-[2/3]">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
            {status}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg truncate transition-colors duration-300 group-hover:text-purple-400">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-400 text-sm">
              {episodeCount} Episodes
            </p>
            <span className="text-purple-400 text-sm opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Watch →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}