import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../../../lib/firebase/collections';
import type { HomeConfig, DynamicSortBy } from '../../../../../../types/homeSection';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';

export default function EditDynamicComponentPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState<number | ''>('');
  const [isSwiper, setIsSwiper] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);
  const [sortBy, setSortBy] = useState<DynamicSortBy | ''>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG));
        if (snap.exists()) {
          const cfg = snap.data() as HomeConfig;
          setConfig(cfg);
          const sec = cfg.sections.find(s => s.id === componentId);
          if (sec && sec.type === 'dynamic') {
             setTitle(sec.title);
             setCategory(sec.category);
             setLimit(sec.limit || '');
             setIsSwiper(sec.isSwiper || false);
             setHasBackground(sec.hasBackground || false);
             setSortBy(sec.sortBy || '');
          } else {
             message.error('Section not found or wrong type.');
             navigate('/dashboard/edit-home');
          }
        }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
    };
    fetchConfig();
  }, [componentId, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    try {
      const newSections = config.sections.map(s => {
         if (s.id === componentId) {
            const updated: any = { ...s, title, category, isSwiper, hasBackground };
            if (limit !== '') {
               updated.limit = Number(limit);
            } else {
               delete updated.limit;
            }
            if (sortBy) {
               updated.sortBy = sortBy;
            } else {
               delete updated.sortBy;
            }
            return updated;
         }
         return s;
      });
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), { ...config, sections: newSections });
      navigate('/dashboard/edit-home');
    } catch (err) {
      console.error(err);
      message.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
         </div>
         <div className="flex justify-end gap-3 mt-4">
            <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Dynamic Category Feed</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Display Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
               placeholder="e.g. Featured Products, Huge Sale..."
            />
         </div>
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Target Category (Must match a product category exactly)</label>
            <input required type="text" value={category} onChange={e => setCategory(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
               placeholder="e.g. shoes, watches, electronics..."
            />
         </div>
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Display Limit (Optional)</label>
            <input type="number" min="1" value={limit} onChange={e => setLimit(e.target.value ? Number(e.target.value) : '')}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
               placeholder="Leave empty to show all. e.g. 10"
            />
         </div>
         
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Sort Items By</label>
            <select
               value={sortBy}
               onChange={e => setSortBy(e.target.value as DynamicSortBy | '')}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            >
               <option value="">Default</option>
               <option value="most_sold">Most Sold</option>
               <option value="latest">Latest</option>
               <option value="oldest">Oldest</option>
               <option value="price_low_high">Price: Low to High</option>
               <option value="price_high_low">Price: High to Low</option>
            </select>
         </div>

         <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
              <input 
                 type="checkbox"
                 id="isSwiper"
                 checked={isSwiper}
                 onChange={(e) => setIsSwiper(e.target.checked)}
                 className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="isSwiper" className="text-sm font-medium text-foreground-muted cursor-pointer select-none">
                 Swiper (Horizontal Scroll)
              </label>
           </div>
           
           <div className="flex items-center gap-3">
              <input 
                 type="checkbox"
                 id="hasBackground"
                 checked={hasBackground}
                 onChange={(e) => setHasBackground(e.target.checked)}
                 className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="hasBackground" className="text-sm font-medium text-foreground-muted cursor-pointer select-none">
                 Background Color (Primary Light)
              </label>
           </div>
         </div>

         <div className="flex gap-4 mt-2">
            <button type="button" onClick={() => navigate('/dashboard/edit-home')} disabled={saving} className="flex-1 py-2.5 font-bold text-foreground bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-opacity">{saving ? 'Saving...' : 'Save Section'}</button>
         </div>
      </form>
    </div>
  );
}
