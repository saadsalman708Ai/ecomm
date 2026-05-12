import React, { useState } from 'react';
import { ImageUrlInput } from './ImageUrlInput';
import { ProductOptionsInput } from './ProductOptionsInput';
import { ProductOption } from '../../../types/product';

interface Props {
  initialValues?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const AdminProductForm = ({ initialValues, onSubmit, onCancel, loading }: Props) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    price: initialValues?.price?.toString() || '',
    salePrice: initialValues?.salePrice?.toString() || '',
    salePercent: initialValues?.salePercent?.toString() || '',
    quantity: initialValues?.quantity?.toString() || '10',
    tags: initialValues?.tags?.join(', ') || '',
    adminNote: initialValues?.adminNote || '',
    images: initialValues?.images && initialValues.images.length > 0 ? initialValues.images : [''],
    options: initialValues?.options || [] as ProductOption[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      salePercent: formData.salePercent ? parseFloat(formData.salePercent) : null,
      quantity: parseInt(formData.quantity, 10) || 0,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      adminNote: formData.adminNote,
      images: formData.images.filter((u: string) => u.trim() !== ''),
      options: formData.options.filter((opt: ProductOption) => opt.title.trim() !== '' && opt.options.some(o => o.trim() !== ''))
        .map((opt: ProductOption) => ({
          title: opt.title,
          options: opt.options.filter(o => o.trim() !== '')
        }))
    };
    onSubmit(data);
  };

  const update = (k: string, v: any) => setFormData(prev => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground-muted mb-1">Title</label>
          <input required type="text" value={formData.title} onChange={e => update('title', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground-muted mb-1">Description (Optional)</label>
          <textarea rows={4} value={formData.description} onChange={e => update('description', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Price ($)</label>
          <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => update('price', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Sale Price ($) - Optional</label>
          <input type="number" min="0" step="0.01" value={formData.salePrice} onChange={e => update('salePrice', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 19.99" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Sale Percent (%) - Optional</label>
          <input type="number" min="0" max="100" value={formData.salePercent} onChange={e => update('salePercent', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 20" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Available Quantity</label>
          <input required type="number" min="0" value={formData.quantity} onChange={e => update('quantity', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground-muted mb-1">Tags (Comma Separated)</label>
          <input type="text" value={formData.tags} onChange={e => update('tags', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. electronics, modern, sale" />
        </div>
        
        <div className="md:col-span-2">
           <hr className="my-6 border-border" />
           <ImageUrlInput urls={formData.images} onChange={v => update('images', v)} />
        </div>

        <div className="md:col-span-2">
           <hr className="my-6 border-border" />
           <ProductOptionsInput options={formData.options} onChange={v => update('options', v)} />
        </div>

        <div className="md:col-span-2 mt-4 pt-4 border-t border-border">
          <label className="block text-sm font-medium text-error mb-1">Admin Note (Hidden from users)</label>
          <textarea rows={2} value={formData.adminNote} onChange={e => update('adminNote', e.target.value)} className="w-full px-4 py-2 border border-orange-200 bg-orange-50/30 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none" placeholder="Internal tracking note..." />
        </div>
      </div>

      <div className="flex gap-4 mt-2">
         <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-3 font-bold text-foreground bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
         <button type="submit" disabled={loading} className="flex-1 py-3 font-bold text-white bg-primary hover:opacity-90 rounded-xl transition-opacity">{loading ? 'Saving...' : 'Save Product'}</button>
      </div>
    </form>
  );
};
