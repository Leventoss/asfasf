// src/pages/AnimeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import VideoPlayer from '../components/VideoPlayer';

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const animeDoc = await getDoc(doc(db, 'animes', id));
        if (animeDoc.exists()) {
          setAnime({ id: animeDoc.id, ...animeDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Anime not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={anime.coverImage}
              alt={anime.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">{anime.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {anime.type.toUpperCase()}
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {anime.status}
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {anime.episodeCount} Episodes
              </span>
            </div>
            <p className="text-gray-300 mb-8">{anime.description}</p>

            {selectedEpisode && (
              <div className="mb-8">
                <VideoPlayer
                  url={`https://example.com/video/${id}/${selectedEpisode}`}
                  quality="1080p"
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {[...Array(anime.episodeCount)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEpisode(index + 1)}
                    className={`px-4 py-2 rounded ${
                      selectedEpisode === index + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Ep {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}