import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  BookOpen
} from 'lucide-react';
import { GUIDES } from '../data/guides';
import { EducationalGuide } from '../types';
import { getWasteItemImage, handleImageFallback, petBottlesImg } from '../utils/imageUtils';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Knowledge Base & Protocols</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Indian Municipal Context</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Sustainable Segregation & Circular Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Practical, actionable instructions engineered for Indian apartments, independent homes, and residential welfare associations.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium text-[11px]">Level:</span>
          {['all', 'Easy', 'Moderate'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                difficultyFilter === lvl
                  ? 'bg-slate-900 text-white'
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
        {filteredGuides.map((guide) => {
          const guideImg = getWasteItemImage(guide.id, guide.category);
          return (
            <article
              key={guide.id}
              className="bg-white rounded-2xl border border-[#E3E8EF] overflow-hidden flex flex-col justify-between hover:border-[#19B5A5] hover:shadow-md transition-all group"
            >
              <div className="h-40 w-full overflow-hidden bg-[#F4F6F8] relative">
                <img
                  src={guideImg}
                  onError={(e) => handleImageFallback(e, petBottlesImg)}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#111C2E]/85 backdrop-blur-sm text-white text-[10px] font-bold">
                  {guide.difficulty}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111C2E] text-[10px] font-bold">
                  {guide.estimatedMinutes} min read
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-slate-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {guide.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {guide.summary}
              </p>

              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{guide.steps.length} Action Steps</span>
                <span className="font-medium text-slate-700">CPCB Aligned</span>
              </div>
            </div>

              <button
                onClick={() => setSelectedGuide(guide)}
                className="mt-5 w-full py-2 px-3 border border-[#E3E8EF] hover:border-[#19B5A5] hover:bg-[#E7F8F6] text-[#111C2E] hover:text-[#138D81] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Read complete protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        );
      })}
      </div>

      {/* Guide Detail Dialog */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-slate-950 text-white flex items-start justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{selectedGuide.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedGuide.estimatedMinutes} min read</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedGuide.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedGuide.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div className="h-48 w-full rounded-xl overflow-hidden border border-[#E3E8EF] shadow-inner bg-[#F4F6F8]">
                <img
                  src={getWasteItemImage(selectedGuide.id, selectedGuide.category)}
                  onError={(e) => handleImageFallback(e, petBottlesImg)}
                  alt={selectedGuide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">Overview</h4>
                <p className="text-slate-600 leading-relaxed">{selectedGuide.summary}</p>
              </div>

              {/* Materials Needed */}
              {selectedGuide.materialsNeeded && selectedGuide.materialsNeeded.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <h4 className="font-semibold text-slate-900 text-xs">Required Materials / Equipment</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
                    {selectedGuide.materialsNeeded.map((mat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step by Step Action Checklist */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Step-by-Step Execution Protocol
                </h4>
                <div className="space-y-3">
                  {selectedGuide.steps.map((st, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">{st.title}</h5>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-7">{st.description}</p>
                      {st.tip && (
                        <p className="text-[11px] text-emerald-800 font-medium pl-7 pt-1">
                          Pro Tip: {st.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Do's & Don'ts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedGuide.dos && selectedGuide.dos.length > 0 && (
                  <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200/80 space-y-2">
                    <h5 className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Recommended Do's</span>
                    </h5>
                    <ul className="space-y-1 text-slate-700">
                      {selectedGuide.dos.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedGuide.donts && selectedGuide.donts.length > 0 && (
                  <div className="p-4 bg-rose-50/50 rounded-lg border border-rose-200/80 space-y-2">
                    <h5 className="font-semibold text-rose-950 flex items-center gap-1.5">
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-700" />
                      <span>Critical Don'ts (Contamination Risks)</span>
                    </h5>
                    <ul className="space-y-1 text-slate-700">
                      {selectedGuide.donts.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedGuide(null);
                  onNavigate('search');
                }}
                className="text-xs text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                <span>Browse related waste items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedGuide(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
