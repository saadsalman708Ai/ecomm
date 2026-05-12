import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../../../lib/firebase/collections';
import { AdminProductForm } from '../../../../../../components/admin/products/AdminProductForm';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';
import { ErrorState } from '../../../../../../components/shared/ErrorState';

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProd = async () => {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
        else setError('Product not found required for edit.');
      } catch (err) {
        console.error(err);
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [id]);

  const handleEdit = async (data: any) => {
    setSaving(true);
    try {
      if (!id) return;
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
         ...data,
         updatedAt: Date.now()
      });
      navigate('/dashboard/products');
    } catch (err) {
      console.error(err);
      message.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 max-w-4xl mx-auto"><SkeletonCard /></div>;
  if (error || !product) return <div className="p-8 max-w-4xl mx-auto"><ErrorState title="Not found" message={error} /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Product: {product.id}</h1>
      <AdminProductForm 
        initialValues={product}
        onSubmit={handleEdit} 
        onCancel={() => navigate('/dashboard/products')}
        loading={saving}
      />
    </div>
  );
}
