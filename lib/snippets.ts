import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Snippet } from './types'

export async function createSnippet(
  userId: string,
  data: Omit<Snippet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'snippets'), {
      ...data,
      userId,
      isFavorite: data.isFavorite || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export async function getUserSnippets(userId: string): Promise<Snippet[]> {
  try {
    const q = query(
      collection(db, 'snippets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Snippet))
  } catch (error) {
    throw error
  }
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  try {
    const docRef = doc(db, 'snippets', id)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: snapshot.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Snippet
  } catch (error) {
    throw error
  }
}

export async function updateSnippet(id: string, data: Partial<Omit<Snippet, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
  try {
    const docRef = doc(db, 'snippets', id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw error
  }
}

export async function deleteSnippet(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'snippets', id))
  } catch (error) {
    throw error
  }
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'snippets', id)
    await updateDoc(docRef, {
      isFavorite: !isFavorite,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw error
  }
}
