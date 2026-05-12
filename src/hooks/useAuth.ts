import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { getUserDoc, createUserDoc } from '../lib/firebase/firestore';
import { useUserStore } from '../store/userStore';

export const useAuth = () => {
  const { currentUser, setUser, isAdmin } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let userDoc = await getUserDoc(firebaseUser.uid);
          if (!userDoc && firebaseUser.email) {
            userDoc = await createUserDoc(firebaseUser.uid, firebaseUser.email);
          }
          setUser(userDoc);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return { user: currentUser, isAdmin, loading };
};
