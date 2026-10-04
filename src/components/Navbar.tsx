import React, { useState } from 'react';
import { 
  Sparkles, 
  Recycle, 
  Search, 
  MapPin, 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  Info, 
  Menu, 
  X, 
  ShieldAlert, 
  UserCircle2, 
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  user,
  onOpenAuth,
  isAdmin,
  onToggleAdmin,
  hasGeminiKey
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Recycle },
    { id: 'identify', label: 'Identify Waste', icon: Sparkles, highlight: true },
    { id: 'search', label: 'What Should I Do?', icon: Search },
    { id: 'recyclers', label: 'Find Recyclers', icon: MapPin },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro banner for Indian SWM awareness */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-200">Swachh Bharat & SWM Rules 2016 Compliant</span>
            <span className="hidden md:inline text-emerald-400/80">| Responsible Waste Segregation Platform for India</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* AI API Status pill */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-emerald-200/90 hidden sm:inline">AI Engine:</span>
              <span className={`font-mono px-1.5 py-0.2 rounded text-[11px] ${
                hasGeminiKey ? 'bg-emerald-800 text-emerald-100' : 'bg-amber-900/80 text-amber-200'
              }`}>
                {hasGeminiKey ? 'Gemini 3.8 Flash' : 'Demo Classifier Mode'}
              </span>
            </div>

            {/* Admin portal toggle */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isAdmin 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
              }`}
              title="Toggle Hackathon Admin/Moderator Review Portal"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>{isAdmin ? 'Admin View Active' : 'Judge / Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Prithve<span className="text-emerald-600">X</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  INDIA
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 -mt-0.5">
                Segregate • Recycle • Restore
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`ml-2 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-emerald-700/25 ring-2 ring-emerald-600/30'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-sm border border-emerald-200/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Quick Action & User Auth */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('report')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                currentTab === 'report'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'text-rose-700 border-rose-200 bg-rose-50/50 hover:bg-rose-100/70'
              }`}
            >
              Report Issue
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50 hover:bg-white text-xs font-medium transition-all"
            >
              <UserCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="max-w-[100px] truncate">{user.isLoggedIn ? user.name : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('identify')}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700"
              title="Identify Waste"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="pb-2 border-b border-slate-100 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCircle2 className="w-5 h-5 text-emerald-600" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">{user.isLoggedIn ? user.name : 'Guest User'}</p>
                <p className="text-slate-500 text-[10px]">{user.city || 'India'}</p>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="text-xs text-emerald-700 font-semibold underline"
            >
              {user.isLoggedIn ? 'Manage Account' : 'Sign In'}
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    AI
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
            <button
              onClick={() => handleNavClick('report')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50"
            >
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Report Waste Dumping Issue</span>
            </button>

            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>{isAdmin ? 'Exit Admin View' : 'Open Admin / Moderator View'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
