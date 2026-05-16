import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
}

/**
 * IMAGE WITH FALLBACK (ZOHO-ELITE STANDARD)
 * Gracefully handles 404s and loading errors for assets.
 */
const ImageWithFallback: React.FC<Props> = ({ 
  src, 
  alt, 
  className, 
  fallbackIcon,
  ...props 
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`${className} flex items-center justify-center bg-white/[0.02] border border-white/5`}>
        {fallbackIcon || <Settings className="text-rc-teal/40" size={24} strokeWidth={1.5} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
