import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Building2,
  FileText,
  Store,
  Coins,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { CommunityPost, ReportIssue, Recycler, MarketplaceListing, DirectoryCorrection } from '../types';
import { 
  updatePostModerationStatus, 
  updateReportStatus, 
  getMarketplaceListings,
  subscribeToMarketplaceListings,
  updateMarketplaceListingStatus,
  getDirectoryCorrections,
  subscribeToDirectoryCorrections,
  updateDirectoryCorrectionStatus
} from '../services/storageService';
import { RECYCLERS } from '../data/recyclers';

interface AdminPageProps {
  posts: CommunityPost[];
  reports: ReportIssue[];
  onRefreshData: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  posts,
  reports,
  onRefreshData,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'reports' | 'marketplace' | 'corrections' | 'recyclers'>('moderation');
  const [assignWardText, setAssignWardText] = useState<{ [reportId: string]: string }>({});
  const [notesText, setNotesText] = useState<{ [reportId: string]: string }>({});

  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(getMarketplaceListings());
  const [corrections, setCorrections] = useState<DirectoryCorrection[]>(getDirectoryCorrections());

  useEffect(() => {
    const unsubMarket = subscribeToMarketplaceListings((loaded) => setMarketplaceListings(loaded));
    const unsubCorr = subscribeToDirectoryCorrections((loaded) => setCorrections(loaded));
    return () => {
      unsubMarket();
      unsubCorr();
    };
  }, []);

  const pendingPosts = posts.filter((p) => p.status === 'Pending review');
  const pendingCorrections = corrections.filter((c) => c.status === 'pending');

  const handleApprovePost = async (id: string) => {
    await updatePostModerationStatus(id, 'Approved');
    onRefreshData();
    onShowToast('Community post approved and published to Firestore!', 'success');
  };

  const handleRejectPost = async (id: string) => {
    await updatePostModerationStatus(id, 'Rejected');
    onRefreshData();
    onShowToast('Community post rejected.', 'info');
  };

  const handleAdvanceReport = async (report: ReportIssue) => {
    let nextStatus: ReportIssue['status'] = 'Under review';
    if (report.status === 'Submitted') nextStatus = 'Under review';
    else if (report.status === 'Under review') nextStatus = 'Assigned';
    else if (report.status === 'Assigned') nextStatus = 'Resolved';

    const ward = assignWardText[report.id] || report.assignedWard || 'Ward Sanitation Zonal Unit 4';
    const notes = notesText[report.id] || report.resolutionNotes || 'Inspected and verified by zonal sanitation desk.';

    await updateReportStatus(report.id, nextStatus, ward, notes);
    onRefreshData();
    onShowToast(`Report #${report.id} advanced to ${nextStatus} in Firestore!`, 'success');
  };

  const handleUpdateListingStatus = async (id: string, status: MarketplaceListing['status']) => {
    await updateMarketplaceListingStatus(id, status);
    onShowToast(`Listing status updated to ${status}.`, 'success');
  };

  const handleUpdateCorrection = async (id: string, status: 'verified' | 'rejected') => {
    await updateDirectoryCorrectionStatus(id, status);
    onShowToast(`Correction marked as ${status}.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Console Header */}
      <div className="bg-[#111C2E] text-white rounded-2xl p-6 sm:p-7 border border-[#253247] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8A84E]">
            <ShieldAlert className="w-4 h-4" />
            <span>CIRCULARITY OPERATIONS & VERIFICATION DESK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
            Circularity Operations Desk
          </h1>
          <p className="text-xs text-[#E3E8EF] mt-0.5 max-w-xl">
            Review citizen sustainability stories, resolve municipal grievance tickets, audit marketplace transactions, and verify facility directory corrections.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap rounded-lg p-1 bg-slate-900 border border-slate-800 text-xs gap-1">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'moderation' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stories ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'reports' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Grievances ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'marketplace' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Marketplace ({marketplaceListings.length})
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'corrections' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Corrections ({pendingCorrections.length})
          </button>
          <button
            onClick={() => setActiveTab('recyclers')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'recyclers' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recyclers ({RECYCLERS.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Community Post Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Citizen Posts Awaiting Verification ({pendingPosts.length})
            </h2>
            <button
              onClick={onRefreshData}
              className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Firestore</span>
            </button>
          </div>

          {pendingPosts.length > 0 ? (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-5 border border-slate-300 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{post.authorName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{post.authorCity}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{post.type}</span>
                    </div>
                    <span>{post.createdAt}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{post.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleRejectPost(post.id)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition-colors"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 border border-slate-200 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-medium text-slate-900">Moderation Queue Clear</p>
              <p className="text-slate-500 mt-0.5">All citizen stories have been reviewed.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Municipal Grievance Redressal */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Municipal Waste Tickets ({reports.length})
            </h2>
            <button
              onClick={onRefreshData}
              className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Firestore</span>
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-slate-500">
                      <span>Ticket #{report.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.submittedAt}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{report.issueType}</h3>
                    <p className="text-slate-600">{report.location.locality}, {report.location.city}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded border font-mono text-[11px] font-semibold bg-slate-50 text-slate-800 border-slate-300">
                    Status: {report.status}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">{report.description}</p>

                {/* Ward assignment & inspector notes controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Assigned Ward / Zonal Sanitation Unit
                    </label>
                    <input
                      type="text"
                      value={assignWardText[report.id] ?? report.assignedWard ?? ''}
                      onChange={(e) =>
                        setAssignWardText({
                          ...assignWardText,
                          [report.id]: e.target.value,
                        })
                      }
                      placeholder="e.g. Ward Sanitation Unit 14 - Indiranagar"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111C2E] mb-1">
                      Sanitation Desk Verification Notes
                    </label>
                    <input
                      type="text"
                      value={notesText[report.id] ?? report.resolutionNotes ?? ''}
                      onChange={(e) =>
                        setNotesText({
                          ...notesText,
                          [report.id]: e.target.value,
                        })
                      }
                      placeholder="e.g. Site cleared by compactors on morning shift."
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-slate-900"
                    />
                  </div>
                </div>

                {/* Status lifecycle advancement */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Reporter: {report.reporterName || 'Citizen'} ({report.reporterContact || 'Contact on file'})
                  </div>

                  {report.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleAdvanceReport(report)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>
                        Advance Status to{' '}
                        {report.status === 'Submitted'
                          ? 'Under Review'
                          : report.status === 'Under review'
                          ? 'Assigned'
                          : 'Resolved'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Case Closed & Cleared</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Marketplace Moderation */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Active Marketplace Listings ({marketplaceListings.length})
            </h2>
            <span className="text-xs text-slate-500">P2P Fair Trade Supervision</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3.5">Listing Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {marketplaceListings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900">{l.title}</td>
                    <td className="p-3.5 uppercase font-bold text-[10px] text-slate-600">{l.type}</td>
                    <td className="p-3.5">{l.quantity} {l.unit}</td>
                    <td className="p-3.5">{l.city} ({l.locality})</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        l.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {l.status === 'available' && (
                        <button
                          onClick={() => handleUpdateListingStatus(l.id, 'completed')}
                          className="px-2 py-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-medium"
                        >
                          Mark Completed
                        </button>
                      )}
                      {l.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateListingStatus(l.id, 'cancelled')}
                          className="px-2 py-1 text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-800 rounded font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Directory Corrections */}
      {activeTab === 'corrections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Community Directory Corrections & New Submissions ({corrections.length})
            </h2>
          </div>

          {corrections.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-slate-200 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-medium text-slate-900">No Pending Suggestions</p>
              <p className="text-slate-500 mt-0.5">Citizen directory feedback will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {corrections.map((corr) => (
                <div key={corr.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wide bg-slate-100 px-2 py-0.5 rounded mr-2">
                        {corr.targetType}
                      </span>
                      <span className="font-bold text-slate-900">{corr.targetName}</span>
                      <span className="text-slate-500 ml-2">({corr.city}, {corr.state})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      corr.status === 'verified' ? 'bg-emerald-50 text-emerald-800' : corr.status === 'rejected' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {corr.status}
                    </span>
                  </div>

                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {corr.notes}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">Contact: {corr.reporterContact || 'Anonymous citizen'}</span>
                    {corr.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCorrection(corr.id, 'rejected')}
                          className="px-3 py-1 border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateCorrection(corr.id, 'verified')}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium"
                        >
                          Verify & Update Directory
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Recycler Verification Audits */}
      {activeTab === 'recyclers' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              State Pollution Control Board Authorized Facilities ({RECYCLERS.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">CPCB Schedule 1 Audit</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3.5">Facility Name</th>
                  <th className="p-3.5">City Hub</th>
                  <th className="p-3.5">Materials Handled</th>
                  <th className="p-3.5">Logistics</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {RECYCLERS.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900">{r.name}</td>
                    <td className="p-3.5">{r.city}</td>
                    <td className="p-3.5">{r.acceptedCategories.map((c) => c.replace('_', ' ')).join(', ')}</td>
                    <td className="p-3.5">{r.collectionMethods.join(', ')}</td>
                    <td className="p-3.5">
                      {r.isVerified ? (
                        <span className="text-teal-700 font-medium">SPCB Verified</span>
                      ) : (
                        <span className="text-slate-400">Aggregator</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
