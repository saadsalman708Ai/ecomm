import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

export const TopProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    // When location changes, the transition has finished.
    NProgress.done();
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleStart = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a');
      if (target) {
        const href = target.getAttribute('href');
        // Only trigger for internal links that are actually changing the route
        if (
          href &&
          href.startsWith('/') &&
          href !== location.pathname + location.search &&
          target.target !== '_blank'
        ) {
          NProgress.start();
          
          // Failsafe: stop NProgress after 10 seconds if it hangs
          setTimeout(() => {
            NProgress.done();
          }, 10000);
        }
      }
    };

    document.addEventListener('click', handleStart);
    return () => {
      document.removeEventListener('click', handleStart);
      NProgress.done();
    };
  }, [location.pathname, location.search]);

  return null;
};
