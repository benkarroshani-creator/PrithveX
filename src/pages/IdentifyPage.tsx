import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Camera,
  Trash2,
  BookmarkCheck,
  Zap,
  Building2,
  Coins,
  Store,
  HelpCircle,
  ThumbsUp,
  SlidersHorizontal
} from 'lucide-react';
import { classifyWaste, getInstantCategoryClassification } from '../services/aiClassifier';
import { ClassificationResult } from '../types';
import { SAMPLE_PRESET_ITEMS } from '../data/mockData';
import { incrementUserStat, recordUserActivity } from '../services/storageService';
import { getWasteItemImage, handleImageFallback } from '../utils/imageUtils';

interface IdentifyPageProps {
  onNavigate: (tab: string, filter?: string) => void;
  onLogClassification: (result: ClassificationResult) => void;
  hasGeminiKey: boolean;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const IdentifyPage: React.FC<IdentifyPageProps> = ({
  onNavigate,
  onLogClassification,
  hasGeminiKey,
  onShowToast
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [itemHint, setItemHint] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [useForceDemo, setUseForceDemo] = useState<boolean>(false);
  
  // Ambiguity / Low-confidence override state
  const [clarificationText, setClarificationText] = useState<string>('');
  const [userConfirmedLowConfidence, setUserConfirmedLowConfidence] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload an image file (PNG, JPG, WEBP).', 'info');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onShowToast('Image size should be under 8MB.', 'info');
      return;
    }

    setUploadedFileName(file.name);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setClassification(null);
      setIsLogged(false);
      setUserConfirmedLowConfidence(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRunClassification = async (hintOverride?: string) => {
    const hint = hintOverride !== undefined ? hintOverride : itemHint;
    if (!selectedImage && !hint.trim() && !uploadedFileName) {
      onShowToast('Please upload an image, select a stream, or enter an item hint.', 'info');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Analyzing material composition and texture signature...');

    try {
      setTimeout(() => {
        setLoadingStep('Matching against CPCB Solid Waste Management (SWM 2016) protocols...');
      }, 500);

      const result = await classifyWaste({
        imageBase64: selectedImage || undefined,
        mimeType,
        itemNameHint: hint || undefined,
        fileName: uploadedFileName || undefined,
        forceDemo: useForceDemo || !hasGeminiKey,
      });

      setClassification(result);
      setIsLogged(false);
      setUserConfirmedLowConfidence(false);
      onShowToast(`Identified: ${result.itemName}`, 'success');
    } catch (err) {
      console.error('Classification failure:', err);
      onShowToast('Classification failed. Falling back to deterministic rules.', 'info');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESET_ITEMS[0]) => {
    const imgUrl = getWasteItemImage(preset.id);
    setSelectedImage(imgUrl);
    setUploadedFileName('');
    setItemHint(preset.label);
    setUserConfirmedLowConfidence(false);
    handleRunClassification(preset.hint || preset.label);
  };

  const handleInstantStreamSelect = (materialKey: string, materialLabel: string) => {
    setItemHint(materialLabel);
    const result = getInstantCategoryClassification(materialKey);
    setClassification(result);
    setIsLogged(false);
    setUserConfirmedLowConfidence(false);
    onShowToast(`Loaded SWM 2016 protocol for ${materialLabel}`, 'success');
  };

  const handleReset = () => {
    setSelectedImage(null);
    setUploadedFileName('');
    setItemHint('');
    setClassification(null);
    setIsLogged(false);
    setUserConfirmedLowConfidence(false);
    setClarificationText('');
  };

  const handleLogToDashboard = (actionType: 'segregated' | 'reused' | 'donated' | 'sold' = 'segregated') => {
    if (!classification) return;
    onLogClassification(classification);
    
    if (actionType === 'reused') {
      incrementUserStat('itemsReused', 1);
      recordUserActivity('Reused Household Item', classification.itemName);
    } else if (actionType === 'donated') {
      incrementUserStat('itemsDonated', 1);
      recordUserActivity('Donated Useful Item', classification.itemName);
    } else if (actionType === 'sold') {
      incrementUserStat('itemsSold', 1);
      recordUserActivity('Sold Recyclable Scrap', classification.itemName);
    } else {
      incrementUserStat('itemsSegregated', 1);
      recordUserActivity('Segregated Waste Item', classification.itemName);
    }

    setIsLogged(true);
    onShowToast(`Logged "${classification.itemName}" as ${actionType}!`, 'success');
  };

  const getBinMeta = (binColor: string) => {
    switch (binColor) {
      case 'green':
        return {
          dot: 'bg-emerald-600',
          borderColor: 'border-emerald-300',
          label: 'Green Bin (Wet / Organic)',
        };
      case 'blue':
        return {
          dot: 'bg-blue-600',
          borderColor: 'border-blue-300',
          label: 'Blue Bin (Dry Recyclable)',
        };
      case 'red':
        return {
          dot: 'bg-rose-600',
          borderColor: 'border-rose-300',
          label: 'Red Bin (Domestic Hazardous / Sanitary)',
        };
      default:
        return {
          dot: 'bg-slate-700',
          borderColor: 'border-slate-300',
          label: 'Black Bin (Residual / Non-recyclable)',
        };
    }
  };

  const isLowConfidence = classification && classification.confidence < 0.72;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Intelligent Waste Recognition</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Gemini Vision & CPCB Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Waste Identifier & Disposal Navigator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Upload an image of any discarded item or tap any material stream below. Receive the exact municipal bin destination, citizen preparation steps, statutory CPCB rules, and direct recycler/buyer matches.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono text-slate-500">
            {hasGeminiKey ? 'Gemini 3.8 Flash Active' : 'Deterministic Rules'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Instant 1-Tap Free Waste Segregation Tool Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                Instant 1-Tap Waste Segregation Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                100% Free · No photo needed · Select any waste category for instant Indian CPCB bin rules & resale values
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full self-start sm:self-auto border border-teal-200">
            SWM 2016 Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {[
            { id: 'organic', label: 'Wet Organic & Peels', tag: 'organic kitchen scrap peel banana sabzi', icon: '🍏', bin: 'Green Bin' },
            { id: 'cardboard', label: 'Cardboard Box / Carton', tag: 'corrugated cardboard parcel amazon box', icon: '📦', bin: 'Blue Bin' },
            { id: 'bottle', label: 'PET Drink Bottle', tag: 'pet water cold drink bottle', icon: '🥤', bin: 'Blue Bin' },
            { id: 'can', label: 'Aluminium Can / Tin', tag: 'aluminium beverage can soda tin', icon: '🥫', bin: 'Blue Bin' },
            { id: 'glass', label: 'Glass Bottle / Jar', tag: 'glass condiment pickle jar bottle kaanch', icon: '🫙', bin: 'Blue Bin' },
            { id: 'milk', label: 'Milk Pouch (LDPE)', tag: 'milk pouch packet doodh curd ldpe', icon: '🥛', bin: 'Blue Bin' },
            { id: 'battery', label: 'Batteries & Cells', tag: 'lithium battery cell powerbank', icon: '🔋', bin: 'Red Bin' },
            { id: 'medicine', label: 'Medicines & Blister', tag: 'expired medicine paracetamol blister tablet', icon: '💊', bin: 'Red Bin' },
            { id: 'ewaste', label: 'E-Waste & Cables', tag: 'phone charger cable electronic e-waste', icon: '🔌', bin: 'E-Waste Hub' },
            { id: 'textile', label: 'Clothes & Fabrics', tag: 'cloth textile jeans fabric chindi', icon: '👕', bin: 'Textile Box' },
            { id: 'oil', label: 'Used Cooking Oil', tag: 'used cooking oil frying kadai ruco', icon: '🍳', bin: 'RUCO Biofuel' },
            { id: 'thermocol', label: 'Thermocol / EPS', tag: 'thermocol styrofoam packaging block eps', icon: '📦', bin: 'Special DWCC' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleInstantStreamSelect(item.tag, item.label)}
              className="p-2 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-slate-800 truncate group-hover:text-teal-700">{item.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{item.bin}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Input Material
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-teal-500 bg-teal-50/40'
                  : selectedImage
                  ? 'border-slate-300 bg-slate-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {selectedImage ? (
                <div className="space-y-3">
                  <div className="relative inline-block max-w-full">
                    <img
                      src={selectedImage}
                      alt="Uploaded preview"
                      className="max-h-52 rounded-lg object-contain mx-auto border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setUploadedFileName('');
                        setClassification(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {uploadedFileName && (
                    <div>
                      <span className="inline-block text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        File: {uploadedFileName}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Click or drag to swap photo
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Click to upload</span> or drag image here
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PNG, JPG, or WEBP up to 8MB
                  </p>
                </div>
              )}
            </div>

            {/* Optional hint input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Item description or label hint (optional)
              </label>
              <input
                type="text"
                value={itemHint}
                onChange={(e) => setItemHint(e.target.value)}
                placeholder="e.g. Banana peel, cardboard box, coke can, battery, medicine blister..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-slate-900 bg-white placeholder-slate-400"
              />
            </div>

            {/* Trigger Button */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleRunClassification()}
                disabled={isLoading || (!selectedImage && !itemHint.trim() && !uploadedFileName)}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Identify Waste Stream</span>
                  </>
                )}
              </button>

              {(selectedImage || itemHint || classification) && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-600 text-xs font-medium"
                  title="Clear inputs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick presets for evaluation */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-600" />
                <span>1-Click Test Presets</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">Rapid review</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Click any sample item below to trigger instant classification:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {SAMPLE_PRESET_ITEMS.map((preset) => {
                const thumb = getWasteItemImage(preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-1.5 rounded-xl border border-[#E3E8EF] bg-white text-[#253247] hover:border-[#19B5A5] hover:text-[#111C2E] transition-all flex items-center gap-2 text-left group shadow-2xs hover:shadow-xs"
                  >
                    <img
                      src={thumb}
                      onError={(e) => handleImageFallback(e)}
                      alt={preset.label}
                      className="w-7 h-7 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <span className="text-[11px] font-semibold truncate leading-tight">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Result Matrix (7 cols) */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white rounded-xl p-10 border border-slate-200 text-center space-y-4 min-h-[360px] flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Analyzing Waste Item
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {loadingStep || 'Mapping material signature against CPCB SWM 2016...'}
                </p>
              </div>
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mx-auto">
                <div className="w-full h-full bg-slate-900 animate-pulse" />
              </div>
            </div>
          ) : classification ? (
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5 animate-in fade-in duration-200">
              {/* Result Stream Banner */}
              {(() => {
                const meta = getBinMeta(classification.binColor);
                return (
                  <div className={`p-4 rounded-lg border ${meta.borderColor} bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${meta.dot}`} />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {classification.binName}
                        </h4>
                        <p className="text-xs text-slate-600">
                          Pathway: <strong>{classification.primaryPathway}</strong> · Category: {classification.categoryLabel}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-slate-700 font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                        {Math.round(classification.confidence * 100)}% Confidence
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Quick Stream Refinement Bar */}
              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                    <span>Not what you have? Tap actual material to correct instantly:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">1-Click switch</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '🍏 Organic Peels / Scraps', tag: 'organic kitchen scrap peel banana sabzi' },
                    { label: '📦 Cardboard Box', tag: 'corrugated cardboard parcel amazon box' },
                    { label: '🥫 Aluminium Can', tag: 'aluminium beverage can soda tin' },
                    { label: '🥤 PET Drink Bottle', tag: 'pet water cold drink bottle' },
                    { label: '🥛 Milk Pouch', tag: 'milk pouch packet doodh curd ldpe' },
                    { label: '🔋 Battery', tag: 'lithium battery cell powerbank' },
                    { label: '💊 Medicine', tag: 'expired medicine paracetamol blister tablet' },
                    { label: '🔌 E-Waste', tag: 'phone charger cable electronic e-waste' },
                    { label: '🥡 Food Container (PP 5)', tag: 'rigid plastic takeaway food container meal box tupperware dabba PP 5' },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInstantStreamSelect(chip.tag, chip.label.replace(/^[^\s]+\s*/, ''))}
                      className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-md text-[11px] text-slate-700 hover:text-teal-900 font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Low Confidence Confirmation Prompt */}
              {isLowConfidence && !userConfirmedLowConfidence && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <span className="font-semibold text-amber-950">Ambiguous Material Detection:</span>{' '}
                      The vision model identified this as <strong>{classification.itemName}</strong> with {Math.round(classification.confidence * 100)}% confidence.
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setUserConfirmedLowConfidence(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Yes, that's correct
                    </button>

                    <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={clarificationText}
                        onChange={(e) => setClarificationText(e.target.value)}
                        placeholder="Or clarify name (e.g. tetra pak carton)..."
                        className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-amber-300 rounded focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (clarificationText.trim()) {
                            handleRunClassification(clarificationText.trim());
                            setClarificationText('');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded"
                      >
                        Re-classify
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Material Assessment */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-mono">
                  <span>Engine: {classification.provider === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Deterministic Rule Engine'}</span>
                  {classification.isHazardous && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-700 font-sans font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Hazardous</span>
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {classification.itemName}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {classification.explanation}
                </p>
              </div>

              {/* Preparation Steps Checklist */}
              {classification.preparationSteps && classification.preparationSteps.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mandatory Preparation Checklist</span>
                  </h4>
                  <ol className="space-y-1.5 text-xs text-slate-700 list-decimal list-inside">
                    {classification.preparationSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Circular Options: Reuse & Industrial Recycling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {classification.reuseOptions && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 text-[11px] mb-1">Upcycling & Secondary Uses</p>
                    <p className="text-slate-600 leading-relaxed">{classification.reuseOptions}</p>
                  </div>
                )}
                {classification.recyclingOptions && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 text-[11px] mb-1">Recycling Process in India</p>
                    <p className="text-slate-600 leading-relaxed">{classification.recyclingOptions}</p>
                  </div>
                )}
              </div>

              {/* Safety Warning */}
              {classification.warnings && (
                <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold mb-0.5">Handling Warning</h5>
                    <p className="leading-relaxed text-[11px]">{classification.warnings}</p>
                  </div>
                </div>
              )}

              {/* Statutory Regulation Reference */}
              {classification.cpcbRegulation && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Statutory Regulation:</strong> {classification.cpcbRegulation}</span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onNavigate('recyclers', classification.category)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Find Recyclers for {classification.categoryLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('buyers')}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Find Bulk Scrap Buyers</span>
                  </button>

                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sell on Marketplace</span>
                  </button>
                </div>

                {/* Log Sustainable Action Multi-Option */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    Record your circular action:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleLogToDashboard('segregated')}
                      disabled={isLogged}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-medium transition-colors"
                    >
                      + Segregated
                    </button>
                    <button
                      onClick={() => handleLogToDashboard('reused')}
                      disabled={isLogged}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded text-xs font-medium transition-colors"
                    >
                      + Reused
                    </button>
                    <button
                      onClick={() => handleLogToDashboard('donated')}
                      disabled={isLogged}
                      className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded text-xs font-medium transition-colors"
                    >
                      + Donated
                    </button>
                    <button
                      onClick={() => handleLogToDashboard('sold')}
                      disabled={isLogged}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded text-xs font-medium transition-colors"
                    >
                      + Sold Scrap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State / Standby Guidance */
            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-teal-600" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Awaiting Material Input
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload a photo or choose a quick test item on the left. PrithveX will output the exact bin destination, statutory preparation steps, and direct links to recyclers and bulk buyers.
                </p>
              </div>

              {/* Preview Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-4 text-left text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-[11px]">1. Stream Color</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Green, Blue, Red, or Red-dot wrap</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-[11px]">2. Preparation</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Rinsing, drying, cutting corners</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-[11px]">3. Local Recycler</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Direct match in your city</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
