import React, { useState } from 'react';
import { 
  ArrowRight, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Coins,
  Store,
  BookmarkCheck
} from 'lucide-react';
import { WasteItem } from '../types';
import { getWasteItemImage, handleImageFallback } from '../utils/imageUtils';

interface WasteCardProps {
  item: WasteItem;
  onFindRecycler?: (category: string) => void;
  onFindBuyer?: (category: string) => void;
  onGoMarketplace?: () => void;
  onLogItem?: (item: WasteItem) => void;
}

export const WasteCard: React.FC<WasteCardProps> = ({ 
  item, 
  onFindRecycler, 
  onFindBuyer, 
  onGoMarketplace, 
  onLogItem 
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Semantically appropriate bin indicator dot & label
  const getBinMeta = () => {
    switch (item.binColor) {
      case 'green':
        return {
          dot: 'bg-emerald-600',
          label: 'Green Bin (Wet / Organic)',
        };
      case 'blue':
        return {
          dot: 'bg-blue-600',
          label: 'Blue Bin (Dry Recyclable)',
        };
      case 'red':
        return {
          dot: 'bg-rose-600',
          label: 'Red Bin (Domestic Hazardous / Sanitary)',
        };
      case 'black':
        return {
          dot: 'bg-slate-700',
          label: 'Black Bin (Residual / Non-recyclable)',
        };
      default:
        return {
          dot: 'bg-purple-600',
          label: 'Special Collection Stream',
        };
    }
  };

  const binMeta = getBinMeta();
  const itemImage = item.imageUrl || getWasteItemImage(item.id, item.category);

  return (
    <>
      <article className="bg-white border border-[#E3E8EF] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#19B5A5] hover:shadow-md transition-all group">
        {/* Photo Header */}
        <div className="relative h-36 w-full overflow-hidden bg-[#F4F6F8]">
          <img
            src={itemImage}
            onError={(e) => handleImageFallback(e)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111C2E]/85 backdrop-blur-sm text-white text-[11px] font-semibold">
            <span className={`w-2 h-2 rounded-full ${binMeta.dot}`} />
            <span>{item.binName}</span>
          </div>
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111C2E] text-[10px] font-bold shadow-xs">
            {item.primaryPathway}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Item Name & Hindi Transliteration */}
            <div className="mb-2">
              <h3 className="font-bold text-[#111C2E] text-base leading-snug group-hover:text-[#19B5A5] transition-colors">
                {item.name}
              </h3>
              {item.hindiName && (
                <p className="text-xs text-[#718096] font-medium">
                  {item.hindiName}
                </p>
              )}
            </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {item.shortDescription}
          </p>

          {/* Key Preparation Callout */}
          {item.preparationSteps && item.preparationSteps.length > 0 && (
            <div className="border-t border-slate-100 pt-3 mb-3">
              <p className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Preparation:</span>
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-normal">
                {item.preparationSteps[0]}
              </p>
            </div>
          )}

          {/* Hazardous Warning */}
          {item.isHazardous && (
            <div className="flex items-start gap-1.5 p-2 rounded-md bg-rose-50/60 border border-rose-200/80 text-rose-900 text-[11px] mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-tight">Hazardous waste — do not mix with common municipal streams.</span>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-2 text-xs">
          <button
            onClick={() => setModalOpen(true)}
            className="font-medium text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>Disposal protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onLogItem && (
            <button
              onClick={() => onLogItem(item)}
              className="text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
              title="Log to personal diversion dashboard"
            >
              + Log sort
            </button>
          )}
        </div>
      </div>
    </article>

      {/* Comprehensive 10-Point Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                    <span className={`w-2 h-2 rounded-full ${binMeta.dot}`} />
                    <span>{item.binName}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{item.categoryLabel}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                {item.hindiName && (
                  <p className="text-xs text-slate-500">{item.hindiName}</p>
                )}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 10-Point Protocol */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Photo Preview */}
              <div className="h-48 w-full rounded-xl overflow-hidden border border-[#E3E8EF] shadow-inner bg-[#F4F6F8]">
                <img
                  src={itemImage}
                  onError={(e) => handleImageFallback(e)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 1. Item Classification */}
              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">
                  1. Material Profile
                </h4>
                <p className="text-slate-600 leading-relaxed">{item.shortDescription}</p>
              </div>

              {/* 2. Destination */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 text-xs mb-1">
                  2. Designated Disposal Destination
                </h4>
                <p className="text-slate-800 font-medium mb-1">
                  Target: {item.binName} — Pathway: {item.primaryPathway}
                </p>
                <p className="text-slate-600">{item.safeDisposalInstructions}</p>
              </div>

              {/* 3–6. Circular Audit Checklist */}
              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-2">
                  3. Circular Audit (Reuse, Repair, Donation, Recycling)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className={`p-2.5 rounded-lg border ${item.isReusable ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <p className="font-bold text-xs">{item.isReusable ? 'Yes' : 'No'}</p>
                    <p className="text-[11px] text-slate-500">Reusable</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${item.canRepair ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <p className="font-bold text-xs">{item.canRepair ? 'Yes' : 'No'}</p>
                    <p className="text-[11px] text-slate-500">Repairable</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${item.canDonate ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <p className="font-bold text-xs">{item.canDonate ? 'Yes' : 'No'}</p>
                    <p className="text-[11px] text-slate-500">Donatable</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${item.isRecyclable ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <p className="font-bold text-xs">{item.isRecyclable ? 'Yes' : 'No'}</p>
                    <p className="text-[11px] text-slate-500">Recyclable</p>
                  </div>
                </div>
              </div>

              {/* 7. Preparation Steps */}
              {item.preparationSteps && item.preparationSteps.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs mb-2">
                    4. Citizen Preparation Protocol
                  </h4>
                  <ol className="space-y-1.5 list-decimal list-inside text-slate-600">
                    {item.preparationSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 8. Reuse & Recycling Pathways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.reuseOptions && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h5 className="font-semibold text-slate-900 text-[11px] mb-1">Upcycling & Secondary Uses</h5>
                    <p className="text-slate-600 leading-relaxed">{item.reuseOptions}</p>
                  </div>
                )}
                {item.recyclingOptions && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h5 className="font-semibold text-slate-900 text-[11px] mb-1">Industrial Processing Route</h5>
                    <p className="text-slate-600 leading-relaxed">{item.recyclingOptions}</p>
                  </div>
                )}
              </div>

              {/* 9. Safety Warnings */}
              {item.warnings && (
                <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200 text-rose-900">
                  <h5 className="font-semibold flex items-center gap-1.5 text-xs mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Handling Warning</span>
                  </h5>
                  <p className="leading-relaxed text-[11px]">{item.warnings}</p>
                </div>
              )}

              {/* 10. Statutory CPCB Regulation */}
              {item.cpcbGuideline && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Statutory Reference:</strong> {item.cpcbGuideline}</span>
                </div>
              )}
            </div>

            {/* Modal Footer with Cross-Links */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {onFindRecycler && item.isRecyclable && (
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      onFindRecycler(item.category);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Recyclers for {item.categoryLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {onFindBuyer && item.isRecyclable && (
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      onFindBuyer(item.category);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Waste Buyers</span>
                  </button>
                )}

                {onGoMarketplace && (
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      onGoMarketplace();
                    }}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Marketplace</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
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
