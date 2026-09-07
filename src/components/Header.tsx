import React from 'react';
import { ViewMode, RoomId } from '../types';
import { 
  Layers, 
  Sparkles, 
  Home, 
  Wrench, 
  Box, 
  Calculator, 
  Printer, 
  HelpCircle,
  Maximize2,
  Image as ImageIcon,
  Sun,
  FileDown,
  Loader2
} from 'lucide-react';

interface HeaderProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  onOpenAiConsultant: () => void;
  onOpenCostEstimator: () => void;
  onOpenGuide: () => void;
  onOpenSunlightSimulation: () => void;
  onExportPdf: () => void;
  isExportingPdf?: boolean;
  activeRoomId: RoomId | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenAiConsultant,
  onOpenCostEstimator,
  onOpenGuide,
  onOpenSunlightSimulation,
  onExportPdf,
  isExportingPdf = false,
}) => {
  return (
    <header className="bg-stone-900/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Branding & Apartment Specs */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold">
              <Home className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-stone-100 tracking-tight">
                  مخطط الشقة وإعادة التوزيع المعماري
                </h1>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  تصميم معدل متطور
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                الصالة 7.51×3.51م • جناح ماستر بحمام خاص • مطبخ مطور • معيشة عائلية مستقلة
              </p>
            </div>
          </div>

          {/* Quick actions on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              id="mobile-sunlight-btn"
              onClick={onOpenSunlightSimulation}
              className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg"
              title="محاكي الشمس والضوء"
            >
              <Sun className="w-4 h-4" />
            </button>

            <button
              id="mobile-pdf-btn"
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="p-2 bg-stone-800 border border-stone-700 text-stone-200 rounded-lg disabled:opacity-50"
              title="تصدير المخطط PDF"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              id="mobile-ai-btn"
              onClick={onOpenAiConsultant}
              className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-2.5 py-1.5 rounded-lg font-bold shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </button>
          </div>
        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center bg-stone-950/80 p-1 rounded-xl border border-stone-800/80 w-full md:w-auto overflow-x-auto">
          <button
            id="mode-proposed-btn"
            onClick={() => onSelectMode('proposed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'proposed'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            المخطط المطور المقترح
          </button>

          <button
            id="mode-original-btn"
            onClick={() => onSelectMode('original')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'original'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            الوضع الحالي الأصلي
          </button>

          <button
            id="mode-overlay-btn"
            onClick={() => onSelectMode('renovation_overlay')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'renovation_overlay'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            التكسير والسباكة
          </button>

          <button
            id="mode-3d-btn"
            onClick={() => onSelectMode('3d_view')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === '3d_view'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            الرؤية ثلاثية الأبعاد 3D
          </button>

          <button
            id="mode-gallery-renders-btn"
            onClick={() => onSelectMode('gallery_renders')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'gallery_renders'
                ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                : 'text-amber-300 hover:text-stone-100 hover:bg-stone-900 bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>صور التصميم والمساحات</span>
          </button>
        </div>

        {/* Action Tools */}
        <div className="hidden md:flex items-center gap-2">
          {/* Sunlight Simulator Button */}
          <button
            id="header-sunlight-btn"
            onClick={onOpenSunlightSimulation}
            className="flex items-center gap-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg font-bold transition-all shadow-sm"
            title="محاكاة حركة الشمس ودخول الضوء الطبيعي والتهوية"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>محاكي ضوء الشمس</span>
          </button>

          {/* Export PDF for Contractors */}
          <button
            id="header-export-pdf-btn"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-3 py-2 rounded-lg font-bold transition-all shadow-sm disabled:opacity-50"
            title="تصدير المخطط التنفيذي المعتمد بالمقاسات كملف PDF للطباعة والتسليم للمقاولين"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>جاري إنشاء PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-emerald-400" />
                <span>تصدير المخطط PDF للمقاولين</span>
              </>
            )}
          </button>

          <button
            id="header-ai-advisor-btn"
            onClick={onOpenAiConsultant}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3 py-2 rounded-lg font-bold transition-all shadow-md shadow-amber-500/10"
            title="اسأل المهندس المعماري الذكي"
          >
            <Sparkles className="w-4 h-4" />
            استشارة المهندس AI
          </button>

          <button
            id="header-costs-btn"
            onClick={onOpenCostEstimator}
            className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-lg font-medium transition-all border border-stone-700"
            title="حاسبة تكاليف التشطيب والفرش"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            حاسبة التكاليف
          </button>

          <button
            id="header-guide-btn"
            onClick={onOpenGuide}
            className="p-2 text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-all border border-stone-700"
            title="دليل التعديلات المعمارية"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
