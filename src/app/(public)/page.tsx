import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../lib/firebase/collections';
import type { HomeConfig } from '../../types/homeSection';
import { DynamicCategoryFeed } from '../../components/home/DynamicCategoryFeed';
import { HeroSectionView } from '../../components/home/HeroSectionView';
import { ImageBannerView } from '../../components/home/ImageBannerView';
import { MultiImageBannerView } from '../../components/home/MultiImageBannerView';
import { LOGO_TEXT } from '../../config/branding';

export default function HomePage() {
  const [config, setConfig] = useState<HomeConfig | undefined>(undefined);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG),
      { includeMetadataChanges: true },
      (snap) => {
        if (snap.exists()) {
          setConfig(snap.data() as HomeConfig);
        } else {
          setConfig({ sections: [] } as HomeConfig);
        }
      },
      (error) => {
        console.error("Error fetching home config:", error);
      }
    );
    return () => unsub();
  }, []);

  if (config === undefined) {
    return (
      <div className="p-4 md:p-8 flex flex-col flex-1 w-full max-w-7xl mx-auto animate-pulse">
        {/* Skeleton Hero */}
        <div className="w-full h-[60vh] min-h-[400px] bg-gray-200 rounded-3xl mb-10"></div>
        
        {/* Skeleton Carousel/Grid */}
        <div className="w-full">
           <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
           <div className="flex gap-4 overflow-hidden">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-[160px] sm:w-[165px] md:w-[175px] xl:w-[200px] flex flex-col bg-card rounded-lg shrink-0 border border-border overflow-hidden">
                  <div className="w-full relative pt-[100%] bg-gray-50 flex-none border-b border-border">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="image-loader scale-50 opacity-50"></div>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="flex gap-2 items-baseline mt-1">
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // Fallback for absolutely new setup without config
  if (!config || config.sections?.length === 0) {
    return (
      <div className="p-4 md:p-8 flex flex-col flex-1 w-full max-w-7xl mx-auto">
        <HeroSectionView 
          title={`Welcome to ${LOGO_TEXT}`} 
          subtitle="Explore top quality products with amazing discounts." 
          buttonText="Explore Products"
          targetUrl="/search"
        />
        <DynamicCategoryFeed title="Featured Products" category="all" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col flex-1 w-full max-w-7xl mx-auto">
      {config.sections.map((section, index) => {
        const content = (() => {
          switch (section.type) {
            case 'hero':
              return (
                <HeroSectionView 
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  buttonText={section.buttonText}
                  imageUrl={section.imageUrl}
                  targetUrl={section.targetUrl}
                />
              );
            case 'image':
              return (
                <ImageBannerView 
                  key={section.id}
                  title={section.title}
                  showTitle={section.showTitle}
                  imageUrl={section.imageUrl}
                  imageUrls={section.imageUrls}
                  targetUrl={section.targetUrl}
                  targetTag={section.targetTag}
                />
              );
            case 'multi-image':
              return (
                <MultiImageBannerView 
                  key={section.id}
                  title={section.title}
                  showTitle={section.showTitle}
                  images={section.images}
                />
              );
            case 'dynamic':
              return (
                <DynamicCategoryFeed 
                  key={section.id}
                  title={section.title}
                  category={section.category}
                  limitCount={section.limit}
                  isSwiper={section.isSwiper}
                  hasBackground={section.hasBackground}
                />
              );
            default:
              return null;
          }
        })();

        if (!content) return null;

        return <React.Fragment key={section.id}>{content}</React.Fragment>;
      })}
    </div>
  );
}

