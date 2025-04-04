// src/components/VideoPlayer.jsx
import React from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, quality }) {
  return (
    <div className="relative pt-[56.25%] w-full">
      <ReactPlayer
        url={url}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        controls={true}
        playing={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              onContextMenu: e => e.preventDefault()
            }
          }
        }}
      />
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm">
        {quality}
      </div>
    </div>
  );
}