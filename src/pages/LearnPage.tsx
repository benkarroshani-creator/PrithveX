import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  HelpCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { GUIDES } from '../data/guides';
import { EducationalGuide } from '../types';

interface LearnPageProps {
  onNavigate: (tab: string, filter?: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onNavigate }) => {
  const [selectedGuide, setSelectedGuide] = useState<EducationalGuide | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredGuides = GUIDES.filter((g) => {
    return difficultyFilter === 'all' || g.difficulty === difficultyFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Knowledge & Civic Education
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          Master Sustainable Waste Practices
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Practical, actionable guides engineered for Indian apartments, independent houses, and communities. From odor-free balcony composting to deciphering plastic recycling codes.
        </p>

        {/* Filter chips */}
        <div className="flex items-center gap-2 pt-4 text-xs">
          <span className="text-slate-500 font-medium">Difficulty Level:</span>
          {['all', 'Easy', 'Moderate'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                difficultyFilter === lvl
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl === 'all' ? 'All Guides' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  guide.difficulty === 'Easy'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {guide.difficulty}
                </span>

                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.estimatedMinutes} min read</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {guide.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {guide.summary}
              </p>

              {/* Steps count & materials preview */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>{guide.steps.length} Actionable Steps</span>
                <span className="font-semibold text-emerald-700">Detailed Indian Context</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedGuide(guide)}
              className="mt-5 w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Read Step-by-Step Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedGuide.difficulty} • {selectedGuide.estimatedMinutes} min read
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedGuide.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedGuide.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Summary */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <p className="text-emerald-950 leading-relaxed font-medium">
                  {selectedGuide.summary}
                </p>
              </div>

              {/* Materials Needed */}
              {selectedGuide.materialsNeeded && selectedGuide.materialsNeeded.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Materials & Requirements
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {selectedGuide.materialsNeeded.map((mat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Step-by-Step Implementation
                </h4>
                <div className="space-y-3">
                  {selectedGuide.steps.map((st, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {st.title}
                        </h5>
                      </div>
                      <p className="text-slate-600 pl-7 leading-relaxed">
                        {st.description}
                      </p>
                      {st.tip && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg pl-7 border border-emerald-100 font-medium">
                          💡 <strong>Pro Tip:</strong> {st.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Do's and Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <ThumbsUp className="w-4 h-4 text-emerald-700" />
                    <span>Do's (Best Practices)</span>
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-emerald-800">
                    {selectedGuide.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <h5 className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                    <ThumbsDown className="w-4 h-4 text-rose-700" />
                    <span>Don'ts (Common Mistakes)</span>
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-rose-800">
                    {selectedGuide.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Safety Notes */}
              {selectedGuide.safetyNotes && selectedGuide.safetyNotes.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5">
                  <h5 className="font-bold flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Important Health & Safety Notes</span>
                  </h5>
                  <ul className="space-y-1 text-[11px]">
                    {selectedGuide.safetyNotes.map((note, idx) => (
                      <li key={idx}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedGuide(null);
                  onNavigate('search');
                }}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Search related waste items →
              </button>

              <button
                onClick={() => setSelectedGuide(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
