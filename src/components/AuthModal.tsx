import React, { useState } from 'react';
import { X, UserCircle2, MapPin, CheckCircle2, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { loginWithGoogle, loginAsDemo, logoutUser } from '../services/authService';
import { saveUserProfile } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onShowToast
}) => {
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const profile = await loginWithGoogle();
      onUserChange(profile);
      onShowToast(`Signed in with Google as ${profile.name}!`, 'success');
      onClose();
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        onShowToast(error?.message || 'Google Sign-In failed. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    try {
      const profile = await loginAsDemo();
      onUserChange(profile);
      onShowToast('Signed in via Firebase Anonymous Auth!', 'success');
      onClose();
    } catch (error: any) {
      onShowToast('Demo sign-in failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logoutUser();
      onUserChange({
        ...currentUser,
        isLoggedIn: false,
      });
      onShowToast('Logged out of Firebase Auth.', 'info');
      onClose();
    } catch (error) {
      onShowToast('Sign out error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityUpdate = async () => {
    const updated: UserProfile = {
      ...currentUser,
      city,
    };
    await saveUserProfile(updated);
    onUserChange(updated);
    onShowToast(`Location updated to ${city}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {currentUser.isLoggedIn ? 'Citizen Account' : 'Firebase Authentication'}
              </h3>
              <p className="text-xs text-emerald-200">
                {currentUser.isLoggedIn ? 'Synced with Firebase Firestore' : 'Secure cloud persistence & civic records'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser.isLoggedIn ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{currentUser.name}</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      Firebase Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Member since {new Date(currentUser.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* City Setting */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default City (For Recycler Matching & Municipal Wards)
                </label>
                <div className="flex gap-2">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi-NCR">Delhi-NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                  <button
                    onClick={handleCityUpdate}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xl font-black text-emerald-700">{currentUser.stats.itemsIdentified}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Items Classified</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xl font-black text-teal-700">{currentUser.stats.wasteDivertedKg} kg</p>
                  <p className="text-[10px] text-slate-500 font-medium">Waste Diverted</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Sign Out</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Sign in with Firebase to synchronize your waste diversion records, submit municipal black-spot tickets, and interact on the community wall.
                </p>
              </div>

              {/* Primary Google Login Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  or quick testing
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Demo Sign In Button */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Sign In (Demo Citizen)</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Protected by Firebase Authentication & Firestore Security Rules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
