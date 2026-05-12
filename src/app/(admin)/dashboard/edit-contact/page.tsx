import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../lib/firebase/collections';
import { WhatsAppEdit } from '../../../../components/admin/edit-contact/WhatsAppEdit';
import { FacebookEdit } from '../../../../components/admin/edit-contact/FacebookEdit';
import { ContactConfig } from '../../../../types/homeSection';
import { SkeletonCard } from '../../../../components/shared/SkeletonCard';

export default function EditContactPage() {
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.CONTACT_CONFIG);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setConfig(snap.data() as ContactConfig);
        } else {
          setConfig({
             whatsapp: { number: '', enabled: false },
             facebook: { url: '', enabled: false }
          });
        }
      } catch (err) {
        console.error("Error fetching contact config", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const docRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.CONTACT_CONFIG);
      await setDoc(docRef, config);
      message.error('Contact information saved successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to save contact config.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) return <div className="p-8 max-w-3xl mx-auto"><SkeletonCard /></div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Contact Information</h1>
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <WhatsAppEdit 
           data={config.whatsapp} 
           onChange={val => setConfig({ ...config, whatsapp: val })} 
        />
        <FacebookEdit 
           data={config.facebook} 
           onChange={val => setConfig({ ...config, facebook: val })} 
        />
        
        <button 
           onClick={handleSave}
           disabled={saving}
           className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
