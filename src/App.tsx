/**
 * PrithveX - Intelligent Waste Segregation & Circular Disposal Platform
 * "Better Waste Decisions. Sustainable Action."
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastData } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { IdentifyPage } from './pages/IdentifyPage';
import { WhatToDoPage } from './pages/WhatToDoPage';
import { RecyclersPage } from './pages/RecyclersPage';
import { BuyersPage } from './pages/BuyersPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { LearnPage } from './pages/LearnPage';
import { CommunityPage } from './pages/CommunityPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { CircularityMapPage } from './pages/CircularityMapPage';

import { checkAiHealth } from './services/aiClassifier';
import { 
  getCommunityPosts, 
  getReports, 
  getUserProfile, 
  incrementUserStat, 
  recordUserActivity,
  subscribeToCommunityPosts,
  subscribeToReports,
  subscribeToUserProfile
} from './services/storageService';
import { subscribeToAuth } from './services/authService';
import { ClassificationResult, CommunityPost, ReportIssue, UserProfile, WasteItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchParam, setSearchParam] = useState<string>('');
  const [categoryFilterParam, setCategoryFilterParam] = useState<string>('all');

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getUserProfile());
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [reports, setReports] = useState<ReportIssue[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Check server health on mount & wire Firebase real-time listeners
  useEffect(() => {
    checkAiHealth().then((health) => {
      setHasGeminiKey(health.hasGeminiKey);
    });

    // Initial cache values
    setPosts(getCommunityPosts());
    setReports(getReports());
    setCurrentUser(getUserProfile());

    // 1. Subscribe to Firebase Auth
    const unsubAuth = subscribeToAuth((profile) => {
      if (profile) {
        setCurrentUser(profile);
      } else {
        setCurrentUser((prev) => ({
          ...prev,
          isLoggedIn: false,
        }));
      }
    });

    // 2. Subscribe to real-time Firestore Community Posts
    const unsubPosts = subscribeToCommunityPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });

    // 3. Subscribe to real-time Firestore Waste Reports
    const unsubReports = subscribeToReports((updatedReports) => {
      setReports(updatedReports);
    });

    return () => {
      unsubAuth();
      unsubPosts();
      unsubReports();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (tab: string, filter?: string) => {
    setCurrentTab(tab);
    if (tab === 'search' && filter) {
      setSearchParam(filter);
    }
    if ((tab === 'recyclers' || tab === 'buyers') && filter) {
      setCategoryFilterParam(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogItem = (item: WasteItem) => {
    incrementUserStat('itemsSegregated', 1);
    recordUserActivity(`Segregated ${item.name}`, `Placed in ${item.binName} for ${item.primaryPathway}`);
    setCurrentUser(getUserProfile());
    showToast(`Logged "${item.name}" to your diversion dashboard (+0.35kg diverted)!`, 'success');
  };

  const handleLogClassification = (result: ClassificationResult) => {
    incrementUserStat('itemsIdentified', 1);
    recordUserActivity(`AI Identified ${result.itemName}`, `Assigned to ${result.binName} (${result.primaryPathway})`);
    setCurrentUser(getUserProfile());
  };

  const refreshPosts = () => {
    setPosts(getCommunityPosts());
  };

  const refreshReports = () => {
    setReports(getReports());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          if (!isAdmin) {
            setCurrentTab('admin');
            showToast('Switched to Circularity Operations Desk', 'info');
          } else {
            setCurrentTab('home');
          }
        }}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectSearchItem={(item) => handleNavigate('search', item.name)}
            onLogItem={handleLogItem}
          />
        )}

        {currentTab === 'map' && (
          <CircularityMapPage
            reports={reports}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onShowToast={showToast}
            initialCategory={categoryFilterParam !== 'all' ? categoryFilterParam : undefined}
          />
        )}

        {currentTab === 'identify' && (
          <IdentifyPage
            onNavigate={handleNavigate}
            onLogClassification={handleLogClassification}
            hasGeminiKey={hasGeminiKey}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'search' && (
          <WhatToDoPage
            initialSearch={searchParam}
            onNavigate={handleNavigate}
            onLogItem={handleLogItem}
          />
        )}

        {currentTab === 'recyclers' && (
          <RecyclersPage
            initialCategory={categoryFilterParam}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'buyers' && (
          <BuyersPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'marketplace' && (
          <MarketplacePage onNavigate={handleNavigate} />
        )}

        {currentTab === 'learn' && (
          <LearnPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'community' && (
          <CommunityPage
            posts={posts}
            onRefreshPosts={refreshPosts}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'report' && (
          <ReportIssuePage
            reports={reports}
            onRefreshReports={refreshReports}
            currentUser={currentUser}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            user={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            posts={posts}
            reports={reports}
            onRefreshData={() => {
              refreshPosts();
              refreshReports();
            }}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={(updated) => setCurrentUser(updated)}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
