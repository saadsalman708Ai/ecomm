import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import { useUserStore } from '../../../store/userStore';
import { useAuth } from '../../../hooks/useAuth';
import { ProceedForm } from '../../../components/proceed/ProceedForm';
import { DeliveryCharges } from '../../../components/proceed/DeliveryCharges';
import { OrderTotal } from '../../../components/proceed/OrderTotal';
import { PlaceOrderConfirmButton } from '../../../components/proceed/PlaceOrderConfirmButton';
import { calculateDeliveryCharges } from '../../../utils/deliveryCharges';
import type { OrderUserInfo, OrderItem } from '../../../types/order';
import { doc, getDoc, setDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { formatPrice } from '../../../utils/formatPrice';
import { useCheckoutStore } from '../../../store/checkoutStore';

export default function ProceedPage() {
  const { items, removeSelectedItems } = useCartStore();
  const { user } = useAuth();
  const { savedInfo, setSavedInfo } = useCheckoutStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockError, setStockError] = useState(false);
  const [deliveryChargePerItem, setDeliveryChargePerItem] = useState(226);
  
  const selectedItems = items.filter((i) => i.isSelected ?? true);

  const [info, setInfo] = useState<OrderUserInfo>(savedInfo);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.CONFIG, 'storeConfig'));
        if (snap.exists() && snap.data().deliveryChargePerItem !== undefined) {
          setDeliveryChargePerItem(snap.data().deliveryChargePerItem);
        }
      } catch (err) {
         console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const isValid = Boolean(info.fullName.trim() && info.phone.trim() && info.city && info.area && info.address.trim());

  const subtotal = selectedItems.reduce((sum, item) => sum + ((item.salePrice ?? item.price) * item.quantity), 0);
  const deliveryCharges = calculateDeliveryCharges(selectedItems.length, deliveryChargePerItem); 

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !user) return;
    
    setLoading(true);
    setError('');

    try {
      const checks = await Promise.all(selectedItems.map(async (item) => {
          const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
          const snap = await getDoc(productRef);
          if (snap.exists()) {
             const data = snap.data();
             return { productId: item.productId, maxStock: data.quantity || 0 };
          }
          return { productId: item.productId, maxStock: 0 };
      }));

      const hasStockError = checks.some(c => {
         const item = selectedItems.find(i => i.productId === c.productId);
         return item && c.maxStock < item.quantity;
      });

      if (hasStockError) {
         useCartStore.getState().syncStockOverrides(checks);
         setStockError(true);
         setLoading(false);
         setTimeout(() => {
            navigate('/cart', { replace: true });
         }, 6000);
         return;
      }

      const newOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const orderItems: OrderItem[] = selectedItems.map(i => ({
        productId: i.productId,
        title: i.title,
        image: i.image,
        price: i.price,
        salePrice: i.salePrice,
        quantity: i.quantity,
        selectedOptions: i.selectedOptions
      }));

      const newOrderInfo = {
        id: newOrderId,
        userId: user.id,
        userInfo: info,
        items: orderItems,
        deliveryCharges,
        totalAmount: subtotal + deliveryCharges,
        status: 'waiting' as const,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        completedAt: null
      };

      const batch = writeBatch(db);
      
      batch.set(doc(db, COLLECTIONS.ORDERS, newOrderId), newOrderInfo);

      // Save user info to local storage
      setSavedInfo(info);

      selectedItems.forEach(item => {
         const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
         batch.update(productRef, { 
           quantity: increment(-item.quantity),
           inOrder: increment(item.quantity)
         });
      });

      await batch.commit();

      removeSelectedItems();
      navigate('/my-orders', { replace: true });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
     return <div className="p-12 text-center text-foreground-muted">No items selected to proceed.</div>;
  }

  return (
    <form onSubmit={handlePlaceOrder} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 flex-1">
      <div className="flex-1 flex flex-col gap-6">
        <ProceedForm info={info} onChange={setInfo} />
      </div>
      
      <div className="w-full md:w-[350px] shrink-0 flex flex-col gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-not-allowed">
            <div className="w-4 h-4 rounded-full border-[4px] border-primary"></div>
            <span className="font-semibold text-primary">Cash on Delivery (COD)</span>
          </div>
        </div>

        {stockError && (
          <div className="bg-yellow-400/20 border border-yellow-500 text-yellow-700 p-4 rounded-xl font-bold text-center shadow-sm">
            *Note: Not enough items in stock!
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border sticky top-20">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Order Summary</h2>
          
          <div className="flex justify-between items-center py-2 text-foreground-muted">
            <span className="text-sm">Subtotal ({selectedItems.length} items)</span>
            <span className="text-sm font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <DeliveryCharges charges={deliveryCharges} perItemCharge={deliveryChargePerItem} itemCount={selectedItems.length} />
          <OrderTotal subtotal={subtotal} deliveryCharges={deliveryCharges} />

          {error && <div className="text-error text-sm font-medium mb-4">{error}</div>}

          <PlaceOrderConfirmButton disabled={!isValid || stockError} loading={loading} />
        </div>

        {stockError && (
          <div className="bg-yellow-400/20 border border-yellow-500 text-yellow-700 p-4 rounded-xl font-bold text-center shadow-sm">
            *Note: Not enough items in stock!
          </div>
        )}
      </div>
    </form>
  );
}
