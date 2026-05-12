import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../../../lib/firebase/collections';
import { AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import type { Product } from '../../../../../../types/product';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';

export default function AdminDeleteProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() } as Product);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
      navigate('/dashboard/products');
    } catch (err) {
      console.error(err);
      message.error('Failed to delete product.');
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

  if (error || !product) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1 text-center">
        <div className="bg-red-50 text-error p-6 rounded-2xl flex flex-col items-center">
          <AlertCircle size={32} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/dashboard/products')} className="mt-6 px-4 py-2 border rounded hover:bg-gray-50">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <button 
        onClick={() => navigate('/dashboard/products')} 
        className="flex items-center text-sm font-semibold text-foreground-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Products
      </button>

      <div className="bg-white border border-red-100 p-6 md:p-10 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Delete Product</h1>
        <p className="text-foreground-muted mb-8">
          Are you sure you want to permanently delete the product <strong className="text-foreground">{product.title}</strong>? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/dashboard/products')}
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
            {deleting ? 'Deleting...' : 'Yes, Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
