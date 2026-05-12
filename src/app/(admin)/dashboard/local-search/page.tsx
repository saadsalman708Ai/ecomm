import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../lib/firebase/collections';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminSuspenseLoader } from '../../../../components/shared/AdminSuspenseLoader';

export default function LocalSearchSettingsPage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.APP_SETTINGS);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setEnabled(snapshot.data().localSearchEnabled || false);
        }
      } catch (err: any) {
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const docRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.APP_SETTINGS);
      await setDoc(docRef, { localSearchEnabled: enabled }, { merge: true });
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminSuspenseLoader />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Local Search Settings</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border">
        {error && <div className="mb-4 text-sm text-error bg-red-50 p-3 rounded-lg">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>}

        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-start pt-1">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Enable Local Search Cache</h3>
            <p className="text-sm text-foreground-muted">
              If enabled, all products will be loaded in the background when the user visits the site. 
              Searching and filtering will happen locally in the browser. 
              Best used when you have a small number of products (under ~1000).
            </p>
          </div>
        </label>

        <div className="flex justify-end mt-8">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
