import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  imageUrl: string; // legacy support
  imageUrls?: string[];
  targetUrl?: string;
  targetTag?: string;
  title: string;
  showTitle?: boolean;
}

export const ImageBannerView = ({ imageUrl, imageUrls, targetUrl, targetTag, title, showTitle }: Props) => {
  const finalUrls = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (finalUrls.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % finalUrls.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [finalUrls.length, timerKey]);

  const handleManualChange = (index: number) => {
    setCurrentIndex(index);
    setTimerKey(k => k + 1);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ('touches' in e && e.touches.length > 0) {
      setTouchStart(e.touches[0].clientX);
    } else if ('clientX' in e) {
      setTouchStart((e as React.MouseEvent).clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      setTouchEnd(e.touches[0].clientX);
    } else if ('clientX' in e && touchStart !== null) {
      setTouchEnd((e as React.MouseEvent).clientX);
    }
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleManualChange((currentIndex + 1) % finalUrls.length);
    } else if (isRightSwipe) {
      handleManualChange(currentIndex === 0 ? finalUrls.length - 1 : currentIndex - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const content = (
    <div 
      className="w-full rounded-2xl overflow-hidden shadow-sm relative bg-gray-100 border border-border aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] xl:aspect-[4/1] max-h-[350px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndEvent}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEndEvent}
      onMouseLeave={() => {
        if (touchStart !== null) {
          onTouchEndEvent();
        }
      }}
    >
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {finalUrls.map((url, i) => (
          <img 
            key={i}
            src={url} 
            alt={`${title} - ${i + 1}`} 
            className="w-full h-full object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
      
      {finalUrls.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {finalUrls.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); handleManualChange(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const finalLink = targetTag ? `/search?tag=${encodeURIComponent(targetTag)}` : targetUrl;

  if (finalLink) {
    return (
      <section className="mb-10">
        {showTitle && <h2 className="text-xl font-bold text-foreground text-wrap mb-4 px-1">{title}</h2>}
        <Link to={finalLink} className="block w-full">{content}</Link>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      {showTitle && <h2 className="text-xl font-bold text-foreground text-wrap mb-4 px-1">{title}</h2>}
      {content}
    </section>
  );
};
