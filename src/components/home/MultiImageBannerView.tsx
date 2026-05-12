import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { MultiImageItem } from '../../types/homeSection';

interface Props {
  title: string;
  images: MultiImageItem[];
  showTitle?: boolean;
}

export const MultiImageBannerView = ({ title, images, showTitle }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <section className="mb-10">
      {showTitle && <h2 className="text-xl font-bold text-foreground text-wrap mb-4 px-1">{title}</h2>}
      <div className="w-full rounded-2xl overflow-hidden shadow-sm relative bg-gray-100 border border-border aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] xl:aspect-[4/1] max-h-[350px]">
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => {
          const finalLink = img.targetTag ? `/search?tag=${encodeURIComponent(img.targetTag)}` : img.targetUrl;
          
          const imgContent = (
            <img 
              src={img.imageUrl} 
              alt={`${title} - ${i + 1}`} 
              className="w-full h-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          );

          return (
            <div key={i} className="w-full h-full shrink-0 relative">
               {finalLink ? (
                 <Link to={finalLink} className="block w-full h-full">
                    {imgContent}
                    <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
                 </Link>
               ) : (
                 <>
                   {imgContent}
                   <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
                 </>
               )}
            </div>
          );
        })}
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
    </section>
  );
};
