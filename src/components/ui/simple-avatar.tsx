'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleAvatarProps {
  src?: string | null;
  alt?: string;
  fallback: string;
  className?: string;
}

export function SimpleAvatar({ src, alt, fallback, className }: SimpleAvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const showImage = src && !imageError;

  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}>
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.2s' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error('Failed to load avatar image:', src);
              setImageError(true);
            }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
              {fallback}
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-medium">
          {fallback}
        </div>
      )}
    </div>
  );
}
