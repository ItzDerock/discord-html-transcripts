import React from 'react';
import type { MediaGalleryComponent } from 'discord.js';
import { getGalleryLayout, getImageStyle } from './utils';

function DiscordMediaGallery({ component }: { component: MediaGalleryComponent }) {
  if (!component.items || component.items.length === 0) {
    return null;
  }

  const count = component.items.length;
  const imagesToShow = component.items.slice(0, 10);
  const hasMore = component.items.length > 10;

  return (
    <div style={getGalleryLayout(count)}>
      {imagesToShow.map((media, idx) => (
        <div key={idx} style={getImageStyle(idx, count)}>
          <img
            src={media.media.url}
            alt={media.description || 'Media content'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {hasMore && idx === imagesToShow.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              +{component.items.length - 10}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DiscordMediaGallery;
