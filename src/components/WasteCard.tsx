import React, { useState } from 'react';
import { 
  Recycle, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { WasteItem } from '../types';

interface WasteCardProps {
  item: WasteItem;
  onFindRecycler?: (category: string) => void;
  onLogItem?: (item: WasteItem) => void;
}

export const WasteCard: React.FC<WasteCardProps> = ({ item, onFindRecycler, onLogItem }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Bin color styles
  const getBinBadge = () => {
    switch (item.binColor) {
      case 'green':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          label: 'Green Bin (Wet / Organic)',
        };
      case 'blue':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
          label: 'Blue Bin (Dry Recyclable)',
        };
      case 'red':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
          label: 'Red Stream (Hazardous / Sanitary)',
        };
      case 'black':
        return {
          bg: 'bg-slate-200 text-slate-800 border-slate-400',
          dot: 'bg-slate-700',
          label: 'Black Bin (Reject / Residual)',
        };
      default:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-600',
          label: 'Special Collection Hub',
        };
    }
  };

  const binStyle = getBinBadge();

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between group">
        <div>
          {/* Top badges: Bin & Primary Pathway */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${binStyle.bg}`}>
              <span className={`w-2 h-2 rounded-full ${binStyle.dot}`}></span>
              <span>{item.binName}</span>
            </span>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {item.primaryPathway}
            </span>
          </div>

          {/* Item Name & Hindi Nickname */}
          <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
            {item.name}
          </h3>
          {item.hindiName && (
            <p className="text-xs text-emerald-800/80 font-medium mb-2">
              {item.hindiName}
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {item.shortDescription}
          </p>

          {/* Quick Preparation Preview */}
          {item.preparationSteps && item.preparationSteps.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Key Preparation Step:</span>
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                {item.preparationSteps[0]}
              </p>
            </div>
          )}

          {/* Hazardous Warning Chip */}
          {item.isHazardous && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Safety Warning: Special care required</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:underline"
          >
            <span>Full Disposal Guide</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {onLogItem && (
            <button
              onClick={() => onLogItem(item)}
              className="text-[11px] font-medium px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors"
              title="Log to your personal diversion impact"
            >
              + Log Sort
            </button>
          )}
        </div>
      </div>

      {/* Comprehensive Modal answering all 10 prompt questions */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${binStyle.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${binStyle.dot}`}></span>
                    <span>{item.binName}</span>
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {item.categoryLabel}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
                {item.hindiName && (
                  <p className="text-xs text-emerald-700 font-medium">{item.hindiName}</p>
                )}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Answers to prompt questions 1-10 */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 1. What is it? */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  1. What is this item?
                </h4>
                <p className="text-slate-600 leading-relaxed">{item.shortDescription}</p>
              </div>

              {/* 2. Segregation stream & Destination */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-xs mb-1">
                  2. Appropriate Bin Destination & Category
                </h4>
                <p className="text-emerald-800 font-semibold mb-1">
                  Destination: {item.binName} ({item.primaryPathway})
                </p>
                <p className="text-emerald-700">{item.safeDisposalInstructions}</p>
              </div>

              {/* 3, 4, 5, 6: Can it be Reused, Repaired, Donated, Recycled? */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className={`p-2 rounded-xl border ${item.isReusable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="font-bold text-xs">{item.isReusable ? 'Yes' : 'No'}</p>
                  <p className="text-[10px]">Reusable</p>
                </div>
                <div className={`p-2 rounded-xl border ${item.canRepair ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="font-bold text-xs">{item.canRepair ? 'Yes' : 'No'}</p>
                  <p className="text-[10px]">Repairable</p>
                </div>
                <div className={`p-2 rounded-xl border ${item.canDonate ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="font-bold text-xs">{item.canDonate ? 'Yes' : 'No'}</p>
                  <p className="text-[10px]">Donatable</p>
                </div>
                <div className={`p-2 rounded-xl border ${item.isRecyclable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="font-bold text-xs">{item.isRecyclable ? 'Yes' : 'No'}</p>
                  <p className="text-[10px]">Recyclable</p>
                </div>
              </div>

              {/* 7. Preparation Steps */}
              {item.preparationSteps && item.preparationSteps.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    7. Preparation Steps Before Handover
                  </h4>
                  <ul className="space-y-1.5">
                    {item.preparationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reuse & Recycling Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.reuseOptions && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-800 text-[11px] mb-1">Reuse & Upcycling Options</h5>
                    <p className="text-slate-600">{item.reuseOptions}</p>
                  </div>
                )}
                {item.recyclingOptions && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-800 text-[11px] mb-1">Industrial Recycling Pathway</h5>
                    <p className="text-slate-600">{item.recyclingOptions}</p>
                  </div>
                )}
              </div>

              {/* 9. Safety Warnings */}
              {item.warnings && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                  <h5 className="font-bold flex items-center gap-1.5 text-xs mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Safety Precautions & Warnings</span>
                  </h5>
                  <p className="leading-relaxed">{item.warnings}</p>
                </div>
              )}

              {/* 10. CPCB Regulation */}
              {item.cpcbGuideline && (
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg text-slate-600 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Statutory Regulation:</strong> {item.cpcbGuideline}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {onFindRecycler && item.isRecyclable ? (
                <button
                  onClick={() => {
                    setModalOpen(false);
                    onFindRecycler(item.category);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Find Recyclers for {item.categoryLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
