import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../lib/firebase/collections';
import { AdminProductCard } from '../../../../components/admin/products/AdminProductCard';
import { SkeletonList } from '../../../../components/shared/SkeletonList';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [sort, setSort] = useState('Latest');
  const navigate = useNavigate();
  const [pageSize] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24);
  const [displayCount, setDisplayCount] = useState(pageSize);

  const { ref, inView } = useInView({
    rootMargin: '100% 40% 100% 40%',
  });

  useEffect(() => {
    if (inView && !loading) {
      setDisplayCount(prev => prev + pageSize);
    }
  }, [inView, loading]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    navigate(`/dashboard/products/${id}/delete`);
  };

  const executeSearch = () => {
    setActiveSearch(searchInput);
    setDisplayCount(pageSize);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const displayedProducts = useMemo(() => {
    let filtered = [...products];
    if (activeSearch) {
       const s = activeSearch.toLowerCase();
       filtered = filtered.filter(p => 
         p.title.toLowerCase().includes(s) || 
         p.tags?.some((t:string) => t.toLowerCase().includes(s))
       );
    }

    if (sort === 'Latest') filtered.sort((a, b) => b.createdAt - a.createdAt);
    else if (sort === 'Oldest') filtered.sort((a, b) => a.createdAt - b.createdAt);
    else if (sort === 'Most Sold') filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    else if (sort === 'Least Sold') filtered.sort((a, b) => (a.soldCount || 0) - (b.soldCount || 0));
    else if (sort === 'Low Stock') filtered.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));

    return filtered;
  }, [products, activeSearch, sort]);

  const paginatedProducts = displayedProducts.slice(0, displayCount);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
        <Link to="/dashboard/products/add" className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto">
           <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="flex-1 flex gap-2">
           <input 
              type="text" placeholder="Search products by title or tags..." value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
           />
           <button onClick={executeSearch} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 border border-border text-foreground font-bold rounded-lg transition-colors shadow-sm">
             Search
           </button>
         </div>
         <select 
            value={sort} onChange={e => { setSort(e.target.value); setDisplayCount(pageSize); }}
            className="w-full md:w-48 px-4 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/50 shadow-sm font-medium"
         >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Sold">Most Sold</option>
            <option value="Least Sold">Least Sold</option>
            <option value="Low Stock">Low in stock</option>
         </select>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><SkeletonList count={4} /></div>
      ) : paginatedProducts.length > 0 ? (
         <>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedProducts.map(p => (
                 <AdminProductCard 
                   key={p.id} 
                   product={p} 
                   onEdit={(id) => navigate(`/dashboard/products/edit/${id}`)} 
                   onDelete={handleDelete}
                 />
              ))}
           </div>
           {displayCount < displayedProducts.length && (
             <div ref={ref} className="h-20 flex justify-center items-center mt-4 text-foreground-muted">
               Loading more...
             </div>
           )}
         </>
      ) : (
         <div className="p-12 text-center text-foreground-muted bg-white border border-border rounded-2xl shadow-sm">No products found matching your search.</div>
      )}
    </div>
  );
}

