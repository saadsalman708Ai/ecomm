import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import type { User } from '../../types/user';

export const getUserDoc = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};

export const createUserDoc = async (userId: string, email: string) => {
  const newUser: Omit<User, 'id'> = {
    email,
    role: 'user', // default role
    savedInfo: null,
    createdAt: Date.now()
  };
  await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser);
  return { id: userId, ...newUser } as User;
};
