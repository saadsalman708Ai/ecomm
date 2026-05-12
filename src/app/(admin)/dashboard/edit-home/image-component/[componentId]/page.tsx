import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../../../lib/firebase/collections';
import type { HomeConfig } from '../../../../../../types/homeSection';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';
import { Plus, Trash2 } from 'lucide-react';

export default function EditImageComponentPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [title, setTitle] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [targetTag, setTargetTag] = useState('');
  const [showTitle, setShowTitle] = useState(false);
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
          if (sec && sec.type === 'image') {
             setTitle(sec.title);
             setImageUrls(sec.imageUrls && sec.imageUrls.length > 0 ? sec.imageUrls : [sec.imageUrl || '']);
             setTargetUrl(sec.targetUrl || '');
             setTargetTag(sec.targetTag || '');
             setShowTitle(sec.showTitle || false);
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
      const cleanUrls = imageUrls.filter(u => u.trim() !== '');
      const newSections = config.sections.map(s => 
         s.id === componentId ? { ...s, title, showTitle, imageUrl: cleanUrls[0] || '', imageUrls: cleanUrls, targetUrl, targetTag } : s
      );
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), { ...config, sections: newSections });
      navigate('/dashboard/edit-home');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addImageUrl = () => setImageUrls([...imageUrls, '']);
  const updateUrl = (idx: number, val: string) => {
    const fresh = [...imageUrls];
    fresh[idx] = val;
    setImageUrls(fresh);
  };
  const removeUrl = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  if (loading) return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="flex items-center gap-2">
               <div className="h-4 w-4 bg-gray-200 rounded"></div>
               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
         </div>
         <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
               <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
               <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Image Slider/Banner</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Administrative Title (Internal)</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
               className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex items-center gap-2 mt-2">
               <input
                  type="checkbox"
                  id="showTitle"
                  checked={showTitle}
                  onChange={(e) => setShowTitle(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
               />
               <label htmlFor="showTitle" className="text-sm font-medium text-foreground-muted cursor-pointer select-none">
                  Display title on home page
               </label>
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Image URLs (Add multiple for active slider)</label>
            {imageUrls.map((url, i) => (
               <div key={i} className="flex items-center gap-2 mb-2">
                 <input required type="url" value={url} onChange={e => updateUrl(i, e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://"
                 />
                 {imageUrls.length > 1 && (
                    <button type="button" onClick={() => removeUrl(i)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                       <Trash2 size={20} />
                    </button>
                 )}
               </div>
            ))}
            <button type="button" onClick={addImageUrl} className="text-primary text-sm font-bold flex items-center mt-2 hover:opacity-80">
               <Plus size={16} className="mr-1" /> Add Another Image
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Target URL (Optional)</label>
              <input type="text" value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
                 className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                 placeholder="/search?category=shoes"
                 disabled={!!targetTag}
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Or Target Tag (Optional)</label>
              <input type="text" value={targetTag} onChange={e => setTargetTag(e.target.value)}
                 className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                 placeholder="e.g. winter-sale"
                 disabled={!!targetUrl}
              />
           </div>
           <p className="md:col-span-2 text-xs text-foreground-muted">Provide either a Target URL to link somewhere specific, or a Target Tag to link to a product search tag. If both are left blank, the banner will not be clickable.</p>
         </div>
         
         <div className="flex gap-4 mt-4">
            <button type="button" onClick={() => navigate('/dashboard/edit-home')} disabled={saving} className="flex-1 py-2.5 font-bold text-foreground bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-opacity">{saving ? 'Saving...' : 'Save Section'}</button>
         </div>
      </form>
    </div>
  );
}
