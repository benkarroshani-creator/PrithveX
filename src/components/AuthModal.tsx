import React, { useState, useEffect } from 'react';
import { X, LogOut, ShieldCheck, AlertTriangle, Copy, Check, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginWithGoogle,
  loginWithGoogleRedirect,
  loginAsDemo,
  logoutUser,
  formatFirebaseAuthError,
  FormattedAuthError,
} from '../services/authService';
import { saveUserProfile } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  initialAuthError?: FormattedAuthError | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onShowToast,
  initialAuthError = null,
}) => {
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<FormattedAuthError | null>(initialAuthError);
  const [copiedDomain, setCopiedDomain] = useState(false);

  useEffect(() => {
    setCity(currentUser.city || 'Bengaluru');
  }, [currentUser.city, isOpen]);

  useEffect(() => {
    if (initialAuthError) {
      setAuthError(initialAuthError);
    } else if (isOpen) {
      setAuthError(null);
    }
  }, [initialAuthError, isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const profile = await loginWithGoogle();
      if (profile) {
        onUserChange(profile);
        onShowToast(`Signed in with Google as ${profile.name}!`, 'success');
        onClose();
      }
      // If null, browser is redirecting to Google OAuth
    } catch (error: any) {
      const formatted = formatFirebaseAuthError(error);
      setAuthError(formatted);
      if (error?.code !== 'auth/popup-closed-by-user') {
        onShowToast(formatted.title, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginWithGoogleRedirect();
    } catch (error: any) {
      const formatted = formatFirebaseAuthError(error);
      setAuthError(formatted);
      onShowToast(formatted.title, 'error');
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const { profile, isFirebaseAnonymous } = await loginAsDemo();
      onUserChange(profile);
      onShowToast(
        isFirebaseAnonymous
          ? 'Signed in via Firebase Anonymous Auth!'
          : 'Signed in in local evaluation mode (Firebase Anonymous Auth disabled).',
        isFirebaseAnonymous ? 'success' : 'info'
      );
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

  const handleCopyDomain = async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedDomain(true);
      onShowToast(`Copied "${domain}" to clipboard`, 'info');
      setTimeout(() => setCopiedDomain(false), 2000);
    } catch {
      onShowToast(`Domain: ${domain}`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {currentUser.isLoggedIn ? 'Citizen Account Profile' : 'Citizen Authentication'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.isLoggedIn
                ? 'Persistent Firestore records & personal stats'
                : 'Sign in to record segregation & civic grievances'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {currentUser.isLoggedIn ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-xs truncate">{currentUser.name}</h4>
                    <span className="text-[10px] text-emerald-700 font-medium">Verified</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Member since {new Date(currentUser.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Default City for Local Recyclers & Ward Routing
                </label>
                <div className="flex gap-2">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-slate-900"
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
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Citizen Stats */}
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-lg font-bold text-slate-900 tabular-nums">{currentUser.stats.itemsIdentified}</p>
                  <p className="text-[11px] text-slate-500">Items Segregated</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-lg font-bold text-slate-900 tabular-nums">{currentUser.stats.wasteDivertedKg} kg</p>
                  <p className="text-[11px] text-slate-500">Waste Diverted</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <button
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign Out</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Sign in with Firebase to record your personal diversion impact, track municipal grievance tickets, and share zero-waste actions.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-semibold text-rose-950">{authError.title}</p>
                      <p className="text-[11px] text-rose-800 leading-relaxed">{authError.message}</p>
                      <p className="text-[10px] font-mono text-rose-600">Code: {authError.code}</p>
                    </div>
                  </div>

                  {authError.isUnauthorizedDomain && authError.domain && (
                    <div className="pt-1.5 border-t border-rose-200/80 space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded border border-rose-200">
                        <code className="text-[11px] font-mono text-slate-800 truncate">{authError.domain}</code>
                        <button
                          type="button"
                          onClick={() => handleCopyDomain(authError.domain)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-950 shrink-0"
                        >
                          {copiedDomain ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0256818664/authentication/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 hover:text-rose-950 underline"
                      >
                        <span>Open Firebase Authorized Domains</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {authError.canTryRedirect && (
                    <button
                      type="button"
                      onClick={handleRedirectSignIn}
                      disabled={isSubmitting}
                      className="w-full py-2 px-3 bg-rose-700 hover:bg-rose-800 text-white rounded-md text-[11px] font-semibold transition-colors"
                    >
                      Try Redirect Sign-In Instead
                    </button>
                  )}
                </div>
              )}

              {/* Google Login */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium shadow-2xs flex items-center justify-center gap-3 transition-colors"
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
                <span>{isSubmitting ? 'Signing in...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase tracking-wider">
                  or evaluation mode
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Demo Sign In */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 rounded-lg text-xs font-medium transition-colors"
              >
                Instant Demo Citizen (Evaluation Mode)
              </button>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Protected by Firebase Firestore Security Rules
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
