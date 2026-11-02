import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Send, 
  Navigation, 
  FileText,
  Trash2
} from 'lucide-react';
import { ReportIssue, UserProfile } from '../types';
import { submitReport } from '../services/storageService';
import { uploadImageToStorage } from '../services/imageStorageService';

interface ReportIssuePageProps {
  reports: ReportIssue[];
  onRefreshReports: () => void;
  currentUser: UserProfile;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  reports,
  onRefreshReports,
  currentUser,
  onShowToast
}) => {
  const [issueType, setIssueType] = useState<ReportIssue['issueType']>('Garbage dumping');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [locality, setLocality] = useState('');
  const [pincode, setPincode] = useState('');
  const [reporterName, setReporterName] = useState(currentUser.name || '');
  const [reporterContact, setReporterContact] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchReportId, setSearchReportId] = useState('');
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      onShowToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocality(`GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        onShowToast('GPS coordinates attached to complaint.', 'success');
      },
      (err) => {
        onShowToast('Could not access GPS. Please type your locality or ward manually.', 'info');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !locality.trim()) {
      onShowToast('Please provide a description and locality address.', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview || undefined;

      if (imageFile) {
        onShowToast('Uploading evidence photo to Firebase Cloud Storage...', 'info');
        finalImageUrl = await uploadImageToStorage(imageFile, 'reports');
      }

      const newReport = await submitReport({
        issueType,
        description: description.trim(),
        location: {
          city,
          locality: locality.trim(),
          pincode: pincode.trim() || undefined,
        },
        imageUrl: finalImageUrl,
        reporterName: reporterName.trim() || currentUser.name || 'Citizen',
        reporterContact: reporterContact.trim() || currentUser.email || undefined,
      });

      setLastSubmittedId(newReport.id);
      onRefreshReports();
      onShowToast(`Report submitted to Firestore. Ticket ID: #${newReport.id}`, 'success');

      setDescription('');
      setLocality('');
      setPincode('');
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      onShowToast('Failed to submit report. Please try again.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchedReport = searchReportId.trim()
    ? reports.find(
        (r) => r.id.toLowerCase() === searchReportId.trim().toLowerCase()
      )
    : null;

  const getStatusColor = (status: ReportIssue['status']) => {
    switch (status) {
      case 'Submitted':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Under review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Assigned':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Resolved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Civic Sanitation Accountability</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Municipal Ward Grievance Redressal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Report Waste Grievance or Dumping Black-Spot
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Lodge geo-tagged civic complaints for illegal garbage burning, overflowing community bins, or open dumping. Track municipal officer review and sanitation resolution.
          </p>
        </div>

        {/* Quick Ticket Lookup */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Track Existing Grievance by Ticket ID
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchReportId}
              onChange={(e) => setSearchReportId(e.target.value)}
              placeholder="e.g. PVX-2026-001"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Searched Ticket Spotlight */}
      {searchedReport && (
        <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Ticket #{searchedReport.id}</span>
                <span aria-hidden="true">·</span>
                <span>Submitted {searchedReport.submittedAt}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">{searchedReport.issueType}</h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded border font-medium ${getStatusColor(searchedReport.status)}`}>
              {searchedReport.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 font-medium">Location</p>
              <p className="text-slate-800 font-semibold">{searchedReport.location.locality}, {searchedReport.location.city}</p>
              <p className="text-slate-600 mt-2">{searchedReport.description}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <p className="font-semibold text-slate-900">Municipal Action Status</p>
              <p className="text-slate-700">Assigned Ward: <strong>{searchedReport.assignedWard || 'Zonal Sanitation Unit'}</strong></p>
              <p className="text-slate-600 text-[11px]">Notes: {searchedReport.resolutionNotes || 'Queued for ground inspection by ward health inspector.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Success Confirmation */}
      {lastSubmittedId && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Grievance Ticket Lodged: #{lastSubmittedId}</h4>
              <p className="text-emerald-800 mt-0.5">
                Your report has been written to Firebase Firestore. Use ticket #{lastSubmittedId} to check status updates in the tracker above.
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastSubmittedId(null)}
            className="text-xs text-emerald-700 underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form & Active Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaint Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Lodge New Civic Complaint</h2>
            <p className="text-xs text-slate-500 mt-0.5">All reports are routed to zonal municipal teams</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Issue Type */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Type of Waste Violation</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-slate-900"
              >
                <option value="Garbage dumping">Illegal Roadside Garbage Dumping</option>
                <option value="Overflowing bin">Overflowing Municipal Community Bin</option>
                <option value="Hazardous waste">Open Chemical / Domestic Hazardous Waste</option>
                <option value="E-waste dumping">Discarded E-Waste / Battery Leaks</option>
                <option value="Plastic burning">Open Waste / Plastic Burning</option>
                <option value="Other">Other Sanitation Violation</option>
              </select>
            </div>

            {/* City & Locality */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">City Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-slate-900"
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
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pincode (Optional)</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560001"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
                />
              </div>
            </div>

            {/* Locality Address + GPS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Locality Address or Landmark *</label>
                <button
                  type="button"
                  onClick={handleUseGps}
                  className="text-[11px] text-slate-700 hover:text-slate-950 font-medium inline-flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3 text-slate-500" />
                  <span>Attach GPS</span>
                </button>
              </div>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. 12th Main Road, Indiranagar, near water tank"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Details of Violation *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe size of dump, foul odor, fire risk, or days since bin overflowed..."
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-slate-900 resize-none"
              />
            </div>

            {/* Photo Evidence Upload */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Photo Evidence (Firebase Cloud Storage)</label>
              <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50/50">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Evidence preview" className="max-h-32 object-contain rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-600 font-medium">Click to upload photo evidence</span>
                    <span className="text-[10px] text-slate-400 block">Uploaded securely to Firebase Storage</span>
                  </label>
                )}
              </div>
            </div>

            {/* Reporter Contact Info */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Reporter Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Citizen name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Contact Phone or Email</label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Phone / email"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Uploading & Lodging Ticket...' : 'Submit Grievance Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Public Ticket Feed & Transparency (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-semibold text-slate-900">Recent Grievances & Municipal Ward Redressal</h2>
            <span className="text-xs text-slate-500 font-mono">{reports.length} total logged</span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <article key={report.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>Ticket #{report.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.submittedAt}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mt-0.5">{report.issueType}</h3>
                    <p className="text-xs text-slate-500">{report.location.locality}, {report.location.city}</p>
                  </div>

                  <span className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                {report.imageUrl && (
                  <div className="pt-1">
                    <img
                      src={report.imageUrl}
                      alt="Violation evidence"
                      className="h-28 rounded-lg object-cover border border-slate-200"
                    />
                  </div>
                )}

                {/* Ward Status Box */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900">Ward Action: </span>
                    <span>{report.assignedWard ? `${report.assignedWard} — ` : ''}{report.resolutionNotes || 'Pending assignment to sanitation inspection crew.'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
