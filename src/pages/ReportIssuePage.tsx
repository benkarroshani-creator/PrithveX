import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Send, 
  Navigation, 
  FileText 
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
        onShowToast('GPS location attached to report!', 'success');
      },
      (err) => {
        onShowToast('Could not access GPS. Please type your ward or locality manually.', 'info');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !locality.trim()) {
      onShowToast('Please provide a description and location.', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview || undefined;

      // Upload evidence image to Firebase Cloud Storage
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
        reporterName: reporterName.trim() || currentUser.name || 'Anonymous Citizen',
        reporterContact: reporterContact.trim() || currentUser.email || undefined,
      });

      setLastSubmittedId(newReport.id);
      onRefreshReports();
      onShowToast(`Report lodged in Firestore! Ticket ID: #${newReport.id}`, 'success');

      // Reset form
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

  const getStatusBadge = (status: ReportIssue['status']) => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Submitted (Awaiting Review)',
        };
      case 'Under review':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Under Ward Review',
        };
      case 'Assigned':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Assigned to Sanitation Vehicle',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Cleaned & Resolved',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
          Civic Grievance & Ward Action
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          Report a Local Waste Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Report illegal black-spot garbage dumping, overflowing community bins, or toxic plastic pollution directly to the municipal oversight dashboard.
        </p>
      </div>

      {/* Success Notification if just submitted */}
      {lastSubmittedId && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">
                Grievance Lodged Successfully!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Tracking Reference ID: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">{lastSubmittedId}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSearchReportId(lastSubmittedId)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
          >
            Track Status Below
          </button>
        </div>
      )}

      {/* Two Column Layout: Form & Status Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Waste Grievance Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate descriptions and photos speed up municipal response times.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Issue Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type of Waste Issue *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
              >
                <option value="Garbage dumping">Illegal Garbage Dumping / Black Spot</option>
                <option value="Overflowing bin">Overflowing Public Dustbin / Vat</option>
                <option value="Uncollected waste">Uncollected Doorstep Waste</option>
                <option value="Mixed waste">Mixed Non-Segregated Collection</option>
                <option value="Plastic pollution">Plastic Waste in Drain / Waterbody</option>
                <option value="Hazardous discharge">Chemical / Paint / Medical Dumping</option>
                <option value="Other">Other Environmental Issue</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, landmarks, severity (e.g. blocking walkway, foul smell, attracting stray animals, fire risk)..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-emerald-600"
              ></textarea>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach Photo Evidence (Recommended)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Choose Photo</span>
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
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded waste preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* City & Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pincode (Optional)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560038"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Street Address / Locality / Ward *
                </label>
                <button
                  type="button"
                  onClick={handleUseGps}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Use Device GPS</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. 12th Main Road, near junction water tank, Ward 89"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
              />
            </div>

            {/* Reporter Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Keep blank for anonymous"
                  className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="For SMS status updates"
                  className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Grievance...' : 'Submit Grievance to Municipal Portal'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Status Tracker & Recent Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracker Search Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Track Existing Ticket Status</span>
            </h3>
            <p className="text-xs text-slate-400">
              Enter your unique tracking reference ID (e.g. PVX-2026-8812) to inspect real-time municipal inspection progress.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchReportId}
                onChange={(e) => setSearchReportId(e.target.value)}
                placeholder="Enter Ticket ID (PVX-2026-...)"
                className="flex-1 text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500 font-mono"
              />
              {searchReportId && (
                <button
                  onClick={() => setSearchReportId('')}
                  className="px-2 text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Found Report Inspector */}
            {searchedReport && (
              <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">
                    #{searchedReport.id}
                  </span>
                  {(() => {
                    const st = getStatusBadge(searchedReport.status);
                    return (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg}`}>
                        {st.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="font-semibold text-slate-200">{searchedReport.issueType}</p>
                <p className="text-slate-400 text-[11px]">{searchedReport.location.locality}, {searchedReport.location.city}</p>
                {searchedReport.assignedWard && (
                  <p className="text-[11px] text-purple-300">
                    <strong>Ward:</strong> {searchedReport.assignedWard}
                  </p>
                )}
                {searchedReport.resolutionNotes && (
                  <p className="text-[11px] text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/60">
                    <strong>Notes:</strong> {searchedReport.resolutionNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent Grievances Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Recent Civic Reports</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                {reports.length} Logged
              </span>
            </h3>

            <div className="space-y-3">
              {reports.slice(0, 4).map((r) => {
                const st = getStatusBadge(r.status);
                return (
                  <div
                    key={r.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-700 text-[11px]">
                        #{r.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg}`}>
                        {r.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-800">{r.issueType}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{r.description}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{r.location.locality}, {r.location.city}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
