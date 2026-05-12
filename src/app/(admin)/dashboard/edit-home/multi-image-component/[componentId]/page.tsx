import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../../../lib/firebase/collections';
import type { HomeConfig, MultiImageItem } from '../../../../../../types/homeSection';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function EditMultiImageComponentPage() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [images, setImages] = useState<MultiImageItem[]>([]);
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
          if (sec && sec.type === 'multi-image') {
             setTitle(sec.title);
             setShowTitle(sec.showTitle || false);
             setImages(sec.images || []);
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
      const cleanImages = images.filter(img => img.imageUrl.trim() !== '');
      const newSections = config.sections.map(s => 
         s.id === componentId ? { ...s, title, showTitle, images: cleanImages } : s
      );
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), { ...config, sections: newSections });
      navigate('/dashboard/edit-home');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => setImages([...images, { imageUrl: '', targetUrl: '', targetTag: '' }]);
  
  const updateImage = (idx: number, field: keyof MultiImageItem, val: string) => {
    const fresh = [...images];
    fresh[idx] = { ...fresh[idx], [field]: val };
    setImages(fresh);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const moveImageUp = (idx: number) => {
    if (idx === 0) return;
    const fresh = [...images];
    [fresh[idx - 1], fresh[idx]] = [fresh[idx], fresh[idx - 1]];
    setImages(fresh);
  };

  const moveImageDown = (idx: number) => {
    if (idx === images.length - 1) return;
    const fresh = [...images];
    [fresh[idx + 1], fresh[idx]] = [fresh[idx], fresh[idx + 1]];
    setImages(fresh);
  };

  if (loading) return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-1 animate-pulse">
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
         
         <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 p-4 border border-border bg-gray-50 rounded-xl">
               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                     <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                     <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div>
                     <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                     <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div>
                     <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                     <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
               </div>
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Linked Image Grid</h1>
      
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
         
         <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-foreground-muted">Images Configuration</label>
              <button type="button" onClick={addImage} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-primary/20 transition-colors">
                 <Plus size={16} className="mr-2" /> Add Image
              </button>
            </div>
            
            {images.length === 0 && (
              <div className="text-center py-6 bg-gray-50 border border-dashed border-border rounded-xl text-foreground-muted text-sm">
                No images added yet. Click 'Add Image' to start building your grid.
              </div>
            )}

            {images.map((img, i) => (
               <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-border bg-gray-50 rounded-xl relative group">
                 <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <button type="button" onClick={() => moveImageUp(i)} disabled={i === 0} className={`p-1.5 rounded-lg ${i === 0 ? 'text-gray-300' : 'text-foreground-muted hover:bg-white hover:shadow-sm transition-all'}`}>
                      <ArrowUp size={18} />
                    </button>
                    <button type="button" onClick={() => moveImageDown(i)} disabled={i === images.length - 1} className={`p-1.5 rounded-lg ${i === images.length - 1 ? 'text-gray-300' : 'text-foreground-muted hover:bg-white hover:shadow-sm transition-all'}`}>
                      <ArrowDown size={18} />
                    </button>
                 </div>
                 
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                     <label className="block text-xs font-semibold text-foreground-muted mb-1">Image URL *</label>
                     <input required type="url" value={img.imageUrl} onChange={e => updateImage(i, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        placeholder="https://"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-foreground-muted mb-1">Target URL (Optional)</label>
                     <input type="text" value={img.targetUrl || ''} onChange={e => updateImage(i, 'targetUrl', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        placeholder="/search?category=shoes"
                        disabled={!!img.targetTag}
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-foreground-muted mb-1">Or Target Tag (Optional)</label>
                     <input type="text" value={img.targetTag || ''} onChange={e => updateImage(i, 'targetTag', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        placeholder="winter-sale"
                        disabled={!!img.targetUrl}
                     />
                   </div>
                 </div>

                 <div className="shrink-0 flex items-center justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                    <button type="button" onClick={() => removeImage(i)} className="text-error bg-error/10 hover:bg-error hover:text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium w-full justify-center">
                       <Trash2 size={18} /> <span className="md:hidden">Remove</span>
                    </button>
                 </div>
               </div>
            ))}
         </div>
         
         <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => navigate('/dashboard/edit-home')} disabled={saving} className="flex-1 py-3 font-bold text-foreground bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-opacity shadow-md">{saving ? 'Saving...' : 'Save Section'}</button>
         </div>
      </form>
    </div>
  );
}
