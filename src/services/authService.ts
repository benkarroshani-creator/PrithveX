import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { setCachedUserProfile } from './storageService';
import { UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface FormattedAuthError {
  code: string;
  title: string;
  message: string;
  isUnauthorizedDomain: boolean;
  canTryRedirect: boolean;
  domain: string;
}

const inFlightProfileLookups = new Map<string, Promise<UserProfile>>();

function isRunningInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}

export function formatFirebaseAuthError(error: any): FormattedAuthError {
  const code = String(error?.code || 'auth/unknown');
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';

  switch (code) {
    case 'auth/unauthorized-domain':
      return {
        code,
        title: 'Live Domain Not Authorized in Firebase',
        message: `Firebase blocked sign-in because "${domain}" is not in your Firebase Authentication Authorized Domains list. Add "${domain}" in Firebase Console → Authentication → Settings → Authorized domains.`,
        isUnauthorizedDomain: true,
        canTryRedirect: false,
        domain,
      };
    case 'auth/popup-blocked':
      return {
        code,
        title: 'Sign-In Popup Was Blocked',
        message: 'Your browser blocked the Google sign-in popup. Allow popups for this site or use Redirect Sign-In below.',
        isUnauthorizedDomain: false,
        canTryRedirect: !isRunningInIframe(),
        domain,
      };
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        code,
        title: 'Sign-In Window Closed',
        message: 'The Google sign-in window was closed before completing authentication. Please try again or use Redirect Sign-In.',
        isUnauthorizedDomain: false,
        canTryRedirect: !isRunningInIframe(),
        domain,
      };
    case 'auth/operation-not-supported-in-this-environment':
      return {
        code,
        title: 'Popup Not Supported Here',
        message: 'This browser environment restricts popup sign-in. Try opening the site directly in Chrome/Safari or use Redirect Sign-In.',
        isUnauthorizedDomain: false,
        canTryRedirect: !isRunningInIframe(),
        domain,
      };
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return {
        code,
        title: 'Sign-In Provider Disabled',
        message: 'This sign-in method is currently disabled in Firebase Console → Authentication → Sign-in method.',
        isUnauthorizedDomain: false,
        canTryRedirect: false,
        domain,
      };
    case 'auth/network-request-failed':
      return {
        code,
        title: 'Network Request Failed',
        message: 'Could not reach Firebase Auth servers. Disable strict ad/tracker blockers for accounts.google.com and try again.',
        isUnauthorizedDomain: false,
        canTryRedirect: false,
        domain,
      };
    default:
      return {
        code,
        title: 'Firebase Sign-In Error',
        message: error?.message || 'Unable to complete Firebase authentication. Please try again.',
        isUnauthorizedDomain: false,
        canTryRedirect: !isRunningInIframe(),
        domain,
      };
  }
}

// Map a Firebase Auth User to our application UserProfile (deduplicated against concurrent calls)
export function getOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const existingPromise = inFlightProfileLookups.get(fbUser.uid);
  if (existingPromise) {
    return existingPromise;
  }

  const lookupPromise = (async (): Promise<UserProfile> => {
    const userRef = doc(db, 'users', fbUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const profile: UserProfile = {
          id: fbUser.uid,
          name: data.name || fbUser.displayName || 'Citizen',
          email: data.email || fbUser.email || 'citizen@prithvex.org',
          city: data.city || 'Bengaluru',
          joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
          isLoggedIn: true,
          stats: data.stats || INITIAL_USER_PROFILE.stats,
          badges: data.badges || INITIAL_USER_PROFILE.badges,
          recentActivity: data.recentActivity || INITIAL_USER_PROFILE.recentActivity,
          savedRecyclerIds: data.savedRecyclerIds || [],
          savedBuyerIds: data.savedBuyerIds || [],
          savedListingIds: data.savedListingIds || [],
          bookmarkedGuideIds: data.bookmarkedGuideIds || [],
        };
        setCachedUserProfile(profile);
        return profile;
      } else {
        const fallbackName = fbUser.isAnonymous
          ? 'Demo Citizen'
          : fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Eco Citizen');

        const newProfile: UserProfile = {
          id: fbUser.uid,
          name: fallbackName,
          email: fbUser.email || 'citizen@prithvex.org',
          city: 'Bengaluru',
          joinedDate: new Date().toISOString().split('T')[0],
          isLoggedIn: true,
          stats: INITIAL_USER_PROFILE.stats,
          badges: INITIAL_USER_PROFILE.badges,
          recentActivity: INITIAL_USER_PROFILE.recentActivity,
          savedRecyclerIds: [],
          savedBuyerIds: [],
          savedListingIds: [],
          bookmarkedGuideIds: [],
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
          savedRecyclerIds: [],
          savedBuyerIds: [],
          savedListingIds: [],
          bookmarkedGuideIds: [],
          recentActivity: newProfile.recentActivity,
        });

        setCachedUserProfile(newProfile);
        return newProfile;
      }
    } catch (error) {
      console.warn('Firestore profile lookup error:', error);
      const fallbackProfile: UserProfile = {
        ...INITIAL_USER_PROFILE,
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.isAnonymous ? 'Demo Citizen' : 'Citizen'),
        email: fbUser.email || 'citizen@prithvex.org',
        isLoggedIn: true,
      };
      setCachedUserProfile(fallbackProfile);
      return fallbackProfile;
    } finally {
      inFlightProfileLookups.delete(fbUser.uid);
    }
  })();

  inFlightProfileLookups.set(fbUser.uid, lookupPromise);
  return lookupPromise;
}

/**
 * Complete any pending redirect sign-in when returning to a live site
 */
export async function checkRedirectSignIn(): Promise<{
  profile: UserProfile | null;
  error?: FormattedAuthError;
}> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const profile = await getOrCreateUserProfile(result.user);
      return { profile };
    }
    return { profile: null };
  } catch (error: any) {
    console.error('Redirect Sign-In Result Error:', error);
    return {
      profile: null,
      error: formatFirebaseAuthError(error),
    };
  }
}

/**
 * Sign in using Firebase Google Auth Popup, with automatic Redirect fallback when popups are blocked on standalone live sites
 */
export async function loginWithGoogle(): Promise<UserProfile | null> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return await getOrCreateUserProfile(credential.user);
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    const shouldAutoRedirect =
      (error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/operation-not-supported-in-this-environment') &&
      !isRunningInIframe();

    if (shouldAutoRedirect) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

/**
 * Explicit Redirect-based Google Sign-In for mobile or strict popup-blocking browsers on live sites
 */
export async function loginWithGoogleRedirect(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
}

/**
 * Sign in as demo citizen (Anonymous Firebase Auth with honest local fallback)
 */
export async function loginAsDemo(): Promise<{ profile: UserProfile; isFirebaseAnonymous: boolean }> {
  try {
    const credential = await signInAnonymously(auth);
    const profile = await getOrCreateUserProfile(credential.user);
    return { profile, isFirebaseAnonymous: true };
  } catch (error: any) {
    console.warn('Anonymous Firebase Auth unavailable, starting local evaluation session:', error?.code || error);
    const localDemo: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: 'demo-citizen',
      name: 'Demo Citizen',
      isLoggedIn: true,
    };
    setCachedUserProfile(localDemo);
    return { profile: localDemo, isFirebaseAnonymous: false };
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
  } finally {
    setCachedUserProfile({
      ...INITIAL_USER_PROFILE,
      isLoggedIn: false,
    });
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
