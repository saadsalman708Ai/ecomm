import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../../lib/firebase/collections';
import { AdminSuspenseLoader } from '../../../../components/shared/AdminSuspenseLoader';

export default function AdminChargesPage() {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(226);
  const [savingSettings, setSavingSettings] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.STORE_CONFIG));
        if (snap.exists() && snap.data().deliveryChargePerItem !== undefined) {
          setDeliveryCharge(snap.data().deliveryChargePerItem);
        }
      } catch (err) {
         console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage('');
    try {
      await setDoc(doc(db, COLLECTIONS.CONFIG, DOCUMENTS.STORE_CONFIG), { deliveryChargePerItem: deliveryCharge }, { merge: true });
      setMessage('Delivery charges saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save delivery charges.');
    } finally {
      setSavingSettings(false);
    }
  };
  
  if (loading) return <AdminSuspenseLoader />;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Delivery Charges</h1>
      
      <form onSubmit={handleSaveConfig} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Per Item Delivery Charge (PKR)</label>
          <input 
             required type="number" min="0" value={deliveryCharge} onChange={e => setDeliveryCharge(parseInt(e.target.value) || 0)}
             className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-foreground-muted mt-2">
            This amount will be multiplied by the number of unique items in the customer's cart during checkout.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button type="submit" disabled={savingSettings} className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
             {savingSettings ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span className={`text-sm font-medium ${message.includes('success') ? 'text-success' : 'text-error'}`}>{message}</span>}
        </div>
      </form>
    </div>
  );
}
