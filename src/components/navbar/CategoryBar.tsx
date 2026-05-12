import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import type { Category } from '../../types/homeSection';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Skeleton } from 'antd';

export const CategoryBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All Products';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(
          collection(db, COLLECTIONS.CATEGORIES),
          where('enabled', '==', true),
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
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 px-6 py-3 bg-white border-b border-border overflow-x-auto hide-scrollbar">
        <Skeleton.Button active size="small" shape="round" className="min-w-[80px]" />
        <Skeleton.Button active size="small" shape="round" className="min-w-[100px]" />
        <Skeleton.Button active size="small" shape="round" className="min-w-[90px]" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 px-6 py-3 bg-white overflow-x-auto whitespace-nowrap border-b border-border hide-scrollbar shadow-sm">
      <Link
        to="/search"
        className={clsx(
          "text-[13px] font-medium transition-colors cursor-pointer",
          activeCategory === 'All Products' ? "text-primary" : "text-foreground-muted hover:text-foreground"
        )}
      >
        All Products
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/search?category=${encodeURIComponent(cat.tag || cat.name)}`}
          className={clsx(
            "text-[13px] font-medium transition-colors cursor-pointer",
            activeCategory === (cat.tag || cat.name) ? "text-primary" : "text-foreground-muted hover:text-foreground"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};
