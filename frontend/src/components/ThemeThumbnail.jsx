import { useState } from 'react';
import placeholder from '../assets/theme-placeholder.svg';
import localThumbnails from '../assets/theme-thumbnail-map.json';

export default function ThemeThumbnail({ url }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const src = url && failedUrl !== url ? (localThumbnails[url] || url) : placeholder;
  return <img src={src} alt="" loading="lazy" onError={() => setFailedUrl(url)} />;
}
