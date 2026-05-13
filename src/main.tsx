import { StrictMode, lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigationType } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { ProtectedRoute } from './middleware';
import { LocalSearchProvider } from './hooks/useLocalSearch';
import { Loader2 } from 'lucide-react';
import { SWRConfig } from 'swr';
import './index.css';

import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { OrderSuspenseLoader } from './components/shared/OrderSuspenseLoader';
import { AdminSuspenseLoader } from './components/shared/AdminSuspenseLoader';
import { TopProgressBar } from './components/shared/TopProgressBar';

// Public Pages (Lazy Loaded)
import HomePage from './app/(public)/page';
const LoginPage = lazy(() => import('./app/(public)/login/page'));
const SignupPage = lazy(() => import('./app/(public)/signup/page'));
const SearchPage = lazy(() => import('./app/(public)/search/page'));
const ProductDetailPage = lazy(() => import('./app/(public)/product/page'));
const ContactPage = lazy(() => import('./app/(public)/contact/page'));

// User Pages (Lazy Loaded)
const CartPage = lazy(() => import('./app/(user)/cart/page'));
const ProceedPage = lazy(() => import('./app/(user)/proceed/page'));
const MyOrdersPage = lazy(() => import('./app/(user)/my-orders/page'));
const OrderedDetailPage = lazy(() => import('./app/(user)/ordered/page'));
const CancelOrderPage = lazy(() => import('./app/(user)/cancel-order/[id]/page'));
const ProfilePage = lazy(() => import('./app/(user)/profile/page'));

// Admin Pages (Lazy Loaded)
const AdminDashboardPage = lazy(() => import('./app/(admin)/dashboard/page'));
const AdminChargesPage = lazy(() => import('./app/(admin)/dashboard/charges/page'));
const EditContactPage = lazy(() => import('./app/(admin)/dashboard/edit-contact/page'));
const AdminCategoriesPage = lazy(() => import('./app/(admin)/dashboard/categories/page'));
const AdminOrdersPage = lazy(() => import('./app/(admin)/dashboard/orders/page'));
const AdminOrderDetailPage = lazy(() => import('./app/(admin)/dashboard/orders/[orderId]/page'));
const AdminDeleteOrderPage = lazy(() => import('./app/(admin)/dashboard/orders/[orderId]/delete/page'));
const AdminProductsPage = lazy(() => import('./app/(admin)/dashboard/products/page'));
const AdminAddProductPage = lazy(() => import('./app/(admin)/dashboard/products/add/page'));
const AdminEditProductPage = lazy(() => import('./app/(admin)/dashboard/products/edit/[id]/page'));
const AdminDeleteProductPage = lazy(() => import('./app/(admin)/dashboard/products/[id]/delete/page'));
const AdminLocalSearchPage = lazy(() => import('./app/(admin)/dashboard/local-search/page'));
const EditHomePage = lazy(() => import('./app/(admin)/dashboard/edit-home/page'));
const EditDynamicComponentPage = lazy(() => import('./app/(admin)/dashboard/edit-home/component/[componentId]/page'));
const EditImageComponentPage = lazy(() => import('./app/(admin)/dashboard/edit-home/image-component/[componentId]/page'));
const EditMultiImageComponentPage = lazy(() => import('./app/(admin)/dashboard/edit-home/multi-image-component/[componentId]/page'));
const EditHeroComponentPage = lazy(() => import('./app/(admin)/dashboard/edit-home/hero-component/[componentId]/page'));
const AdminDeleteHomePageComponent = lazy(() => import('./app/(admin)/dashboard/edit-home/[componentId]/delete/page'));

const SuspenseLoader = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 w-full h-full min-h-[50vh]">
    <div className="preloader">
      <svg className="cart" role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
          <g className="cart__track" stroke="hsla(0,10%,10%,0.1)">
            <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
            <circle cx="43" cy="111" r="13" />
            <circle cx="102" cy="111" r="13" />
          </g>
          <g className="cart__lines" stroke="currentColor">
            <polyline className="cart__top" points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" strokeDasharray="338 338" strokeDashoffset="-338" />
            <g className="cart__wheel1" transform="rotate(-90,43,111)">
              <circle className="cart__wheel-stroke" cx="43" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
            </g>
            <g className="cart__wheel2" transform="rotate(90,102,111)">
              <circle className="cart__wheel-stroke" cx="102" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
            </g>
          </g>
        </g>
      </svg>
      <div className="preloader__text">
        <p className="preloader__msg font-bold text-foreground">Bringing you the goods…</p>
        <p className="preloader__msg preloader__msg--last font-medium text-foreground-muted">Taking longer than expected.<br />Please wait!</p>
      </div>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

function localStorageProvider() {
  const map = new Map();
  try {
    const stored = localStorage.getItem('app-cache');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.forEach(([k, v]: [any, any]) => map.set(k, v));
    }
  } catch (e) {
    console.error("Failed to load local cache", e);
  }

  // To avoid spamming localStorage, buffer saves slightly if requested constantly,
  // but for simple cases, doing it on write works, or doing it beforeunload.
  window.addEventListener('beforeunload', () => {
    try {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem('app-cache', appCache);
    } catch (e) {
      console.error("Failed to save local cache", e);
    }
  });

  return map;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <SWRConfig value={{ provider: localStorageProvider }}>
        <LocalSearchProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans w-full overflow-x-hidden relative">
          <Navbar />
          <main className="flex-1 flex flex-col relative w-full">
            <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Suspense fallback={<SuspenseLoader />}><LoginPage /></Suspense>} />
              <Route path="/signup" element={<Suspense fallback={<SuspenseLoader />}><SignupPage /></Suspense>} />
              <Route path="/search" element={<Suspense fallback={<SuspenseLoader />}><SearchPage /></Suspense>} />
              <Route path="/product/:id" element={<Suspense fallback={<SuspenseLoader />}><ProductDetailPage /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<SuspenseLoader />}><ContactPage /></Suspense>} />
              
              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Suspense fallback={<OrderSuspenseLoader />}><CartPage /></Suspense>} />
                <Route path="/proceed" element={<Suspense fallback={<OrderSuspenseLoader />}><ProceedPage /></Suspense>} />
                <Route path="/my-orders" element={<Suspense fallback={<OrderSuspenseLoader />}><MyOrdersPage /></Suspense>} />
                <Route path="/ordered/:id" element={<Suspense fallback={<OrderSuspenseLoader />}><OrderedDetailPage /></Suspense>} />
                <Route path="/cancel-order/:id" element={<Suspense fallback={<OrderSuspenseLoader />}><CancelOrderPage /></Suspense>} />
                <Route path="/profile" element={<Suspense fallback={<SuspenseLoader />}><ProfilePage /></Suspense>} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/dashboard" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminDashboardPage /></Suspense>} />
                <Route path="/dashboard/charges" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminChargesPage /></Suspense>} />
                <Route path="/dashboard/edit-contact" element={<Suspense fallback={<AdminSuspenseLoader />}><EditContactPage /></Suspense>} />
                <Route path="/dashboard/categories" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminCategoriesPage /></Suspense>} />
                <Route path="/dashboard/orders" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminOrdersPage /></Suspense>} />
                <Route path="/dashboard/orders/:orderId" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminOrderDetailPage /></Suspense>} />
                <Route path="/dashboard/orders/:orderId/delete" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminDeleteOrderPage /></Suspense>} />
                <Route path="/dashboard/products" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminProductsPage /></Suspense>} />
                <Route path="/dashboard/products/add" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminAddProductPage /></Suspense>} />
                <Route path="/dashboard/products/edit/:id" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminEditProductPage /></Suspense>} />
                <Route path="/dashboard/products/:id/delete" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminDeleteProductPage /></Suspense>} />
                <Route path="/dashboard/local-search" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminLocalSearchPage /></Suspense>} />
                <Route path="/dashboard/edit-home" element={<Suspense fallback={<AdminSuspenseLoader />}><EditHomePage /></Suspense>} />
                <Route path="/dashboard/edit-home/component/:componentId" element={<Suspense fallback={<AdminSuspenseLoader />}><EditDynamicComponentPage /></Suspense>} />
                <Route path="/dashboard/edit-home/image-component/:componentId" element={<Suspense fallback={<AdminSuspenseLoader />}><EditImageComponentPage /></Suspense>} />
                <Route path="/dashboard/edit-home/multi-image-component/:componentId" element={<Suspense fallback={<AdminSuspenseLoader />}><EditMultiImageComponentPage /></Suspense>} />
                <Route path="/dashboard/edit-home/hero-component/:componentId" element={<Suspense fallback={<AdminSuspenseLoader />}><EditHeroComponentPage /></Suspense>} />
                <Route path="/dashboard/edit-home/:componentId/delete" element={<Suspense fallback={<AdminSuspenseLoader />}><AdminDeleteHomePageComponent /></Suspense>} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
                <div className="bg-white border border-border shadow-sm rounded-3xl p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
                  <h1 className="text-2xl font-bold text-foreground">Sorry we couldn't find that page</h1>
                  <Link 
                    to="/" 
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
                  >
                    GO BACK TO HOME
                  </Link>
                </div>
              </div>
            } />
          </Routes>
          </ErrorBoundary>
        </main>
      </div>
      </LocalSearchProvider>
      </SWRConfig>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
