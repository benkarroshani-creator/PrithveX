import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { CommunityPost, ReportIssue, Recycler } from '../types';
import { updatePostModerationStatus, updateReportStatus } from '../services/storageService';
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
  const [activeTab, setActiveTab] = useState<'moderation' | 'reports' | 'recyclers'>('moderation');
  const [assignWardText, setAssignWardText] = useState<{ [reportId: string]: string }>({});
  const [notesText, setNotesText] = useState<{ [reportId: string]: string }>({});

  const pendingPosts = posts.filter((p) => p.status === 'Pending review');
  const approvedPosts = posts.filter((p) => p.status === 'Approved');

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
    const notes = notesText[report.id] || report.resolutionNotes || 'Inspected by zonal sanitation officer.';

    await updateReportStatus(report.id, nextStatus, ward, notes);
    onRefreshData();
    onShowToast(`Report #${report.id} advanced to ${nextStatus} in Firestore!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              PrithveX Portal
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1">
            Municipal & Community Moderator Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Designed for hackathon judges to verify civic workflows: approve citizen posts, assign municipal inspection wards, and review recycler audits.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 bg-slate-800 border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'moderation' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Post Moderation ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Grievances ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('recyclers')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'recyclers' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recycler Audits ({RECYCLERS.length})
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Pending Community Submissions ({pendingPosts.length})
            </h2>
            <span className="text-xs text-slate-500">
              Review citizen actions before they go live on the Community Wall.
            </span>
          </div>

          {pendingPosts.length > 0 ? (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {post.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{post.title}</h3>
                      <p className="text-xs text-slate-500">
                        By {post.authorName} ({post.authorCity}) • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprovePost(post.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Post</span>
                      </button>
                      <button
                        onClick={() => handleRejectPost(post.id)}
                        className="px-3 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-950 text-sm">
                Inbox Clean! No Pending Submissions
              </h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                All submitted citizen actions have been reviewed and published to the Community Wall.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Municipal Waste Grievances Workflow ({reports.length})
            </h2>
            <span className="text-xs text-slate-500">
              Simulates urban local body (ULB) sanitation workflow.
            </span>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Ticket #{report.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{report.issueType}</h3>
                    <p className="text-xs text-slate-500">
                      {report.location.locality}, {report.location.city} • Reported by {report.reporterName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border">
                      Current: {report.status}
                    </span>
                    {report.status !== 'Resolved' && (
                      <button
                        onClick={() => handleAdvanceReport(report)}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <span>Advance Workflow</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {report.description}
                </p>

                {/* Ward and notes inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Assigned Municipal Ward / Agency
                    </label>
                    <input
                      type="text"
                      defaultValue={report.assignedWard || 'Ward Sanitation Unit 4'}
                      onChange={(e) =>
                        setAssignWardText({ ...assignWardText, [report.id]: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Resolution Notes / Inspection Memo
                    </label>
                    <input
                      type="text"
                      defaultValue={report.resolutionNotes || 'Compactor scheduled for clearance'}
                      onChange={(e) =>
                        setNotesText({ ...notesText, [report.id]: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recyclers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Verified Circular Facilities ({RECYCLERS.length})
            </h2>
            <span className="text-xs text-slate-500">
              Audit status under CPCB EPR Guidelines 2026.
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Facility Name</th>
                    <th className="p-3.5">City & State</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Audit Date</th>
                    <th className="p-3.5">Accepted Streams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {RECYCLERS.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-800">{r.name}</td>
                      <td className="p-3.5">{r.city}, {r.state}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CPCB Verified</span>
                        </span>
                      </td>
                      <td className="p-3.5">{r.lastVerifiedDate}</td>
                      <td className="p-3.5">
                        <span className="truncate max-w-[200px] inline-block">
                          {r.acceptedCategories.join(', ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
