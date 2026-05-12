import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { X,  LogOut, Package, User, LayoutDashboard, ShoppingCart, Search } from 'lucide-react';
import { auth, db } from '../../lib/firebase/config';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '../../lib/firebase/collections';
import type { Category } from '../../types/homeSection';
import { Skeleton } from 'antd';
import { useCartStore } from '../../store/cartStore';
import { SHOW_SIDEBAR_LOGO_IMAGE, SHOW_SIDEBAR_LOGO_ICON, SHOW_SIDEBAR_LOGO_TEXT } from '../../config/branding';
import { Logo } from './Logo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const items = useCartStore(state => state.items);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Only fetch if sidebar is opened to save reads, or just once. 
    // Usually once is fine.
    const fetchCats = async () => {
      try {
        const q = query(
          collection(db, COLLECTIONS.CATEGORIES),
          where('enabled', '==', true),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && categories.length === 0) {
       fetchCats();
    }
  }, [isOpen, categories.length]);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[110] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="scale-75 origin-left md:scale-100">
            <Logo 
              onClick={onClose} 
              showImage={SHOW_SIDEBAR_LOGO_IMAGE}
              showIcon={SHOW_SIDEBAR_LOGO_ICON}
              showText={SHOW_SIDEBAR_LOGO_TEXT}
            />
          </div>
          <button onClick={onClose} className="p-2 text-foreground-muted hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {user ? (
            <div className="flex flex-col mb-2">
              <Link to="/profile" onClick={onClose} className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{user.email}</div>
                  <div className="text-xs text-foreground-muted font-medium">{isAdmin ? 'Administrator' : 'Customer'}</div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="px-6 pb-2 mb-2 flex flex-col gap-2">
              <Link to="/login" onClick={onClose} className="bg-primary text-white text-center py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm">
                Log In
              </Link>
              <Link to="/signup" onClick={onClose} className="bg-gray-100 text-foreground text-center py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          )}

          <div className="h-px bg-border mx-6 my-2"></div>

          <div className="flex flex-col mb-2">
            <Link to="/search" onClick={onClose} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-foreground transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold">
                <Search size={18} className="text-foreground-muted" /> Search Item
              </div>
            </Link>
            
            {user && isAdmin && (
              <>
                <div className="h-px bg-border mx-6 my-2"></div>
                <Link to="/dashboard" onClick={onClose} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-foreground transition-colors border-l-2 border-primary bg-primary/5">
                  <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </div>
                </Link>
                <div className="flex flex-col border-l-2 border-primary/20 ml-8 pl-4 py-1 gap-2 my-1">
                  <Link to="/dashboard/orders" onClick={onClose} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Manage Orders</Link>
                  <Link to="/dashboard/products" onClick={onClose} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Manage Products</Link>
                  <Link to="/dashboard/categories" onClick={onClose} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Manage Categories</Link>
                  <Link to="/dashboard/edit-home" onClick={onClose} className="text-sm font-medium text-foreground hover:text-primary transition-colors">Edit Home Page</Link>
                </div>
                <div className="h-px bg-border mx-6 my-2"></div>
              </>
            )}

            <Link to="/cart" onClick={onClose} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-foreground transition-colors">
              <div className="flex items-center gap-3 text-sm font-bold">
                <ShoppingCart size={18} className="text-primary" /> My Cart
              </div>
              {itemsCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {itemsCount}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/my-orders" onClick={onClose} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-foreground transition-colors">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <Package size={18} className="text-foreground-muted" /> My Orders
                </div>
              </Link>
            )}
          </div>

          {user && (
            <>
              <div className="h-px bg-border mx-6 my-2"></div>
              <div className="flex flex-col mb-2">
                <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 mt-2 hover:bg-red-50 text-error transition-colors text-sm font-medium text-left">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          )}

          <div className="h-px bg-border my-2 mx-6"></div>

          <div className="flex flex-col mb-2 mt-2">
            <Link to="/contact" onClick={onClose} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-foreground transition-colors text-sm font-medium">
              Support & Contact
            </Link>
          </div>
          <div className="h-px bg-border my-2 mx-6"></div>

          <div className="px-6 mt-5 mb-4 text-[15px] font-bold text-foreground uppercase tracking-wider">All Categories</div>
          <div className="flex flex-col px-6 gap-3 mb-6">
            <Link 
              to={`/search`}
              onClick={onClose}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors block"
            >
              All Products
            </Link>
            
            {loading && isOpen ? (
              <div className="flex flex-col gap-3 mt-1">
                 <Skeleton.Button active size="small" shape="round" />
                 <Skeleton.Button active size="small" shape="round" />
                 <Skeleton.Button active size="small" shape="round" />
              </div>
            ) : (
              categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/search?category=${encodeURIComponent(cat.tag || cat.name)}`}
                  onClick={onClose}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors block"
                >
                  {cat.name}
                </Link>
              ))
            )}
            
            {!loading && categories.length === 0 && (
               <div className="text-sm text-foreground-muted italic">
                  No custom categories.
               </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
