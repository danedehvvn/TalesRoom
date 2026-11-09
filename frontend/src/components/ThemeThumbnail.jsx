import { useState } from 'react';
import placeholder from '../assets/theme-placeholder.svg';

export default function ThemeThumbnail({ url }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const src = url && failedUrl !== url ? url : placeholder;
  return <img src={src} alt="" loading="lazy" onError={() => setFailedUrl(url)} />;
}
