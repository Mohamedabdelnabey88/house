import React, { useState } from 'react';
import { ViewMode, RoomId } from './types';
import { ROOMS_DATA } from './data/apartmentData';
import { Header } from './components/Header';
import { BlueprintCanvas2D } from './components/BlueprintCanvas2D';
import { Isometric3DView } from './components/Isometric3DView';
import { ThreeVirtualWalkthrough } from './components/ThreeVirtualWalkthrough';
import { DesignGalleryAndDimensionsView } from './components/DesignGalleryAndDimensionsView';
import { RoomDetailPanel } from './components/RoomDetailPanel';
import { EngineeringFeasibilityTab } from './components/EngineeringFeasibilityTab';
import { CostEstimatorModal } from './components/CostEstimatorModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { GuideModal } from './components/GuideModal';
import { SunlightSimulationModal } from './components/SunlightSimulationModal';
import { generateContractorBlueprintPdf } from './utils/contractorPdfGenerator';
import { 
  Home, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Droplets, 
  Maximize2,
  Tv,
  Utensils,
  Bed,
  Bath,
  Wind,
  Sun,
  FileDown,
  Box
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>('3d_view');
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId | null>('lounge');
  const [activeTab, setActiveTab] = useState<'room_details' | 'engineering_report'>('room_details');
  const [bathroomVariant, setBathroomVariant] = useState<'shower' | 'jacuzzi'>('shower');
  const [useThreeWalkthrough, setUseThreeWalkthrough] = useState<boolean>(true);
  
  // Modals & Tools
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [isCostEstimatorOpen, setIsCostEstimatorOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSunlightModalOpen, setIsSunlightModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');

  const handleAskAiAboutRoom = (roomName: string) => {
    setAiInitialQuestion(`ما هي أفضل المقاسات الهندسية ومسارات التوزيع لـ ${roomName} في هذه الشقة؟`);
    setIsAiAdvisorOpen(true);
  };

  const handleOpenAi = () => {
    setAiInitialQuestion('');
    setIsAiAdvisorOpen(true);
  };

  const handleExportContractorPdf = async () => {
    try {
      setIsExportingPdf(true);
      await generateContractorBlueprintPdf({
        bathroomVariant,
        includeContractorNotes: true,
        includeDimensionsTable: true,
      });
      setPdfSuccessMessage('تم تصدير وتحميل المخطط المعماري المعتمد كملف PDF بنجاح!');
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('حدث خطأ أثناء تصدير المخطط، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* 1. Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onOpenAiConsultant={handleOpenAi}
        onOpenCostEstimator={() => setIsCostEstimatorOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSunlightSimulation={() => setIsSunlightModalOpen(true)}
        onExportPdf={handleExportContractorPdf}
        isExportingPdf={isExportingPdf}
        activeRoomId={selectedRoomId}
      />

      {/* Success Notification Banner for PDF */}
      {pdfSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{pdfSuccessMessage}</span>
        </div>
      )}

      {/* 2. Main Studio Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center Viewport: Blueprint or 3D Render (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Viewport Card */}
          <div className="h-[740px] w-full relative">
            {currentMode === 'gallery_renders' ? (
              <DesignGalleryAndDimensionsView
                selectedRoomId={selectedRoomId}
                onSelectRoom={(id) => {
                  setSelectedRoomId(id);
                  setActiveTab('room_details');
                }}
              />
            ) : currentMode === '3d_view' ? (
              useThreeWalkthrough ? (
                <div className="relative w-full h-full">
                  <ThreeVirtualWalkthrough
                    selectedRoomId={selectedRoomId}
                    onSelectRoom={(id) => {
                      setSelectedRoomId(id);
                      setActiveTab('room_details');
                    }}
                    bathroomVariant={bathroomVariant}
                  />
                  {/* Floating Switch to 2.5D Isometric SVG */}
                  <button
                    onClick={() => setUseThreeWalkthrough(false)}
                    className="absolute top-12 right-4 z-20 bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-lg"
                    title="التبديل إلى المنظور الأيزومتري الكلاسيكي"
                  >
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>عرض أيزومتري مسطح</span>
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Isometric3DView
                    selectedRoomId={selectedRoomId}
                    onSelectRoom={(id) => {
                      setSelectedRoomId(id);
                      setActiveTab('room_details');
                    }}
                    bathroomVariant={bathroomVariant}
                  />
                  {/* Floating Switch to Three.js WebGL */}
                  <button
                    onClick={() => setUseThreeWalkthrough(true)}
                    className="absolute top-12 right-4 z-20 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-lg shadow-amber-500/20"
                    title="التبديل إلى التجول التفاعلي ثلاثي الأبعاد بالكامل Three.js"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تجول Three.js ثلاثي الأبعاد</span>
                  </button>
                </div>
              )
            ) : (
              <BlueprintCanvas2D
                currentMode={currentMode}
                selectedRoomId={selectedRoomId}
                onSelectRoom={(id) => {
                  setSelectedRoomId(id);
                  setActiveTab('room_details');
                }}
                bathroomVariant={bathroomVariant}
                onToggleBathroomVariant={setBathroomVariant}
                onOpenSunlightSimulation={() => setIsSunlightModalOpen(true)}
                onExportPdf={handleExportContractorPdf}
              />
            )}
          </div>

          {/* Quick Room Navigator Bar & Simulation Shortcuts */}
          <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium hidden sm:inline">
                تنقل سريع بين الغرف:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.keys(ROOMS_DATA) as RoomId[]).map((rId) => {
                  const r = ROOMS_DATA[rId];
                  const isSelected = selectedRoomId === rId;
                  return (
                    <button
                      key={rId}
                      id={`nav-room-${rId}`}
                      onClick={() => {
                        setSelectedRoomId(rId);
                        setActiveTab('room_details');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                          : 'bg-stone-950/70 hover:bg-stone-800 text-stone-300 border border-stone-800'
                      }`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: r.colorTheme }}
                      />
                      <span>{r.name.split(' ')[0]}</span>
                      <span className="opacity-80 font-normal text-[11px]">({r.arabicName.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Simulation & PDF Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSunlightModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                title="محاكاة دخول ضوء الشمس والتهوية"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>محاكي الشمس والضوء</span>
              </button>

              <button
                onClick={handleExportContractorPdf}
                disabled={isExportingPdf}
                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                title="تحميل المخطط التنفيذي PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">PDF المقاولين</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Room Details or Feasibility Analysis (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Tab Switcher */}
          <div className="bg-stone-900 p-1.5 rounded-2xl border border-stone-800 flex items-center gap-1 text-xs">
            <button
              id="tab-room-details-btn"
              onClick={() => setActiveTab('room_details')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                activeTab === 'room_details'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              تفاصيل الغرفة والفرش
            </button>
            <button
              id="tab-engineering-report-btn"
              onClick={() => setActiveTab('engineering_report')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
                activeTab === 'engineering_report'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              التقرير الهندسي والجدوى
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'room_details' ? (
            <RoomDetailPanel
              roomId={selectedRoomId}
              onClose={() => setSelectedRoomId(null)}
              onAskAiAboutRoom={handleAskAiAboutRoom}
              bathroomVariant={bathroomVariant}
              onToggleBathroomVariant={setBathroomVariant}
            />
          ) : (
            <div className="max-h-[740px] overflow-y-auto pr-1">
              <EngineeringFeasibilityTab />
            </div>
          )}

          {/* Key Feasibility Guarantee Badges */}
          <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              ضمانات التصميم المعماري:
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>الحمام الماستر:</strong> صرف فوري مباشر على منور 1 دون تكسير خرسانة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>المطبخ المودرن:</strong> تهوية كاملة على منور 2 وقرب من الصالة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>المحددات الثابتة:</strong> البلكونة ومنور 1 ومنور 2 محفوظة 100%.</span>
              </li>
            </ul>
          </div>

        </div>

      </main>

      {/* 3. Modals */}
      <CostEstimatorModal
        isOpen={isCostEstimatorOpen}
        onClose={() => setIsCostEstimatorOpen(false)}
      />

      <AIConsultantModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        initialQuestion={aiInitialQuestion}
        contextRoom={selectedRoomId ? ROOMS_DATA[selectedRoomId]?.arabicName : null}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <SunlightSimulationModal
        isOpen={isSunlightModalOpen}
        onClose={() => setIsSunlightModalOpen(false)}
        selectedRoomId={selectedRoomId}
        onSelectRoom={(id) => {
          setSelectedRoomId(id);
          setActiveTab('room_details');
        }}
      />

    </div>
  );
}
