import React from 'react';

function DiscordThumbnail({ url }: { url: string }) {
  return (
    <img
      src={url}
      alt="Thumbnail"
      style={{
        width: '85px',
        height: '85px',
        objectFit: 'cover',
        borderRadius: '8px',
      }}
    />
  );
}

export default DiscordThumbnail;
