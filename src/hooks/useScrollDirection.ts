import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (scrollY < 120) {
        setIsAtTop(true);
        setScrollDir('up');
        lastScrollY = scrollY;
      } else {
        setIsAtTop(false);
        if (scrollY > lastScrollY + 2) {
          setScrollDir('down');
          lastScrollY = scrollY;
        } else if (scrollY < lastScrollY - 40) {
          setScrollDir('up');
          lastScrollY = scrollY;
        }
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDir, isAtTop };
};


