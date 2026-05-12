import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../lib/firebase/collections';
import { Product } from '../types/product';

interface LocalSearchContextType {
  enabled: boolean;
  products: Product[];
  loading: boolean;
}

const LocalSearchContext = createContext<LocalSearchContextType>({
  enabled: false,
  products: [],
  loading: true,
});

export const useLocalSearch = () => useContext(LocalSearchContext);

export const LocalSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeProducts: (() => void) | undefined;

    const init = async () => {
      try {
        const settingsRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.APP_SETTINGS);
        const settingsSnap = await getDoc(settingsRef);
        
        const isLocalSearchEnabled = settingsSnap.exists() && settingsSnap.data().localSearchEnabled;
        
        if (isMounted) {
          setEnabled(isLocalSearchEnabled);
        }

        if (isLocalSearchEnabled) {
          // fetch all products and listen to only deltas! (perfect offline persistence syncing)
          const colRef = collection(db, COLLECTIONS.PRODUCTS);
          unsubscribeProducts = onSnapshot(colRef, { includeMetadataChanges: true }, (snapshot) => {
            if (!isMounted) return;
            const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(allProducts);
            setLoading(false);
          }, (err) => {
            console.error("Local search sync error:", err);
            if (isMounted) setLoading(false);
          });
        } else {
          if (isMounted) setLoading(false);
        }

      } catch (err) {
        console.error("Error setting up local search:", err);
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => { 
      isMounted = false; 
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);

  return (
    <LocalSearchContext.Provider value={{ enabled, products, loading }}>
      {children}
    </LocalSearchContext.Provider>
  );
};

