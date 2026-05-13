import { message } from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../../../lib/firebase/collections';
import { AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';
import type { HomeConfig, HomeSectionConfig } from '../../../../../../types/homeSection';
import { handleFirestoreError, OperationType } from '../../../../../../lib/firebase/errors';

export default function AdminDeleteHomePageComponent() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [section, setSection] = useState<HomeSectionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!componentId) return;
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG));
        if (snap.exists()) {
          const cfg = snap.data() as HomeConfig;
          setConfig(cfg);
          const sect = cfg.sections.find(s => s.id === componentId);
          if (sect) {
            setSection(sect);
          } else {
            setError('Section not found.');
          }
        } else {
          setError('Home config not found.');
        }
      } catch (err) {
        console.error(err);
        handleFirestoreError(err, OperationType.GET, `${COLLECTIONS.CONFIG}/${DOCUMENTS.HOME_CONFIG}`);
        setError('Failed to fetch config.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [componentId]);

  const handleDelete = async () => {
    if (!config || !componentId) return;
    setDeleting(true);
    try {
      const sects = [...config.sections];
      const newSects = sects.filter(s => s.id !== componentId);
      const newConfig = { ...config, sections: newSects };
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.HOME_CONFIG), newConfig);
      navigate('/dashboard/edit-home');
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.CONFIG}/${DOCUMENTS.HOME_CONFIG}`);
      message.error('Failed to delete section.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 text-center">
        <div className="bg-red-50 text-error p-6 rounded-2xl flex flex-col items-center">
          <AlertCircle size={32} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Section not found'}</p>
          <button onClick={() => navigate('/dashboard/edit-home')} className="mt-6 px-4 py-2 border rounded hover:bg-gray-50">
            Back to Edit Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <button 
        onClick={() => navigate('/dashboard/edit-home')} 
        className="flex items-center text-sm font-semibold text-foreground-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Edit Home
      </button>

      <div className="bg-white border border-red-100 p-6 md:p-10 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Delete Section</h1>
        <p className="text-foreground-muted mb-8">
          Are you sure you want to permanently delete the section <strong className="text-foreground">{section.title}</strong>? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/dashboard/edit-home')}
            className="px-6 py-3 border border-border rounded-lg font-semibold bg-white hover:bg-gray-50 text-foreground transition-colors"
            disabled={deleting}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-6 py-3 border border-error bg-error text-white rounded-lg font-semibold hover:bg-error/90 transition-colors flex items-center justify-center gap-2"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Section'}
          </button>
        </div>
      </div>
    </div>
  );
}
