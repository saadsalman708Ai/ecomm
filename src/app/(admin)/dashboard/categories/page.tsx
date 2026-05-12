import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../lib/firebase/collections';
import type { Category } from '../../../../types/homeSection';
import { Plus, Trash2, Edit2,  Check, X } from 'lucide-react';
import { AdminSuspenseLoader } from '../../../../components/shared/AdminSuspenseLoader';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatTag, setNewCatTag] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTag, setEditTag] = useState('');

  const fetchCategories = async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.CATEGORIES),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(fetched);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCatName.trim()) return;
    try {
      const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 0;
      const docRef = doc(collection(db, COLLECTIONS.CATEGORIES));
      await setDoc(docRef, {
        id: docRef.id,
        name: newCatName.trim(),
        tag: newCatTag.trim() || newCatName.trim(),
        enabled: true,
        order: newOrder,
      });
      setNewCatName('');
      setNewCatTag('');
      setAdding(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error('Failed to add category');
    }
  };

  const handleToggleEnable = async (cat: Category) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), {
        enabled: !cat.enabled
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error('Failed to toggle category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete category');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditTag(cat.tag || cat.name);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
       setEditingId(null);
       return;
    }
    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), {
        name: editName.trim(),
        tag: editTag.trim() || editName.trim()
      });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error('Failed to save category');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...categories];
    const prevItem = items[index - 1];
    const currentItem = items[index];

    const tempOrder = prevItem.order;
    prevItem.order = currentItem.order;
    currentItem.order = tempOrder;

    setCategories([...items].sort((a, b) => a.order - b.order));

    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, prevItem.id), { order: prevItem.order });
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, currentItem.id), { order: currentItem.order });
    } catch (e) {
      console.error(e);
      fetchCategories(); // revert on fail
    }
  };

  const moveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const items = [...categories];
    const nextItem = items[index + 1];
    const currentItem = items[index];

    const tempOrder = nextItem.order;
    nextItem.order = currentItem.order;
    currentItem.order = tempOrder;

    setCategories([...items].sort((a, b) => a.order - b.order));

    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, nextItem.id), { order: nextItem.order });
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, currentItem.id), { order: currentItem.order });
    } catch (e) {
      console.error(e);
      fetchCategories();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="w-full sm:w-auto">
           <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Manage Categories</h1>
           <p className="text-foreground-muted">Add, edit, enable, or reorder product categories.</p>
         </div>
         <button 
           onClick={() => setAdding(true)} 
           className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold flex justify-center items-center gap-2 hover:opacity-90"
         >
           <Plus size={18} /> Add Category
         </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-orange-800 text-sm font-medium flex gap-3 shadow-sm mb-2">
         <span className="text-xl">💡</span>
         <p>The "All Products" category is built-in and will always appear as the first option. Categories managed here will appear after it.</p>
      </div>

      {adding && (
        <div className="bg-white border border-border p-4 rounded-xl flex flex-col sm:flex-row gap-3 shadow-sm">
           <input 
             type="text" 
             value={newCatName}
             onChange={e => setNewCatName(e.target.value)}
             placeholder="Category Name (e.g. Shoes)"
             autoFocus
             className="flex-1 px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
             onKeyDown={e => e.key === 'Enter' && handleAdd()}
           />
           <input 
             type="text" 
             value={newCatTag}
             onChange={e => setNewCatTag(e.target.value)}
             placeholder="Tag Mapping (e.g. shoes)"
             className="flex-1 px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
             onKeyDown={e => e.key === 'Enter' && handleAdd()}
           />
           <div className="flex gap-2 shrink-0">
             <button onClick={handleAdd} className="flex-1 sm:flex-none p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"><Check size={20} /></button>
             <button onClick={() => setAdding(false)} className="flex-1 sm:flex-none p-2 bg-gray-200 text-foreground rounded-lg hover:bg-gray-300 transition-colors"><X size={20} /></button>
           </div>
        </div>
      )}

      {loading ? (
        <AdminSuspenseLoader />
      ) : (
        <div className="flex flex-col gap-3">
          {categories.length === 0 ? (
            <div className="bg-white border border-border p-8 rounded-xl text-center shadow-sm">
               <h3 className="text-lg font-bold text-foreground">No Categories Found</h3>
               <p className="text-foreground-muted mt-2">You haven't added any custom categories yet.</p>
            </div>
          ) : (
            categories.map((cat, index) => (
              <div key={cat.id} className="bg-white border border-border p-4 rounded-xl flex items-center shadow-sm group">
                <div className="flex flex-col mr-4 sm:mr-6 gap-1 shrink-0">
                   <button 
                     onClick={() => moveUp(index)} 
                     disabled={index === 0}
                     className="text-gray-400 hover:text-primary disabled:opacity-30 p-1"
                   >
                     ▲
                   </button>
                   <button 
                     onClick={() => moveDown(index)} 
                     disabled={index === categories.length - 1}
                     className="text-gray-400 hover:text-primary disabled:opacity-30 p-1"
                   >
                     ▼
                   </button>
                </div>

                <div className="flex-1 mr-4">
                  {editingId === cat.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                       <input 
                         type="text" 
                         value={editName}
                         onChange={e => setEditName(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && saveEdit(cat.id)}
                         autoFocus
                         placeholder="Category Name"
                         className="flex-1 px-3 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                       />
                       <input 
                         type="text" 
                         value={editTag}
                         onChange={e => setEditTag(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && saveEdit(cat.id)}
                         placeholder="Tag Mapping"
                         className="flex-1 px-3 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                       />
                       <div className="flex gap-2">
                         <button onClick={() => saveEdit(cat.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><Check size={20} /></button>
                         <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-foreground rounded-lg hover:bg-gray-300"><X size={20} /></button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                       <span className={`font-medium ${!cat.enabled && 'text-gray-400 line-through'}`}>{cat.name}</span>
                       <span className="text-xs text-foreground-muted">Maps to tag: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-primary">{cat.tag || cat.name}</code></span>
                       {!cat.enabled && <span className="text-xs text-error font-bold mt-1">Disabled</span>}
                    </div>
                  )}
                </div>

                {editingId !== cat.id && (
                  <div className="flex items-center gap-2 shrink-0">
                     <button 
                       onClick={() => handleToggleEnable(cat)}
                       className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                         cat.enabled ? 'bg-gray-100 text-foreground hover:bg-gray-200' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                       }`}
                     >
                       {cat.enabled ? 'Disable' : 'Enable'}
                     </button>
                     <button onClick={() => startEdit(cat)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                       <Edit2 size={18} />
                     </button>
                     <button onClick={() => handleDelete(cat.id)} className="p-2 text-error bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                       <Trash2 size={18} />
                     </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
