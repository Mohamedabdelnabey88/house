import React, { useState } from 'react';
import { ViewMode, RoomId } from '../types';
import { ROOMS_DATA, PLUMBING_PATHS } from '../data/apartmentData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sliders,
  CheckCircle2,
  Sparkles,
  Bath,
  Tv,
  Utensils,
  Bed,
  Info,
  Sun,
  FileDown
} from 'lucide-react';

interface BlueprintCanvas2DProps {
  currentMode: ViewMode;
  selectedRoomId: RoomId | null;
  onSelectRoom: (roomId: RoomId) => void;
  bathroomVariant: 'shower' | 'jacuzzi';
  onToggleBathroomVariant: (variant: 'shower' | 'jacuzzi') => void;
  onOpenSunlightSimulation?: () => void;
  onExportPdf?: () => void;
}

export const BlueprintCanvas2D: React.FC<BlueprintCanvas2DProps> = ({
  currentMode,
  selectedRoomId,
  onSelectRoom,
  bathroomVariant,
  onToggleBathroomVariant,
  onOpenSunlightSimulation,
  onExportPdf,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showPlumbing, setShowPlumbing] = useState<boolean>(currentMode === 'renovation_overlay');

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  // Helper to render room background and hover effects
  const renderRoomZone = (
    id: RoomId, 
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    label: string, 
    subLabel: string,
    area: string,
    fillColor: string = 'rgba(30, 41, 59, 0.4)'
  ) => {
    const isSelected = selectedRoomId === id;
    const isProposed = currentMode === 'proposed' || currentMode === 'renovation_overlay';

    return (
      <g 
        id={`room-${id}`}
        className="cursor-pointer transition-all duration-200 group"
        onClick={() => onSelectRoom(id)}
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={isSelected ? 'rgba(245, 158, 11, 0.22)' : fillColor}
          stroke={isSelected ? '#f59e0b' : 'rgba(148, 163, 184, 0.4)'}
          strokeWidth={isSelected ? '3' : '1.5'}
          className="transition-all duration-200 group-hover:fill-amber-500/15"
          rx="4"
        />

        {/* Room Label Badge */}
        <g transform={`translate(${x + w / 2}, ${y + (h > 150 ? 40 : h / 2)})`}>
          <rect
            x="-85"
            y="-22"
            width="170"
            height="44"
            rx="8"
            fill={isSelected ? 'rgba(245, 158, 11, 0.95)' : 'rgba(15, 23, 42, 0.88)'}
            stroke={isSelected ? '#d97706' : 'rgba(255,255,255,0.15)'}
            strokeWidth="1"
            className="filter drop-shadow-md"
          />
          <text
            x="0"
            y="-4"
            textAnchor="middle"
            fill={isSelected ? '#18181b' : '#f8fafc'}
            fontSize="13"
            fontWeight="bold"
            fontFamily="Cairo, sans-serif"
          >
            {label}
          </text>
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fill={isSelected ? '#27272a' : '#94a3b8'}
            fontSize="10"
            fontFamily="Cairo, sans-serif"
          >
            {subLabel} • {area}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
      
      {/* Blueprint Toolbar */}
      <div className="bg-stone-900/90 backdrop-blur border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        
        {/* Layer Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-400 font-medium flex items-center gap-1.5 ml-1">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            طبقات الرسم:
          </span>

          <button
            id="toggle-furniture-btn"
            onClick={() => setShowFurniture(!showFurniture)}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              showFurniture ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-800 text-stone-400'
            }`}
          >
            {showFurniture ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            قطع الأثاث
          </button>

          <button
            id="toggle-dimensions-btn"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              showDimensions ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-800 text-stone-400'
            }`}
          >
            {showDimensions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            المقاسات والأبعاد
          </button>

          <button
            id="toggle-plumbing-btn"
            onClick={() => setShowPlumbing(!showPlumbing)}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              showPlumbing ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-stone-800 text-stone-400'
            }`}
          >
            {showPlumbing ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            شبكة الصرف والمناور
          </button>
        </div>

        {/* Bathroom Variant Selector */}
        {(currentMode === 'proposed' || currentMode === 'renovation_overlay') && (
          <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-lg border border-stone-800">
            <span className="text-stone-400 text-[11px] px-1.5 font-medium flex items-center gap-1">
              <Bath className="w-3 h-3 text-teal-400" />
              الحمام الرئيسي:
            </span>
            <button
              id="bathroom-shower-btn"
              onClick={() => onToggleBathroomVariant('shower')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                bathroomVariant === 'shower' ? 'bg-teal-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              شاور بوكس 120سم
            </button>
            <button
              id="bathroom-jacuzzi-btn"
              onClick={() => onToggleBathroomVariant('jacuzzi')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                bathroomVariant === 'jacuzzi' ? 'bg-teal-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              جاكوزي استرخاء
            </button>
          </div>
        )}

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5">
          {onOpenSunlightSimulation && (
            <button
              onClick={onOpenSunlightSimulation}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              title="محاكاة دخول ضوء الشمس الطبيعي"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">محاكي الشمس</span>
            </button>
          )}

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              title="تصدير المخطط التنفيذي PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">تصدير PDF</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-stone-950 px-1 py-1 rounded-lg border border-stone-800">
            <button 
              id="zoom-out-btn"
              onClick={handleZoomOut} 
              className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded" 
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-stone-300 px-1.5">{Math.round(zoomLevel * 100)}%</span>
            <button 
              id="zoom-in-btn"
              onClick={handleZoomIn} 
              className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded" 
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              id="zoom-reset-btn"
              onClick={handleResetZoom} 
              className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded" 
              title="إعادة ضبط"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Interactive SVG Canvas */}
      <div className="flex-1 w-full h-full overflow-auto bg-blueprint p-4 flex items-center justify-center select-none">
        <div 
          className="transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            id="apartment-blueprint-svg"
            viewBox="0 0 1000 1360"
            className="w-[780px] h-[1060px] drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pattern for Shafts */}
              <pattern id="shaftHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="1.5" />
              </pattern>

              {/* Pattern for Wood Parquet */}
              <pattern id="parquetPattern" width="24" height="12" patternUnits="userSpaceOnUse">
                <rect width="24" height="12" fill="#2d2218" />
                <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" />
                <line x1="0" y1="12" x2="24" y2="12" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" />
                <line x1="12" y1="0" x2="12" y2="12" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" />
              </pattern>

              {/* Pattern for Tiles */}
              <pattern id="tilePattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#1e293b" />
                <rect width="20" height="20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>

              {/* Glow filter */}
              <filter id="accentGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Accent */}
            <rect x="30" y="10" width="940" height="1330" fill="#090d16" stroke="#1e293b" strokeWidth="2" rx="12" />

            {/* ==================================================== */}
            {/* 1. ROOM ZONES (CLICKABLE & LABELED)                  */}
            {/* ==================================================== */}

            {/* BALCONY (Top Left - Expanded with Traditional Oven) */}
            {renderRoomZone(
              'balcony', 
              60, 20, 400, 100, 
              'البلكونة الموسعة (فرن بلدي)', 
              'فرن بلدي أصلي + جلسة روقان ونباتات', 
              '3.18×1.50 م (4.77 م²)',
              'rgba(132, 204, 22, 0.15)'
            )}

            {/* KIDS ROOM (Top Left, under balcony - originally Master Bedroom) */}
            {renderRoomZone(
              'kids_room', 
              60, 120, 400, 320, 
              currentMode === 'original' ? 'غرفة الماستر الأصلية' : 'غرفة نوم الأطفال المجددة',
              currentMode === 'original' ? 'غرفة النوم الرئيسية القديمة' : 'سريرين + مكتب + دولاب + مدخل البلكونة', 
              '3.18×3.65 م (11.60 م²)',
              'url(#parquetPattern)'
            )}

            {/* MASTER SUITE (Top Right - originally Kids Room 1) */}
            {renderRoomZone(
              'master_suite', 
              540, 30, 400, 420, 
              currentMode === 'original' ? 'Kids Room 1' : 'جناح الماستر الملكي الفسيح', 
              currentMode === 'original' ? 'غرفة أطفال سابقة' : 'سرير كينج + دريسنج وتسريحة + حمام ماستر بجاكوزي', 
              '5.30×3.40 م (20.20 م²)',
              'url(#parquetPattern)'
            )}

            {/* NEW KITCHEN / GIRLS ROOM (Middle Left - Expanded into Kids Room) */}
            {renderRoomZone(
              'kitchen_new', 
              60, 440, 400, 320, 
              currentMode === 'original' ? 'girls room 1' : 'المطبخ الحديث الموسع', 
              currentMode === 'original' ? 'غرفة بنات سابقة' : 'كاونتر U + بار إفطار مفتوح + غسالة وأجهزة مدمجة', 
              '3.10×3.65 م (11.32 م²)',
              'url(#tilePattern)'
            )}

            {/* MAIN BATHROOM (Middle Right - Expanded into Living Room) */}
            {renderRoomZone(
              'bathroom_main', 
              540, 450, 155, 250, 
              'الحمام الرئيسي الموسع', 
              'كابينة شاور سيكوريت عريضة + قاعدة معلقة وحوض مودرن', 
              '2.38×1.55 م (3.69 م²)',
              'url(#tilePattern)'
            )}

            {/* SHAFT 1 (منور 1 - Right Side between Kids 1 and Kitchen) */}
            <g 
              id="room-shaft_1"
              className="cursor-pointer"
              onClick={() => onSelectRoom('shaft_1')}
            >
              <rect x="695" y="450" width="245" height="250" fill="url(#shaftHatch)" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
              <rect x="740" y="555" width="150" height="40" rx="8" fill="rgba(15,23,42,0.9)" stroke="#64748b" strokeWidth="1" />
              <text x="815" y="580" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="bold" fontFamily="Cairo, sans-serif">
                منور 1 (ثابت)
              </text>
            </g>

            {/* SHAFT 2 (منور 2 - Middle Left facing corridor) */}
            <g 
              id="room-shaft_2"
              className="cursor-pointer"
              onClick={() => onSelectRoom('shaft_2')}
            >
              <rect x="60" y="760" width="400" height="240" fill="url(#shaftHatch)" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
              <rect x="180" y="860" width="160" height="44" rx="8" fill="rgba(15,23,42,0.9)" stroke="#64748b" strokeWidth="1" />
              <text x="260" y="888" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="bold" fontFamily="Cairo, sans-serif">
                منور 2 (ثابت)
              </text>
            </g>

            {/* LIVING ROOM / OLD KITCHEN (Bottom Right) */}
            {renderRoomZone(
              'kitchen_old', 
              540, 700, 400, 300, 
              currentMode === 'original' ? 'Kitchen الأصلي' : 'غرفة المعيشة العائلية المريحة', 
              currentMode === 'original' ? 'المطبخ في التصميم القديم' : 'ركنة L-Shape مريحة + شاشة 65 بوصة (منشرحة ومريحة)', 
              '3.10×3.15 م (9.77 م²)',
              currentMode === 'original' ? 'url(#tilePattern)' : 'url(#parquetPattern)'
            )}

            {/* CENTRAL CORRIDOR (Connecting Hallway) */}
            <rect x="460" y="110" width="80" height="890" fill="#1e293b" opacity="0.6" />
            <text x="500" y="550" transform="rotate(-90 500 550)" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Cairo">
              ممر التوزيع الداخلي (عرض 1.15 م)
            </text>

            {/* LOUNGE & RECEPTION (Very Bottom) */}
            {renderRoomZone(
              'lounge', 
              60, 1000, 880, 320, 
              'الصالة والاستقبال (Lounge)', 
              'سفرة ونيش وبوفيه + أنتريه وشاشة + كوفي كورنر وجزامة مدخل', 
              '7.51×3.51 م (33.14 م²)',
              'url(#tilePattern)'
            )}

            {/* ==================================================== */}
            {/* 2. ENTRANCE ARROW & DOORWAY                          */}
            {/* ==================================================== */}
            <g transform="translate(10, 1040)">
              {/* Entrance Arrow pointing right into the lounge */}
              <polygon points="10,25 35,25 35,15 55,30 35,45 35,35 10,35" fill="#f59e0b" filter="url(#accentGlow)" />
              <text x="-5" y="70" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                مدخل الشقة الرئيسي
              </text>
              {/* Apartment entrance door swing */}
              <path d="M 60 1010 A 50 50 0 0 1 110 1060" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="60" y1="1010" x2="60" y2="1060" stroke="#f59e0b" strokeWidth="3" />
            </g>

            {/* ==================================================== */}
            {/* 3. WALLS & PARTITIONS RENDERING                      */}
            {/* ==================================================== */}

            {/* Exterior & Main Structural Walls (Solid Dark Slate with crisp borders) */}
            {/* Outer Box */}
            <rect x="55" y="35" width="410" height="970" fill="none" stroke="#94a3b8" strokeWidth="6" />
            <rect x="535" y="35" width="410" height="970" fill="none" stroke="#94a3b8" strokeWidth="6" />
            <rect x="55" y="995" width="890" height="330" fill="none" stroke="#94a3b8" strokeWidth="7" />

            {/* Internal partitions */}
            {/* Balcony wall (at y=120) */}
            <line x1="60" y1="120" x2="460" y2="120" stroke="#64748b" strokeWidth="5" />
            {/* Kids Room & Kitchen partition (at y=440 - expanded kitchen) */}
            <line x1="60" y1="440" x2="460" y2="440" stroke="#64748b" strokeWidth="5" />
            {/* Kitchen & Shaft 2 partition */}
            <line x1="60" y1="760" x2="460" y2="760" stroke="#64748b" strokeWidth="5" />

            {/* Corridor walls */}
            <line x1="460" y1="120" x2="460" y2="1000" stroke="#64748b" strokeWidth="5" />
            <line x1="540" y1="30" x2="540" y2="1000" stroke="#64748b" strokeWidth="5" />

            {/* Bathroom walls (Main Bathroom expanded into living room: y=450 to 700) */}
            <line x1="540" y1="450" x2="695" y2="450" stroke="#64748b" strokeWidth="5" />
            <line x1="695" y1="450" x2="695" y2="700" stroke="#64748b" strokeWidth="5" />
            <line x1="540" y1="700" x2="940" y2="700" stroke="#64748b" strokeWidth="5" />
            <line x1="540" y1="1000" x2="940" y2="1000" stroke="#64748b" strokeWidth="6" />

            {/* PROPOSED NEW WALLS: Master En-Suite Bathroom (with Jacuzzi) & Dressing + Vanity */}
            {(currentMode === 'proposed' || currentMode === 'renovation_overlay') && (
              <g id="proposed-master-walls">
                {/* Bathroom partition inside Master Room (connecting directly to Shaft 1 for plumbing) */}
                <rect 
                  x="720" 
                  y="270" 
                  width="220" 
                  height="180" 
                  fill="rgba(139, 92, 246, 0.15)" 
                  stroke={currentMode === 'renovation_overlay' ? '#10b981' : '#8b5cf6'} 
                  strokeWidth="3"
                  strokeDasharray={currentMode === 'renovation_overlay' ? '4 2' : 'none'}
                />
                <line 
                  x1="720" 
                  y1="270" 
                  x2="940" 
                  y2="270" 
                  stroke={currentMode === 'renovation_overlay' ? '#10b981' : '#8b5cf6'} 
                  strokeWidth="5" 
                />
                <line 
                  x1="720" 
                  y1="270" 
                  x2="720" 
                  y2="450" 
                  stroke={currentMode === 'renovation_overlay' ? '#10b981' : '#8b5cf6'} 
                  strokeWidth="5" 
                />

                {/* Dressing & Vanity divider zone */}
                <line 
                  x1="550" 
                  y1="270" 
                  x2="710" 
                  y2="270" 
                  stroke="#a78bfa" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                />

                <text x="830" y="340" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                  حمام ماستر خاص (بجاكوزي)
                </text>
                <text x="830" y="358" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="Cairo">
                  (جاكوزي استرخاء + قاعدة + حوض)
                </text>
                <text x="635" y="315" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  دريسنج روم واسع
                </text>
                <text x="635" y="332" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="Cairo">
                  + تسريحة مدمجة بمراية
                </text>
              </g>
            )}

            {/* DEMOLITION / MODIFICATION HIGHLIGHTS IN OVERLAY MODE */}
            {currentMode === 'renovation_overlay' && (
              <g id="demolition-overlay-layer">
                {/* Kitchen door removal / American bar opening */}
                <line x1="420" y1="620" x2="460" y2="740" stroke="#ef4444" strokeWidth="6" strokeDasharray="4 3" />
                <rect x="360" y="720" width="130" height="24" rx="4" fill="rgba(239, 68, 68, 0.9)" />
                <text x="425" y="736" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                  بار أمريكي مفتوح
                </text>

                {/* Master bathroom new construction label */}
                <rect x="730" y="240" width="200" height="24" rx="4" fill="rgba(16, 185, 129, 0.9)" />
                <text x="830" y="256" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                  + بناء حمام ماستر بجاكوزي
                </text>
              </g>
            )}

            {/* ==================================================== */}
            {/* 4. PLUMBING & DRAINAGE NETWORK                       */}
            {/* ==================================================== */}
            {showPlumbing && (
              <g id="plumbing-network-layer">
                {/* Master Jacuzzi Drainage line to Shaft 1 */}
                <path 
                  d="M 860 410 L 860 455 L 750 455" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="4" 
                  strokeDasharray="6 3" 
                />
                <circle cx="860" cy="410" r="6" fill="#a855f7" />
                <circle cx="750" cy="455" r="8" fill="#8b5cf6" />
                <text x="810" y="445" fill="#c4b5fd" fontSize="9" fontFamily="Cairo">صرف الجاكوزي لمنور 1</text>

                {/* Main Bath Shower Drainage line to Shaft 1 */}
                <path 
                  d="M 610 520 L 695 520" 
                  fill="none" 
                  stroke="#14b8a6" 
                  strokeWidth="4" 
                  strokeDasharray="6 3" 
                />
                <circle cx="695" cy="520" r="7" fill="#14b8a6" />
                <text x="650" y="510" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="Cairo">صرف الحمام لمنور 1</text>

                {/* New Kitchen Drainage line to Shaft 2 */}
                <path 
                  d="M 220 540 L 220 760" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray="6 3" 
                />
                <circle cx="220" cy="540" r="5" fill="#10b981" />
                <circle cx="220" cy="760" r="7" fill="#10b981" />
                <text x="230" y="650" fill="#6ee7b7" fontSize="9" fontFamily="Cairo">صرف الحوض والغسالة لمنور 2</text>
              </g>
            )}

            {/* ==================================================== */}
            {/* 5. FURNITURE LAYOUT (HIGH FIDELITY)                  */}
            {/* ==================================================== */}
            {showFurniture && (currentMode === 'proposed' || currentMode === 'renovation_overlay') && (
              <g id="proposed-furniture-layer">
                
                {/* --- A. LOUNGE FURNITURE --- */}
                {/* 1. Dining Table (سفرة 6-8 أفراد) */}
                <g transform="translate(600, 1100)">
                  {/* Table top */}
                  <rect x="0" y="0" width="180" height="90" rx="8" fill="#78350f" stroke="#d97706" strokeWidth="2" />
                  <text x="90" y="42" textAnchor="middle" fill="#fef3c7" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                    طاولة السفرة
                  </text>
                  <text x="90" y="58" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="Cairo">
                    180×95 سم (6-8 كراسي)
                  </text>
                  {/* Dining Chairs */}
                  {/* Top chairs */}
                  <rect x="15" y="-18" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                  <rect x="72" y="-18" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                  <rect x="129" y="-18" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                  {/* Bottom chairs */}
                  <rect x="15" y="93" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                  <rect x="72" y="93" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                  <rect x="129" y="93" width="36" height="15" rx="3" fill="#92400e" stroke="#d97706" />
                </g>

                {/* 2. China Display Cabinet (نيش) */}
                <g transform="translate(820, 1020)">
                  <rect x="0" y="0" width="105" height="40" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                  <line x1="35" y1="0" x2="35" y2="40" stroke="#6366f1" strokeWidth="1" />
                  <line x1="70" y1="0" x2="70" y2="40" stroke="#6366f1" strokeWidth="1" />
                  <text x="52" y="24" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                    نيش زجاجي مودرن
                  </text>
                </g>

                {/* 3. Dining Buffet (بوفيه) */}
                <g transform="translate(600, 1260)">
                  <rect x="0" y="0" width="180" height="40" rx="4" fill="#451a03" stroke="#b45309" strokeWidth="1.5" />
                  <text x="90" y="24" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                    بوفيه عريض + مرآة جدارية
                  </text>
                </g>

                {/* 4. Salon / Living seating (انتريه) */}
                <g transform="translate(160, 1110)">
                  {/* 3-seater sofa */}
                  <rect x="0" y="80" width="190" height="55" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  <text x="95" y="112" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                    كنبة 3 مقاعد
                  </text>
                  {/* 2-seater sofa */}
                  <rect x="0" y="0" width="55" height="80" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  {/* Coffee table */}
                  <rect x="70" y="20" width="80" height="45" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="110" y="47" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Cairo">طاولة وسطية</text>
                  {/* Single armchair (فوتيه) */}
                  <rect x="165" y="0" width="50" height="50" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                </g>

                {/* 5. Lounge TV Screen & Wall (شاشة الصالة) */}
                <g transform="translate(160, 1010)">
                  <rect x="0" y="0" width="180" height="24" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="90" y="16" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                    شاشة 65 بوصة + بديل خشب ورخام
                  </text>
                </g>

                {/* 6. Shoe Rack / Console (جزامة المدخل) */}
                <g transform="translate(70, 1015)">
                  <rect x="0" y="0" width="65" height="30" rx="4" fill="#57534e" stroke="#a8a29e" strokeWidth="1.5" />
                  <text x="32" y="19" textAnchor="middle" fill="#fafaf9" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                    جزامة + مرآة
                  </text>
                </g>

                {/* 7. Coffee Corner (كوفي كورنر) */}
                <g transform="translate(70, 1220)">
                  <rect x="0" y="0" width="70" height="45" rx="4" fill="#713f12" stroke="#eab308" strokeWidth="1.5" />
                  <text x="35" y="27" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                    كوفي كورنر ☕
                  </text>
                </g>

                {/* --- B. NEW LIVING ROOM (غرفة المعيشة الجديدة - مكان المطبخ القديم) --- */}
                <g transform="translate(560, 710)">
                  {/* L-Shape Sectional Sofa */}
                  <path d="M 80 0 L 280 0 L 280 180 L 210 180 L 210 70 L 80 70 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
                  <text x="245" y="90" textAnchor="middle" fill="#dbeafe" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                    ركنة L-Shape
                  </text>
                  <text x="140" y="38" textAnchor="middle" fill="#bfdbfe" fontSize="10" fontFamily="Cairo">
                    جلسة عائلية مريحة
                  </text>
                  {/* Center table */}
                  <rect x="120" y="95" width="70" height="50" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="155" y="125" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="Cairo">طاولة ضيافة</text>
                  {/* Wall-mounted TV facing couch */}
                  <rect x="0" y="60" width="16" height="130" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <text x="-12" y="130" transform="rotate(-90 -12 130)" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                    شاشة 65 بوصة
                  </text>
                </g>

                {/* --- C. NEW SMART KITCHEN (المطبخ الحديث الموسع - مكان غرفة البنات) --- */}
                <g transform="translate(75, 455)">
                  {/* U-Shape Kitchen Countertops */}
                  <path d="M 0 0 L 365 0 L 365 70 L 75 70 L 75 220 L 0 220 Z" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                  
                  {/* Refrigerator */}
                  <rect x="5" y="225" width="65" height="70" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" />
                  <text x="37" y="265" textAnchor="middle" fill="#ccfbf1" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                    ثلاجة 20 قدم
                  </text>

                  {/* Built-in Cooker & Hood */}
                  <rect x="15" y="10" width="55" height="50" rx="4" fill="#111827" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="28" cy="23" r="6" fill="#f59e0b" opacity="0.8" />
                  <circle cx="52" cy="23" r="6" fill="#f59e0b" opacity="0.8" />
                  <circle cx="28" cy="47" r="6" fill="#f59e0b" opacity="0.8" />
                  <circle cx="52" cy="47" r="6" fill="#f59e0b" opacity="0.8" />
                  <circle cx="40" cy="35" r="4" fill="#ef4444" />
                  <text x="42" y="-8" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="Cairo">بوتاجاز بلت-إن</text>

                  {/* Double Sink under shaft window */}
                  <rect x="110" y="10" width="70" height="40" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="145" y1="10" x2="145" y2="50" stroke="#38bdf8" strokeWidth="1" />
                  <text x="145" y="-6" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="Cairo">حوض بحلتين</text>

                  {/* Washing Machine */}
                  <rect x="205" y="10" width="48" height="48" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="229" cy="34" r="15" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  <text x="229" y="-6" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="Cairo">غسالة</text>

                  {/* Microwave & Oven Tower */}
                  <rect x="275" y="10" width="55" height="48" rx="4" fill="#1e293b" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="302" y="38" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold" fontFamily="Cairo">
                    فرن + ميكرويف
                  </text>

                  {/* American Breakfast Bar (بار إفطار أمريكي يطل على الممر) */}
                  <g transform="translate(230, 230)">
                    <rect x="0" y="0" width="140" height="45" rx="6" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="2" />
                    <text x="70" y="27" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                      بار إفطار أمريكي مفتوح
                    </text>
                    {/* Bar stools */}
                    <circle cx="35" cy="58" r="10" fill="#4338ca" stroke="#818cf8" strokeWidth="1.5" />
                    <circle cx="105" cy="58" r="10" fill="#4338ca" stroke="#818cf8" strokeWidth="1.5" />
                  </g>
                </g>

                {/* --- D. MASTER BEDROOM SUITE (جناح الماستر الملكي الفسيح) --- */}
                <g transform="translate(555, 45)">
                  {/* King Bed 180x200 cm */}
                  <g transform="translate(60, 15)">
                    <rect x="0" y="0" width="180" height="170" rx="8" fill="#4c1d95" stroke="#a78bfa" strokeWidth="2" />
                    {/* Headboard */}
                    <rect x="0" y="0" width="180" height="24" rx="4" fill="#5b21b6" />
                    {/* Pillows */}
                    <rect x="15" y="32" width="65" height="35" rx="5" fill="#f5f3ff" />
                    <rect x="100" y="32" width="65" height="35" rx="5" fill="#f5f3ff" />
                    <text x="90" y="115" textAnchor="middle" fill="#ede9fe" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                      سرير كينج 180×200 سم
                    </text>
                  </g>
                  {/* 2 Nightstands */}
                  <rect x="10" y="15" width="40" height="35" rx="4" fill="#3b0764" stroke="#c084fc" strokeWidth="1" />
                  <rect x="250" y="15" width="40" height="35" rx="4" fill="#3b0764" stroke="#c084fc" strokeWidth="1" />

                  {/* TV Screen facing Bed */}
                  <rect x="60" y="200" width="180" height="14" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="150" y="211" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                    شاشة معلقة 55 بوصة
                  </text>

                  {/* --- DRESSING ROOM & VANITY ZONE --- */}
                  {/* 1. Large Dressing Wardrobe (دولاب دريسنج عريض 3.00 م) */}
                  <rect x="0" y="240" width="150" height="60" rx="4" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
                  <text x="75" y="275" textAnchor="middle" fill="#f3e8ff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                    دولاب دريسنج واسع
                  </text>
                  <text x="75" y="290" textAnchor="middle" fill="#d8b4fe" fontSize="8" fontFamily="Cairo">
                    (أرفف + تعليق فساتين)
                  </text>

                  {/* 2. Vanity Dressing Table with LED Mirror (تسريحة مدمجة بمراية وبف) */}
                  <g transform="translate(0, 310)">
                    <rect x="0" y="0" width="150" height="42" rx="4" fill="#4a044e" stroke="#f472b6" strokeWidth="2" />
                    <text x="75" y="22" textAnchor="middle" fill="#fdf2f8" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                      تسريحة مدمجة + مراية LED
                    </text>
                    {/* Vanity Stool / Pouf */}
                    <circle cx="75" cy="55" r="11" fill="#be185d" stroke="#f472b6" strokeWidth="1.5" />
                    <text x="75" y="58" textAnchor="middle" fill="#fff" fontSize="7">بف</text>
                  </g>

                  {/* --- PRIVATE EN-SUITE MASTER BATHROOM (WITH JACUZZI) --- */}
                  <g transform="translate(170, 230)">
                    {/* Corner Luxury Jacuzzi Tub */}
                    <g transform="translate(45, 10)">
                      <rect x="0" y="0" width="145" height="85" rx="10" fill="rgba(6, 182, 212, 0.35)" stroke="#06b6d4" strokeWidth="2" />
                      {/* Inner contoured bath shape */}
                      <ellipse cx="72" cy="42" rx="60" ry="32" fill="#0891b2" stroke="#67e8f9" strokeWidth="1.5" />
                      {/* Hydromassage jets */}
                      <circle cx="25" cy="42" r="3" fill="#a5f3fc" />
                      <circle cx="120" cy="42" r="3" fill="#a5f3fc" />
                      <circle cx="72" cy="18" r="3" fill="#a5f3fc" />
                      <circle cx="72" cy="66" r="3" fill="#a5f3fc" />
                      <text x="72" y="46" textAnchor="middle" fill="#ecfeff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                        جاكوزي مساج مائي ♨️
                      </text>
                    </g>

                    {/* Wall-hung Toilet */}
                    <rect x="10" y="20" width="30" height="35" rx="10" fill="#f8fafc" stroke="#94a3b8" />
                    <text x="25" y="42" textAnchor="middle" fill="#334155" fontSize="7" fontWeight="bold">تواليت</text>

                    {/* Vanity Basin Sink */}
                    <rect x="5" y="70" width="36" height="30" rx="3" fill="#38bdf8" stroke="#0284c7" />
                    <text x="23" y="88" textAnchor="middle" fill="#082f49" fontSize="7" fontWeight="bold">حوض</text>
                  </g>
                </g>

                {/* --- E. KIDS BEDROOM (غرفة الأطفال - غرفة الماستر الأصلية سابقاً) --- */}
                <g transform="translate(75, 135)">
                  {/* Bed 1 (120x195 cm) */}
                  <g transform="translate(15, 15)">
                    <rect x="0" y="0" width="105" height="150" rx="6" fill="#083344" stroke="#06b6d4" strokeWidth="2" />
                    <rect x="0" y="0" width="105" height="18" rx="3" fill="#155e75" />
                    <rect x="15" y="25" width="75" height="28" rx="4" fill="#ecfeff" />
                    <text x="52" y="95" textAnchor="middle" fill="#cffafe" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                      سرير 1 (120 سم)
                    </text>
                  </g>

                  {/* Middle Nightstand */}
                  <rect x="130" y="15" width="35" height="35" rx="4" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />

                  {/* Bed 2 (120x195 cm) */}
                  <g transform="translate(175, 15)">
                    <rect x="0" y="0" width="105" height="150" rx="6" fill="#083344" stroke="#06b6d4" strokeWidth="2" />
                    <rect x="0" y="0" width="105" height="18" rx="3" fill="#155e75" />
                    <rect x="15" y="25" width="75" height="28" rx="4" fill="#ecfeff" />
                    <text x="52" y="95" textAnchor="middle" fill="#cffafe" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                      سرير 2 (120 سم)
                    </text>
                  </g>

                  {/* Study Desk near window & balcony (مكتب دراسة) */}
                  <g transform="translate(15, 200)">
                    <rect x="0" y="0" width="115" height="48" rx="4" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                    <rect x="35" y="10" width="35" height="25" rx="3" fill="#0f172a" stroke="#64748b" />
                    <text x="57" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                      مكتب مذاكرة + شمس
                    </text>
                  </g>

                  {/* Kids Wardrobe (دولاب أطفال 3 درف) */}
                  <g transform="translate(155, 200)">
                    <rect x="0" y="0" width="155" height="52" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="77" y="32" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                      دولاب أطفال كبير (3 درف)
                    </text>
                  </g>
                </g>

                {/* --- F. EXPANDED BALCONY (بلكونة موسعة + فرن بلدي وجلسة) --- */}
                <g transform="translate(75, 30)">
                  {/* Traditional Mud/Brick Oven with Chimney (فرن بلدي أصلي) */}
                  <g transform="translate(10, 5)">
                    {/* Thermal dome / firebrick base */}
                    <rect x="0" y="0" width="95" height="65" rx="8" fill="#78350f" stroke="#ea580c" strokeWidth="2" />
                    <circle cx="47" cy="32" r="22" fill="#c2410c" stroke="#f97316" strokeWidth="1.5" />
                    <circle cx="47" cy="32" r="14" fill="#451a03" />
                    {/* Flames glow in oven mouth */}
                    <circle cx="47" cy="32" r="8" fill="#fbbf24" opacity="0.9" />
                    {/* Chimney */}
                    <rect x="70" y="-8" width="18" height="15" rx="2" fill="#334155" stroke="#64748b" />
                    <text x="47" y="58" textAnchor="middle" fill="#ffedd5" fontSize="9" fontWeight="bold" fontFamily="Cairo">
                      فرن بلدي أصلي 🥖
                    </text>
                  </g>

                  {/* Dough preparation table / Tabliya (طبلية / بنش تحضير المخبوزات) */}
                  <g transform="translate(115, 12)">
                    <rect x="0" y="0" width="65" height="50" rx="6" fill="#593414" stroke="#d97706" strokeWidth="1.5" />
                    <text x="32" y="28" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold" fontFamily="Cairo">
                      طبلية تحضير
                    </text>
                    <text x="32" y="40" textAnchor="middle" fill="#fde68a" fontSize="7" fontFamily="Cairo">
                      المخبوزات
                    </text>
                  </g>

                  {/* Outdoor Wicker Chairs & Table (جلسة روقان) */}
                  <g transform="translate(195, 12)">
                    <rect x="0" y="0" width="120" height="50" rx="6" fill="rgba(132, 204, 22, 0.2)" stroke="#84cc16" strokeWidth="1" />
                    <circle cx="25" cy="25" r="14" fill="#3f6212" stroke="#a3e635" />
                    <circle cx="95" cy="25" r="14" fill="#3f6212" stroke="#a3e635" />
                    <rect x="45" y="15" width="30" height="20" rx="4" fill="#4d7c0f" stroke="#bef264" />
                    <text x="60" y="28" textAnchor="middle" fill="#ecfccb" fontSize="8" fontFamily="Cairo">جلسة روقان</text>
                  </g>

                  {/* Planter Box with green herbs */}
                  <g transform="translate(325, 10)">
                    <rect x="0" y="0" width="35" height="55" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="17" y="32" textAnchor="middle" fill="#bbf7d0" fontSize="8" fontFamily="Cairo">نعناع 🌱</text>
                  </g>
                </g>

                {/* --- G. MAIN BATHROOM INTERIOR (الحمام الرئيسي الموسع) --- */}
                <g transform="translate(550, 460)">
                  {/* Walk-in Italian Shower Cabin (كابينة شاور سيكوريت عريضة) */}
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="135" height="85" rx="4" fill="rgba(20, 184, 166, 0.25)" stroke="#14b8a6" strokeWidth="2" />
                    <circle cx="67" cy="42" r="14" fill="none" stroke="#2dd4bf" strokeWidth="2" />
                    <line x1="67" y1="20" x2="67" y2="42" stroke="#2dd4bf" strokeWidth="2" />
                    <text x="67" y="47" textAnchor="middle" fill="#ccfbf1" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                      كابينة شاور سيكوريت 120سم
                    </text>
                  </g>

                  {/* Wall-hung Toilet (قاعدة معلقة بسيفون دفن) */}
                  <g transform="translate(25, 105)">
                    <rect x="0" y="0" width="50" height="40" rx="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="0" y="-8" width="50" height="8" fill="#64748b" rx="2" />
                    <text x="25" y="25" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="bold" fontFamily="Cairo">تواليت معلق</text>
                  </g>

                  {/* Vanity Sink & LED Mirror (حوض ومراية ليد عريضة) */}
                  <g transform="translate(15, 170)">
                    <rect x="0" y="0" width="75" height="45" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="37" cy="22" r="13" fill="#e0f2fe" stroke="#0284c7" />
                    <text x="37" y="27" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="Cairo">حوض ديكور</text>
                  </g>
                </g>

              </g>
            )}

            {/* ==================================================== */}
            {/* 6. ORIGINAL FURNITURE (WHEN MODE IS 'ORIGINAL')      */}
            {/* ==================================================== */}
            {showFurniture && currentMode === 'original' && (
              <g id="original-furniture-layer" opacity="0.85">
                {/* Old Master Bed in Balcony Room */}
                <g transform="translate(160, 200)">
                  <rect x="0" y="0" width="180" height="180" rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <text x="90" y="95" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                    سرير ماستر (القديم)
                  </text>
                </g>
                {/* Old Kitchen in room next to shaft 1 */}
                <g transform="translate(600, 750)">
                  <rect x="0" y="0" width="220" height="150" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
                  <text x="110" y="80" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="Cairo">
                    المطبخ (القديم)
                  </text>
                </g>
                {/* Old Girls Room */}
                <g transform="translate(150, 520)">
                  <rect x="0" y="0" width="105" height="160" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
                  <text x="52" y="85" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                    سرير بنات
                  </text>
                </g>
                {/* Old Kids Room */}
                <g transform="translate(640, 150)">
                  <rect x="0" y="0" width="105" height="160" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
                  <text x="52" y="85" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                    سرير أطفال 1
                  </text>
                </g>
              </g>
            )}

            {/* ==================================================== */}
            {/* 7. DIMENSION LINES (COTATIONS)                       */}
            {/* ==================================================== */}
            {showDimensions && (
              <g id="dimension-lines-layer" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9">
                {/* Lounge Width: 7.51m */}
                <line x1="60" y1="1340" x2="940" y2="1340" markerEnd="url(#arrow)" />
                <line x1="60" y1="1330" x2="60" y2="1350" />
                <line x1="940" y1="1330" x2="940" y2="1350" />
                <rect x="440" y="1326" width="120" height="26" rx="4" fill="#0f172a" stroke="#f59e0b" />
                <text x="500" y="1344" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                  الصالة = 7.51 م
                </text>

                {/* Lounge Length: 3.51m */}
                <line x1="960" y1="1000" x2="960" y2="1320" />
                <line x1="950" y1="1000" x2="970" y2="1000" />
                <line x1="950" y1="1320" x2="970" y2="1320" />
                <rect x="915" y="1145" width="80" height="24" rx="4" fill="#0f172a" stroke="#f59e0b" />
                <text x="955" y="1162" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  3.51 م
                </text>

                {/* Kids Room 1 (New Master): 5.30m length */}
                <line x1="540" y1="20" x2="940" y2="20" />
                <line x1="540" y1="10" x2="540" y2="30" />
                <line x1="940" y1="10" x2="940" y2="30" />
                <rect x="680" y="8" width="120" height="24" rx="4" fill="#0f172a" stroke="#8b5cf6" />
                <text x="740" y="25" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  الماستر: 5.30 م
                </text>

                {/* Kitchen / Living Width: 3.10m */}
                <line x1="540" y1="670" x2="940" y2="670" />
                <rect x="700" y="658" width="90" height="22" rx="4" fill="#0f172a" stroke="#3b82f6" />
                <text x="745" y="674" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  3.10 م
                </text>

                {/* New Kitchen Width: 3.10m */}
                <line x1="60" y1="450" x2="460" y2="450" />
                <rect x="220" y="438" width="90" height="22" rx="4" fill="#0f172a" stroke="#10b981" />
                <text x="265" y="454" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  3.10 م
                </text>
              </g>
            )}

            {/* North Arrow & Scale Indicator */}
            <g transform="translate(900, 80)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="0,-18 7,10 0,6" fill="#ef4444" />
              <polygon points="0,-18 -7,10 0,6" fill="#cbd5e1" />
              <text x="0" y="-24" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">N</text>
            </g>

          </svg>
        </div>
      </div>

      {/* Floating Blueprint Quick Info Badge */}
      <div className="bg-stone-900/95 backdrop-blur border-t border-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-stone-300">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            انقر فوق أي غرفة لعرض تفاصيل فرشها ومقاساتها الهندسية وشبكة تأسيسها
          </span>
          {selectedRoomId && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
              الغرفة المحددة: {ROOMS_DATA[selectedRoomId]?.arabicName}
            </span>
          )}
        </div>
        <span className="font-mono text-stone-500 hidden sm:inline">
          مقياس الرسم 1:50 هندسي
        </span>
      </div>

    </div>
  );
};
