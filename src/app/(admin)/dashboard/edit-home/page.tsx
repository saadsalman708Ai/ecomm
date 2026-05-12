import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../lib/firebase/collections';
import type { HomeConfig, HomeSectionConfig } from '../../../../types/homeSection';
import { SectionList } from '../../../../components/admin/edit-home/SectionList';
import { AddSectionButton } from '../../../../components/admin/edit-home/AddSectionButton';
import { SkeletonCard } from '../../../../components/shared/SkeletonCard';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

export default function EditHomePage() {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchConfig = async () => {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG));
      if (snap.exists()) {
        setConfig(snap.data() as HomeConfig);
      } else {
        setConfig({ sections: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const saveConfig = async (newConfig: HomeConfig) => {
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), newConfig);
      setConfig(newConfig);
    } catch (err) {
      console.error(err);
      message.error('Failed to save home page layout');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (!config || index === 0) return;
    const sects = [...config.sections];
    [sects[index-1], sects[index]] = [sects[index], sects[index-1]];
    saveConfig({ ...config, sections: sects });
  };

  const handleMoveDown = (index: number) => {
    if (!config || index === config.sections.length - 1) return;
    const sects = [...config.sections];
    [sects[index+1], sects[index]] = [sects[index], sects[index+1]];
    saveConfig({ ...config, sections: sects });
  };

  const handleDelete = (index: number) => {
    if (!config) return;
    const sects = [...config.sections];
    sects.splice(index, 1);
    saveConfig({ ...config, sections: sects });
  };

  const handleEdit = (section: HomeSectionConfig) => {
    if (section.type === 'dynamic') navigate(`/dashboard/edit-home/component/${section.id}`);
    else if (section.type === 'image') navigate(`/dashboard/edit-home/image-component/${section.id}`);
    else if (section.type === 'multi-image') navigate(`/dashboard/edit-home/multi-image-component/${section.id}`);
    else if (section.type === 'hero') navigate(`/dashboard/edit-home/hero-component/${section.id}`);
  };

  const handleAdd = async (type: 'dynamic' | 'image' | 'hero' | 'multi-image') => {
    if (!config) return;
    const newId = `sec_${Date.now()}`;
    let newSection: HomeSectionConfig;
    if (type === 'dynamic') {
      newSection = { id: newId, type, title: 'New Category Feed', category: '' };
    } else if (type === 'image') {
      newSection = { id: newId, type, title: 'New Banner', imageUrl: '', targetUrl: '', targetTag: '' };
    } else if (type === 'multi-image') {
      newSection = { id: newId, type, title: 'New Linked Grid', images: [] };
    } else {
      newSection = { id: newId, type, title: 'New Hero', subtitle: '', buttonText: 'Shop Now', imageUrl: '', targetUrl: '' };
    }
    
    const newConfig = { ...config, sections: [...config.sections, newSection] };
    await saveConfig(newConfig);
    
    // Auto-navigate to editor for the newly created section
    handleEdit(newSection);
  };

  if (loading || !config) return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex-1 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 md:h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="bg-gray-50 border border-border p-4 md:p-6 rounded-2xl shadow-sm mb-6 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-xl w-full md:w-1/3 mx-auto"></div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex-1">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl md:text-3xl font-bold text-foreground">Edit Home Page</h1>
         {saving && <span className="text-sm font-medium text-primary flex items-center animate-pulse"><Save size={16} className="mr-2" /> Saving...</span>}
      </div>

      <div className="bg-gray-50 border border-border p-4 md:p-6 rounded-2xl shadow-sm mb-6">
         <h2 className="text-sm font-bold tracking-wider text-foreground-muted uppercase mb-4">Current Layout Elements</h2>
         <SectionList 
            sections={config.sections}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDelete={handleDelete}
            onEdit={handleEdit}
         />
         {config.sections.length === 0 && <div className="text-center text-foreground-muted py-8">Your home page is currently empty.</div>}
      </div>

      <AddSectionButton onAdd={handleAdd} />
    </div>
  );
}
