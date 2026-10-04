import { 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Map a Firebase Auth User to our application UserProfile
export async function getOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'Citizen',
        email: data.email || fbUser.email || 'citizen@prithvex.org',
        city: data.city || 'Bengaluru',
        joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
        isLoggedIn: true,
        stats: data.stats || INITIAL_USER_PROFILE.stats,
        badges: data.badges || INITIAL_USER_PROFILE.badges,
        recentActivity: data.recentActivity || INITIAL_USER_PROFILE.recentActivity,
      };
    } else {
      // First-time signup: Create initial document in Firestore
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Eco Citizen'),
        email: fbUser.email || 'citizen@prithvex.org',
        city: 'Bengaluru',
        joinedDate: new Date().toISOString().split('T')[0],
        isLoggedIn: true,
        stats: INITIAL_USER_PROFILE.stats,
        badges: INITIAL_USER_PROFILE.badges,
        recentActivity: INITIAL_USER_PROFILE.recentActivity,
      };

      await setDoc(userRef, {
        uid: fbUser.uid,
        name: newProfile.name,
        email: newProfile.email,
        city: newProfile.city,
        joinedDate: newProfile.joinedDate,
        role: 'citizen',
        stats: newProfile.stats,
        badges: newProfile.badges,
        recentActivity: newProfile.recentActivity,
      });

      return newProfile;
    }
  } catch (error) {
    console.warn('Firestore profile lookup error:', error);
    // Return fallback profile if offline
    return {
      ...INITIAL_USER_PROFILE,
      id: fbUser.uid,
      name: fbUser.displayName || 'Citizen',
      email: fbUser.email || 'citizen@prithvex.org',
      isLoggedIn: true,
    };
  }
}

/**
 * Sign in using Firebase Google Auth Popup
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return await getOrCreateUserProfile(credential.user);
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign in as demo citizen (Anonymous Firebase Auth)
 */
export async function loginAsDemo(): Promise<UserProfile> {
  try {
    const credential = await signInAnonymously(auth);
    return await getOrCreateUserProfile(credential.user);
  } catch (error: any) {
    console.error('Demo Sign-In Error:', error);
    // Fallback in-memory
    return {
      ...INITIAL_USER_PROFILE,
      id: 'demo-citizen',
      name: 'Demo Citizen',
      isLoggedIn: true,
    };
  }
}

/**
 * Sign out of Firebase Auth
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

/**
 * Listen to real-time Firebase Auth state changes
 */
export function subscribeToAuth(callback: (profile: UserProfile | null) => void): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await getOrCreateUserProfile(fbUser);
      callback(profile);
    } else {
      callback(null);
    }
  });
}
