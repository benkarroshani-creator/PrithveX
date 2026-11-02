import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ShieldAlert, 
  User, 
  Compass,
  MapPin
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
    { id: 'home', label: 'Overview' },
    { id: 'map', label: 'Circularity Map', highlight: true },
    { id: 'search', label: 'Waste Database' },
    { id: 'recyclers', label: 'Recyclers' },
    { id: 'buyers', label: 'Waste Buyers' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'report', label: 'Civic Grievance' },
    { id: 'community', label: 'Community' },
    { id: 'learn', label: 'Guides' },
    { id: 'dashboard', label: 'Impact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E8EF]">
      {/* Top Utility Bar: Operational context & compliance */}
      <div className="bg-[#111C2E] text-[#E3E8EF] text-xs py-1.5 px-4 border-b border-[#253247]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold tracking-tight">CPCB & SWM Rules Compliant</span>
            <span aria-hidden="true" className="text-[#718096]">·</span>
            <span className="hidden sm:inline text-[#E3E8EF]">Better Waste Decisions. Sustainable Action.</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${hasGeminiKey ? 'bg-[#19B5A5]' : 'bg-[#E8A84E]'}`} />
              <span className="text-[#718096] text-[10px] hidden md:inline">Classifier:</span>
              <span className="text-[#E3E8EF] text-[10px]">
                {hasGeminiKey ? 'Gemini 3.8 Flash' : 'Rule Engine'}
              </span>
            </div>

            <span aria-hidden="true" className="text-[#253247]">|</span>

            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-colors ${
                isAdmin 
                  ? 'bg-[#E8A84E] text-[#111C2E] font-bold' 
                  : 'text-[#E3E8EF] hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Hackathon Admin / Zonal Officer Portal"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Portal Active' : 'Judge / Officer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111C2E] text-white flex items-center justify-center font-black text-sm tracking-tight group-hover:bg-[#253247] transition-colors shadow-sm">
              P
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#111C2E]">
                Prithve<span className="text-[#19B5A5]">X</span>
              </span>
            </div>
          </div>

          {/* Nav Links Zone (Desktop) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs tracking-tight transition-colors py-1 relative flex items-center gap-1 ${
                    isActive 
                      ? 'text-[#111C2E] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#111C2E]' 
                      : item.highlight
                      ? 'text-[#19B5A5] font-bold hover:text-[#138D81]'
                      : 'text-[#718096] font-semibold hover:text-[#111C2E]'
                  }`}
                >
                  {item.highlight && <Compass className="w-3.5 h-3.5 text-[#19B5A5]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Map Shortcut button for tablets */}
            <button
              onClick={() => handleNavClick('map')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                currentTab === 'map'
                  ? 'bg-[#111C2E] text-white border-[#111C2E]'
                  : 'bg-white border-[#E3E8EF] text-[#253247] hover:border-[#19B5A5] hover:text-[#19B5A5]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#19B5A5]" />
              <span>Circularity Map</span>
            </button>

            {/* Primary Action Button: Identify Waste */}
            <button
              onClick={() => handleNavClick('identify')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                currentTab === 'identify'
                  ? 'bg-[#111C2E] text-white'
                  : 'bg-[#19B5A5] hover:bg-[#138D81] text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identify Waste</span>
            </button>

            {/* User Account / Auth Trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3E8EF] text-xs font-semibold text-[#253247] hover:border-[#111C2E] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#718096]" />
              <span>{user.isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('map')}
              className="p-1.5 rounded-lg bg-[#E7F8F6] text-[#138D81] border border-[#19B5A5]"
              title="Circularity Map"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavClick('identify')}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#19B5A5] text-white"
            >
              Identify
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#253247] hover:text-[#111C2E] hover:bg-[#F4F6F8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E3E8EF] bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between ${
                currentTab === item.id 
                  ? 'bg-[#111C2E] text-white' 
                  : item.highlight
                  ? 'bg-[#E7F8F6] text-[#138D81]'
                  : 'text-[#253247] hover:bg-[#F4F6F8]'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.highlight && <Compass className="w-3.5 h-3.5 text-[#19B5A5]" />}
                {item.label}
              </span>
              {item.highlight && (
                <span className="text-[10px] bg-[#19B5A5] text-white px-2 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E3E8EF] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#253247] px-3 py-2 hover:underline"
            >
              {user.isLoggedIn ? `Account (${user.name})` : 'Citizen Sign In'}
            </button>
            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#E8A84E] font-bold px-3 py-2"
            >
              {isAdmin ? 'Exit Admin' : 'Admin Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
