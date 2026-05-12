import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = ({ src, alt, className = '' }: LazyImageProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { ref, inView } = useInView({
    rootMargin: '200px 0px',
    triggerOnce: true, // Only load once to prevent mount/unmount lag
  });

  return (
    <div ref={ref} className={`w-full h-full relative ${className}`}>
      {!hasLoaded && (
         <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="image-loader scale-75 shadow-sm"></div>
         </div>
      )}
      {inView && (
        <img 
          src={src} 
          alt={alt} 
          onLoad={() => setHasLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`} 
          referrerPolicy="no-referrer" 
        />
      )}
    </div>
  );
};
