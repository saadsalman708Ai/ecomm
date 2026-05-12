import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../../lib/firebase/collections';
import { AdminProductForm } from '../../../../../components/admin/products/AdminProductForm';
import { handleFirestoreError, OperationType } from '../../../../../lib/firebase/errors';

export default function AdminAddProductPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async (data: any) => {
    setLoading(true);
    const newId = `PROD-${Date.now()}`;
    try {
      await setDoc(doc(db, COLLECTIONS.PRODUCTS, newId), {
         id: newId,
         ...data,
         soldCount: 0,
         createdAt: Date.now(),
         updatedAt: Date.now()
      });
      message.success('Product added successfully!');
      navigate('/dashboard/products');
    } catch (err) {
      message.error('Failed to add product');
      handleFirestoreError(err, OperationType.CREATE, `${COLLECTIONS.PRODUCTS}/${newId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Add New Product</h1>
      <AdminProductForm 
        onSubmit={handleAdd} 
        onCancel={() => navigate('/dashboard/products')}
        loading={loading}
      />
    </div>
  );
}
