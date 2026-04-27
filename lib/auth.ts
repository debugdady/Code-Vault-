import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { auth } from './firebase'

export async function signup(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName,
      })
    }

    return userCredential.user
  } catch (error: any) {
    console.log("REAL SIGNUP ERROR:", error.code, error.message, error)
    throw error
  }
}

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.log("REAL LOGIN ERROR:", error.code, error.message, error)
    throw error
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.log("REAL LOGOUT ERROR:", error.code, error.message, error)
    throw error
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback)
}