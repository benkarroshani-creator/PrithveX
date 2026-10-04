import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Info,
  Camera,
  Trash2,
  BookmarkCheck,
  Zap
} from 'lucide-react';
import { classifyWaste } from '../services/aiClassifier';
import { ClassificationResult, WasteItem } from '../types';
import { SAMPLE_PRESET_ITEMS } from '../data/mockData';

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
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [itemHint, setItemHint] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [useForceDemo, setUseForceDemo] = useState<boolean>(false);

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

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setClassification(null);
      setIsLogged(false);
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
    if (!selectedImage && !hint.trim()) {
      onShowToast('Please upload an image or type an item name hint.', 'info');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Analyzing material texture and visual signature...');

    try {
      setTimeout(() => {
        setLoadingStep('Consulting CPCB Indian Solid Waste Management (SWM 2016) protocols...');
      }, 700);

      const result = await classifyWaste({
        imageBase64: selectedImage || undefined,
        mimeType,
        itemNameHint: hint || undefined,
        forceDemo: useForceDemo || !hasGeminiKey,
      });

      setClassification(result);
      setIsLogged(false);
      onShowToast(`Identified as ${result.itemName}!`, 'success');
    } catch (err: any) {
      onShowToast('Classification encountered an issue. Falling back to local rules.', 'info');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESET_ITEMS[0]) => {
    setItemHint(preset.hint);
    setSelectedImage(null);
    handleRunClassification(preset.hint);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setItemHint('');
    setClassification(null);
    setIsLogged(false);
  };

  const handleLogToDashboard = () => {
    if (classification && !isLogged) {
      onLogClassification(classification);
      setIsLogged(true);
      onShowToast('Saved to your citizen impact dashboard (+0.35 kg diverted)!', 'success');
    }
  };

  // Bin color badge styling
  const getBinBadge = (binColor: string) => {
    switch (binColor) {
      case 'green':
        return {
          bg: 'bg-emerald-500 text-white',
          border: 'border-emerald-600',
          container: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          label: 'Green Bin (Wet / Organic Stream)',
        };
      case 'blue':
        return {
          bg: 'bg-blue-600 text-white',
          border: 'border-blue-700',
          container: 'bg-blue-50 border-blue-200 text-blue-950',
          label: 'Blue Bin (Dry Recyclable Stream)',
        };
      case 'red':
        return {
          bg: 'bg-rose-600 text-white',
          border: 'border-rose-700',
          container: 'bg-rose-50 border-rose-200 text-rose-950',
          label: 'Red Bin / Marked Wrap (Hazardous / Sanitary)',
        };
      case 'black':
        return {
          bg: 'bg-slate-800 text-white',
          border: 'border-slate-900',
          container: 'bg-slate-100 border-slate-300 text-slate-900',
          label: 'Black Bin (Reject / Residual Stream)',
        };
      default:
        return {
          bg: 'bg-purple-600 text-white',
          border: 'border-purple-700',
          container: 'bg-purple-50 border-purple-200 text-purple-950',
          label: 'Special Collection Stream (CPCB Hub)',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Waste Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Identify Waste & Sorting Pathway
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Upload an image, snap a photo, or enter an item name. Our AI classifies the material, prescribes the exact Indian municipal bin color, and provides safe preparation instructions.
        </p>

        {/* Engine switcher toggle for hackathon demonstration */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">Classification Provider:</span>
          <div className="inline-flex rounded-xl p-0.5 bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setUseForceDemo(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                !useForceDemo && hasGeminiKey
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Gemini 3.8 Flash {hasGeminiKey ? '● Active' : '(No Key)'}
            </button>
            <button
              onClick={() => setUseForceDemo(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                useForceDemo || !hasGeminiKey
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Demo / Offline Engine
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Upload & Manual Input (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Upload Item Image</span>
              </h2>
              {selectedImage && (
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center min-h-[200px] ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : selectedImage
                  ? 'border-emerald-300 bg-slate-50'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {selectedImage ? (
                <div className="relative group w-full flex flex-col items-center">
                  <img
                    src={selectedImage}
                    alt="Uploaded waste item"
                    className="max-h-48 object-contain rounded-xl shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Click or drop another image to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop waste photo here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      or browse from phone/computer (JPG, PNG, WEBP)
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    <Camera className="w-3 h-3" />
                    <span>Camera Supported</span>
                  </div>
                </div>
              )}
            </div>

            {/* Manual text hint input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Item Description or Type Hint (Optional)
                </label>
                {itemHint && (
                  <button
                    onClick={() => setItemHint('')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                value={itemHint}
                onChange={(e) => setItemHint(e.target.value)}
                placeholder="e.g. plastic food container, transparent water bottle, vegetable peels..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />

              {/* Quick contextual tag chips */}
              <div className="pt-1 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-400 font-medium">Quick hints:</span>
                {[
                  'Plastic Container / Dabba',
                  'Water Bottle (PET)',
                  'Milk Pouch',
                  'Cardboard Box',
                  'Food Scraps',
                  'Glass Jar',
                  'Metal Can'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setItemHint(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                      itemHint.toLowerCase().includes(tag.toLowerCase().slice(0, 7))
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex gap-2">
              <button
                onClick={() => handleRunClassification()}
                disabled={isLoading || (!selectedImage && !itemHint.trim())}
                className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Classifying Waste...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Classify Waste Now</span>
                  </>
                )}
              </button>

              {(selectedImage || itemHint || classification) && (
                <button
                  onClick={handleReset}
                  className="px-3 py-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-semibold"
                  title="Reset inputs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Buttons for Instant Testing */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Quick Test Presets (1-Click Demo)</span>
              </span>
              <span className="text-[10px] text-slate-500">Hackathon friendly</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Don't have a photo handy? Click any common Indian household item below to run instant segregation classification:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SAMPLE_PRESET_ITEMS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all hover:scale-105 active:scale-95 ${preset.color}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Classification Output (7 cols) */}
        <div className="lg:col-span-7">
          {isLoading ? (
            /* Loading State with Stage Progress */
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-5 shadow-sm min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  PrithveX AI is Analyzing the Item
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  {loadingStep || 'Mapping material properties to Indian segregation rules...'}
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                <div className="w-full h-full bg-emerald-600 animate-pulse"></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluating against CPCB SWM 2016 & Plastic/E-Waste/Battery Management rules
              </p>
            </div>
          ) : classification ? (
            /* Detailed Classification Result Card */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-300">
              {/* Top Banner: Bin Stream & Confidence */}
              {(() => {
                const bin = getBinBadge(classification.binColor);
                return (
                  <div className={`p-4 rounded-2xl border ${bin.container} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${bin.bg}`}>
                        {classification.binName}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm">
                          Assigned Stream: {classification.categoryLabel}
                        </h4>
                        <p className="text-[11px] opacity-80">
                          Primary Pathway: <strong>{classification.primaryPathway}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/70 border border-current text-slate-800">
                        {Math.round(classification.confidence * 100)}% Confidence
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Title & Explanation */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    Provider: {classification.provider === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Demo Rule-Based Classifier'}
                  </span>
                  {classification.isHazardous && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Hazardous / Special Care</span>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {classification.itemName}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {classification.explanation}
                </p>
              </div>

              {/* Key Preparation Steps Checklist */}
              {classification.preparationSteps && classification.preparationSteps.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Preparation Steps Before Handover</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {classification.preparationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grid: Reuse, Recycling, Next Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {classification.reuseOptions && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-[11px] mb-1">Reuse / Upcycling</p>
                    <p className="text-slate-600 leading-relaxed">{classification.reuseOptions}</p>
                  </div>
                )}
                {classification.recyclingOptions && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-[11px] mb-1">Recycling Process in India</p>
                    <p className="text-slate-600 leading-relaxed">{classification.recyclingOptions}</p>
                  </div>
                )}
              </div>

              {/* Safety Warning if provided */}
              {classification.warnings && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[11px] uppercase tracking-wider text-rose-800">
                      Safety Warning
                    </p>
                    <p className="mt-0.5 leading-relaxed">{classification.warnings}</p>
                  </div>
                </div>
              )}

              {/* CPCB Statutory Regulation Reference */}
              {classification.cpcbRegulation && (
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl text-slate-600 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Statutory Rule:</strong> {classification.cpcbRegulation}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleLogToDashboard}
                    disabled={isLogged}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isLogged
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{isLogged ? 'Logged to Impact Dashboard' : 'Log to My Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('recyclers', classification.category)}
                    className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Find Recyclers</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Classify Another Item
                </button>
              </div>

              {/* AI Disclaimer */}
              <p className="text-[11px] text-slate-400 text-center italic">
                * AI-generated suggestion grounded in Indian Municipal Solid Waste Management (SWM 2016) protocols. Verify local urban local body (ULB) requirements for your specific ward.
              </p>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-50 rounded-3xl p-10 border border-dashed border-slate-300 text-center space-y-4 min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-slate-400 flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">
                  Ready to Classify Your Waste
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload an image on the left, or click one of the quick test presets to experience PrithveX's segregation analysis.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 text-left space-y-1 max-w-xs">
                <p className="font-semibold text-slate-800">What PrithveX provides:</p>
                <p>✓ Correct Indian bin color (Green/Blue/Red/Grey)</p>
                <p>✓ Specific preparation checklist (Rinse/Dry)</p>
                <p>✓ Reuse and local recycler destination</p>
                <p>✓ Safety warnings for domestic hazardous</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
