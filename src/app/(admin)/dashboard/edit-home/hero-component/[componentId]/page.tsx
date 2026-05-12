import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../../../lib/firebase/collections';
import type { HomeConfig } from '../../../../../../types/homeSection';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';

export default function EditHeroComponentPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  
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
          if (sec && sec.type === 'hero') {
             setTitle(sec.title);
             setSubtitle(sec.subtitle || '');
             setButtonText(sec.buttonText || 'Shop Now');
             setImageUrl(sec.imageUrl || '');
             setTargetUrl(sec.targetUrl || '');
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
      const newSections = config.sections.map(s => 
         s.id === componentId ? { ...s, title, subtitle, buttonText, imageUrl, targetUrl } : s
      );
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), { ...config, sections: newSections });
      navigate('/dashboard/edit-home');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
               <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
               <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
               <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
               <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
         </div>
         <div className="flex gap-4 mt-4">
            <div className="flex-1 h-11 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 h-11 bg-gray-200 rounded-xl"></div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Hero Block</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Main Heading</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
         </div>
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Subtitle</label>
            <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Button Text</label>
              <input required type="text" value={buttonText} onChange={e => setButtonText(e.target.value)}
                 className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Button Target URL</label>
              <input type="text" value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
                 className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
              />
           </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Background Image URL (Optional)</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
               placeholder="https://"
            />
         </div>
         
         <div className="flex gap-4 mt-2">
            <button type="button" onClick={() => navigate('/dashboard/edit-home')} disabled={saving} className="flex-1 py-2.5 font-bold text-foreground bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-opacity">{saving ? 'Saving...' : 'Save Section'}</button>
         </div>
      </form>
    </div>
  );
}
