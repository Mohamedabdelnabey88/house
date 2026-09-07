import React, { useState, useMemo } from 'react';
import { RoomId } from '../types';
import { ROOMS_DATA } from '../data/apartmentData';
import { 
  ROOM_FURNITURE_CUSTOMIZATIONS, 
  FurnitureOption, 
  FurnitureCategoryConfig 
} from '../data/furnitureCustomizationData';
import { 
  Bed, 
  Tv, 
  Utensils, 
  Bath, 
  Sparkles, 
  CheckCircle2, 
  Ruler, 
  Maximize2, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronRight, 
  Info, 
  Flame, 
  SlidersHorizontal, 
  ArrowRightLeft, 
  Compass, 
  Layers, 
  Home,
  CheckCheck
} from 'lucide-react';

interface FurnitureCustomizerStudioProps {
  roomId: RoomId;
  onAskAiAboutCustomization?: (details: string) => void;
  onUpdateBlueprintPreference?: (selectedOptions: Record<string, string>) => void;
}

export const FurnitureCustomizerStudio: React.FC<FurnitureCustomizerStudioProps> = ({
  roomId,
  onAskAiAboutCustomization,
  onUpdateBlueprintPreference,
}) => {
  const room = ROOMS_DATA[roomId];
  const categories = ROOM_FURNITURE_CUSTOMIZATIONS[roomId] || [];

  // Track selected option ID per category
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    categories.forEach((cat) => {
      if (cat.options.length > 0) {
        initial[cat.id] = cat.options[0].id;
      }
    });
    return initial;
  });

  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    return categories.length > 0 ? categories[0].id : '';
  });

  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);

  // If the room changes, reset to that room's defaults
  React.useEffect(() => {
    const initial: Record<string, string> = {};
    categories.forEach((cat) => {
      if (cat.options.length > 0) {
        initial[cat.id] = cat.options[0].id;
      }
    });
    setSelectedOptions(initial);
    if (categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [roomId]);

  const handleSelectOption = (categoryId: string, optionId: string) => {
    const next = { ...selectedOptions, [categoryId]: optionId };
    setSelectedOptions(next);
    if (onUpdateBlueprintPreference) {
      onUpdateBlueprintPreference(next);
    }
  };

  // Resolve currently selected FurnitureOption objects
  const selectedFurnitureItems = useMemo<FurnitureOption[]>(() => {
    const items: FurnitureOption[] = [];
    categories.forEach((cat) => {
      const chosenId = selectedOptions[cat.id];
      const opt = cat.options.find((o) => o.id === chosenId) || cat.options[0];
      if (opt) items.push(opt);
    });
    return items;
  }, [categories, selectedOptions]);

  // Calculate occupied and free space
  const roomTotalArea = room ? room.dimensionsProposed.area : 20.0;
  const occupiedCustomArea = selectedFurnitureItems.reduce((sum, item) => sum + item.area, 0);
  
  // Base secondary fixtures estimate (e.g. doors swing, nightstands, consoles, sanitary)
  const secondaryFixturesArea = useMemo(() => {
    switch (roomId) {
      case 'master_suite': return 2.8; // vanity path, door clearance, nightstands
      case 'lounge': return 5.5; // coffee table, TV console, buffet, walkways
      case 'kitchen_new': return 2.5; // fridge base, sink, corner units
      case 'kids_room': return 2.2; // wardrobe base, door swing
      case 'kitchen_old': return 1.8; // TV unit, tea table
      case 'balcony': return 1.1; // planter boxes, railing border
      case 'bathroom_main': return 1.2; // vanity basin, wall toilet
      default: return 2.0;
    }
  }, [roomId]);

  const totalOccupiedArea = Math.min(roomTotalArea * 0.75, +(occupiedCustomArea + secondaryFixturesArea).toFixed(2));
  const freeCirculationArea = +(roomTotalArea - totalOccupiedArea).toFixed(2);
  const freeRatio = Math.round((freeCirculationArea / roomTotalArea) * 100);
  const occupiedRatio = 100 - freeRatio;

  // Neufert Circulation Standard Assessment
  const clearanceGrade = useMemo(() => {
    if (freeRatio >= 55) {
      return {
        label: 'رحابة فندقية استثنائية (Hotel Luxury)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        badge: 'ممرات حركة ≥ 1.05 - 1.30 م',
        verdict: 'مساحة حركة فائقة ومريحة جداً تلغي أي إحساس بالضيق، مع حرية تامة لفتح كافة الأدراج والأبواب.',
        barColor: 'bg-emerald-500'
      };
    } else if (freeRatio >= 45) {
      return {
        label: 'اتساع متوازن ومريح جداً (Spacious Comfort)',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/30',
        badge: 'ممرات حركة 85 - 100 سم',
        verdict: 'توزيع قياسي مريح يطابق معايير نويفرت الدولية للأثاث المنزلي الفاخر، مع خط سير سلس دون عوائق.',
        barColor: 'bg-sky-500'
      };
    } else {
      return {
        label: 'توزيع عملي مكثف (Compact & Functional)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        badge: 'ممرات حركة 75 - 85 سم',
        verdict: 'توزيع يستغل كل سنتيمتر؛ ينصح باختيار أسرة أو كراسي معلقة لمزيد من الاتساع البصري.',
        barColor: 'bg-amber-500'
      };
    }
  }, [freeRatio]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  const handleCopySpecSheet = () => {
    if (!room) return;
    const lines = [
      `📐 مواصفات مقاسات العفش المخصصة لـ [${room.arabicName}]`,
      `المساحة الصافية للغرفة: ${room.dimensionsProposed.width} م × ${room.dimensionsProposed.length} م (${roomTotalArea} م²)`,
      `المساحة المشغولة بالأثاث: ${totalOccupiedArea} م² (${occupiedRatio}%) | مساحة الحركة الحرة: ${freeCirculationArea} م² (${freeRatio}%)`,
      `تقييم الرحابة الحركية: ${clearanceGrade.label} (${clearanceGrade.badge})`,
      '----------------------------------------',
      ...selectedFurnitureItems.map(
        (item, idx) => `${idx + 1}. ${item.name}\n   - المقاس الصافي: ${item.dimensions}\n   - خلوص الممر الموصى به: ${item.recommendedClearance}\n   - المساحة المشغولة: ${item.area} م²\n   - نصيحة التنفيذ: ${item.clearanceAdvice}`
      ),
      '----------------------------------------',
      'تم إعداد هذا التوزيع وفقاً لمعايير نويفرت المعمارية للراحة والحركة الحرة.'
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  if (!room || categories.length === 0) {
    return (
      <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl text-center text-xs text-stone-400">
        هذا الفراغ لا يتطلب تخصيص قطع أثاث متغيرة حالياً.
      </div>
    );
  }

  return (
    <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 flex flex-col gap-4 text-stone-200">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              استوديو تخصيص الفرش ومحاكي المقاسات الذكي
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                Neufert Ergonomics
              </span>
            </h3>
            <p className="text-[11px] text-stone-400">
              اختر نوع وحجم قطع الأثاث الكبرى لـ ({room.arabicName}) وعاين فوراً المساحة المتبقية وممرات الخلوص
            </p>
          </div>
        </div>

        {/* Copy Spec Button */}
        <button
          onClick={handleCopySpecSheet}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          title="نسخ جدول المقاسات للنجار أو مهندس الديكور"
        >
          {copiedSpec ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم نسخ المقاسات!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>نسخ مواصفات المقاسات</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Dynamic Clearance & Space Metrics Bar */}
      <div className="bg-stone-900/90 border border-stone-800 p-3.5 rounded-xl flex flex-col gap-3 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-stone-200">تحليل الاتساع وممرات الحركة:</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${clearanceGrade.bg} ${clearanceGrade.color}`}>
              {clearanceGrade.label}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            {clearanceGrade.badge}
          </span>
        </div>

        {/* Visual Progress Bar (Occupied vs Free) */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-stone-950 rounded-full overflow-hidden flex border border-stone-800">
            <div 
              style={{ width: `${occupiedRatio}%` }}
              className="bg-amber-500/80 transition-all duration-500 relative group"
              title={`مساحة الأثاث: ${totalOccupiedArea} م² (${occupiedRatio}%)`}
            />
            <div 
              style={{ width: `${freeRatio}%` }}
              className={`${clearanceGrade.barColor} transition-all duration-500 relative group`}
              title={`مساحة الحركة الحرة: ${freeCirculationArea} م² (${freeRatio}%)`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              مساحة الأثاث الكلي: <strong>{totalOccupiedArea} م²</strong> ({occupiedRatio}%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              مساحة الحركة الحرة الصافية: <strong>{freeCirculationArea} م²</strong> ({freeRatio}%)
            </span>
          </div>
        </div>

        <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
          💡 <strong>التقييم المعماري:</strong> {clearanceGrade.verdict}
        </p>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-800 text-xs">
          {categories.map((cat) => {
            const isCatActive = activeCategoryId === cat.id;
            const chosenId = selectedOptions[cat.id];
            const chosenOpt = cat.options.find((o) => o.id === chosenId);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isCatActive
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border-stone-800 hover:bg-stone-800'
                }`}
              >
                <span>{cat.categoryName}</span>
                {chosenOpt && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                    isCatActive ? 'bg-stone-950/30 text-stone-950' : 'bg-stone-950 text-amber-400 font-mono'
                  }`}>
                    {chosenOpt.width}×{chosenOpt.length}م
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Options Cards for Active Category */}
      {activeCategory && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>اختر المقاس والتصميم المناسب لاحتياجاتك:</span>
            <span className="text-[11px] text-amber-400">
              {activeCategory.options.length} خيارات هندسية مدروسة
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {activeCategory.options.map((opt) => {
              const isSelected = selectedOptions[activeCategory.id] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(activeCategory.id, opt.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  {/* Top Row: Title, Dimensions & Radio */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-500 text-stone-950' 
                            : 'border-stone-600 bg-stone-950'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <h4 className="font-bold text-xs text-stone-100 flex items-center gap-2">
                          {opt.name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-stone-400 mr-6">
                        {opt.description}
                      </p>
                    </div>

                    {/* Dimensions Badge */}
                    <div className="text-left shrink-0">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800 block">
                        {opt.dimensions}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                        المساحة: {opt.area} م²
                      </span>
                    </div>
                  </div>

                  {/* Ergonomics & Clearance Tip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-stone-950/70 p-2.5 rounded-lg border border-stone-800/80 mr-6">
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <Ruler className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>ممر الحركة المقترح: <strong className="text-sky-300">{opt.recommendedClearance}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{opt.clearanceAdvice}</span>
                    </div>
                  </div>

                  {/* Bullet Advantages */}
                  <div className="flex flex-wrap items-center gap-2 mr-6 text-[10px]">
                    {opt.pros.map((pro, pIdx) => (
                      <span 
                        key={pIdx}
                        className="bg-stone-800/80 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {pro}
                      </span>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mini 2D Fit & Clearance Simulation Blueprint */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 flex flex-col gap-2 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            مخطط المقياس المصغر (Mini Space Fit Simulation):
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            {room.dimensionsProposed.width} م × {room.dimensionsProposed.length} م
          </span>
        </div>

        <div className="w-full h-44 bg-stone-900/90 rounded-lg border border-stone-800 relative overflow-hidden flex items-center justify-center p-2">
          {/* Scaled SVG Mini Blueprint */}
          <svg 
            viewBox="0 0 400 240" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#292524" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="240" fill="url(#miniGrid)" />

            {/* Room Boundary Walls */}
            <rect 
              x="20" 
              y="20" 
              width="360" 
              height="200" 
              fill="#1c1917" 
              stroke="#57534e" 
              strokeWidth="4" 
              rx="6"
            />

            {/* Free Circulation Zone Highlight (Green gentle glow) */}
            <rect 
              x="28" 
              y="28" 
              width="344" 
              height="184" 
              fill="rgba(16, 185, 129, 0.08)" 
              stroke="rgba(16, 185, 129, 0.2)" 
              strokeDasharray="4 4"
            />

            {/* Render selected furniture dynamically on the mini blueprint */}
            {roomId === 'master_suite' && (
              <g>
                {/* King / Queen Bed */}
                <rect x="220" y="45" width="130" height="110" fill="#6d28d9" stroke="#a78bfa" strokeWidth="2" rx="4" />
                <rect x="235" y="55" width="45" height="25" fill="#ede9fe" rx="3" />
                <rect x="290" y="55" width="45" height="25" fill="#ede9fe" rx="3" />
                <text x="285" y="115" textAnchor="middle" fill="#ede9fe" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['bed_type'] === 'queen_storage_160' ? 'سرير كوين 160' : selectedOptions['bed_type'] === 'super_king_200' ? 'سوبر كينج 200' : 'سرير كينج 180'}
                </text>

                {/* Nightstands */}
                <rect x="220" y="25" width="28" height="18" fill="#4c1d95" rx="2" />
                <rect x="322" y="25" width="28" height="18" fill="#4c1d95" rx="2" />

                {/* Dressing & Vanity Area */}
                <rect x="50" y="35" width="120" height="75" fill="#4a044e" stroke="#f472b6" strokeWidth="1.5" rx="3" />
                <text x="110" y="75" textAnchor="middle" fill="#fdf2f8" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['dressing_style'] === 'smoked_glass_wardrobe' ? 'دواليب زجاج سموكي' : 'دريسنج مدمج بتسريحة'}
                </text>

                {/* En-suite Jacuzzi */}
                <rect x="50" y="130" width="110" height="75" fill="#0e7490" stroke="#06b6d4" strokeWidth="1.5" rx="4" />
                <ellipse cx="105" cy="168" rx="42" ry="24" fill="#0891b2" stroke="#67e8f9" />
                <text x="105" y="172" textAnchor="middle" fill="#ecfeff" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['jacuzzi_style'] === 'oval_freestanding_spa' ? 'جاكوزي بيضاوي 160' : 'جاكوزي ركني 140'}
                </text>

                {/* Walkway Clearance Markers with dimension lines */}
                <line x1="180" y1="100" x2="215" y2="100" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
                <rect x="182" y="88" width="32" height="18" fill="#064e3b" rx="2" />
                <text x="198" y="100" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.10م</text>

                <line x1="285" y1="160" x2="285" y2="210" stroke="#10b981" strokeWidth="2" />
                <rect x="270" y="175" width="30" height="16" fill="#064e3b" rx="2" />
                <text x="285" y="186" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="monospace">1.25م</text>
              </g>
            )}

            {roomId === 'lounge' && (
              <g>
                {/* Salon Sofas */}
                <rect x="40" y="45" width="140" height="90" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" rx="4" />
                <text x="110" y="95" textAnchor="middle" fill="#dbeafe" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['salon_type'] === 'classic_modern_sofa_set' ? 'أنتريه 3+2+1' : selectedOptions['salon_type'] === 'dual_linear_sofas' ? 'كنبتين 240سم' : 'ركنة L واسعة'}
                </text>

                {/* Dining Table */}
                <rect x="220" y="55" width="130" height="80" fill="#78350f" stroke="#d97706" strokeWidth="2" rx="4" />
                <text x="285" y="100" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['dining_type'] === 'smart_expandable_table' ? 'سفرة ذكية ممتدة' : selectedOptions['dining_type'] === 'round_dining_130' ? 'سفرة دائرية Ø130' : 'سفرة 6 كراسي'}
                </text>

                {/* Coffee Corner / Foyer Console */}
                <rect x="220" y="175" width="120" height="30" fill="#365314" stroke="#84cc16" strokeWidth="1.5" rx="3" />
                <text x="280" y="195" textAnchor="middle" fill="#ecfccb" fontSize="10" fontWeight="bold" fontFamily="Cairo">كوفي كورنر + جزامة</text>

                {/* Main Aisle Pathway */}
                <line x1="185" y1="30" x2="185" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                <rect x="168" y="110" width="36" height="18" fill="#064e3b" rx="2" />
                <text x="186" y="122" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.35م</text>
              </g>
            )}

            {roomId === 'kitchen_new' && (
              <g>
                {/* U-Shaped or L-Shaped Counter */}
                <path d="M 40 40 L 250 40 L 250 180 L 190 180 L 190 100 L 100 100 L 100 180 L 40 180 Z" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="145" y="70" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  كاونتر المطبخ الموسع
                </text>
                
                {/* American Bar */}
                <rect x="240" y="90" width="40" height="90" fill="#4338ca" stroke="#818cf8" strokeWidth="2" rx="3" />
                <text x="260" y="140" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontWeight="bold" transform="rotate(-90 260 140)" fontFamily="Cairo">بار إفطار أمريكي</text>

                {/* Internal Chef Walkway */}
                <rect x="130" y="125" width="36" height="18" fill="#064e3b" rx="2" />
                <text x="148" y="137" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.25م</text>
              </g>
            )}

            {roomId === 'kids_room' && (
              <g>
                <rect x="50" y="40" width="90" height="120" fill="#0e7490" stroke="#22d3ee" strokeWidth="2" rx="4" />
                <rect x="260" y="40" width="90" height="120" fill="#0e7490" stroke="#22d3ee" strokeWidth="2" rx="4" />
                <text x="95" y="105" textAnchor="middle" fill="#cffafe" fontSize="10" fontWeight="bold" fontFamily="Cairo">سرير 1</text>
                <text x="305" y="105" textAnchor="middle" fill="#cffafe" fontSize="10" fontWeight="bold" fontFamily="Cairo">سرير 2</text>
                
                {/* Study Desk */}
                <rect x="150" y="170" width="100" height="40" fill="#374151" stroke="#9ca3af" strokeWidth="1.5" rx="3" />
                <text x="200" y="195" textAnchor="middle" fill="#f3f4f6" fontSize="10" fontWeight="bold" fontFamily="Cairo">مكتب دراسة مزدوج</text>

                {/* Center free play clearance */}
                <rect x="175" y="80" width="50" height="20" fill="#064e3b" rx="3" />
                <text x="200" y="93" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="Cairo">حركة 1.15م</text>
              </g>
            )}

            {roomId === 'kitchen_old' && (
              <g>
                <rect x="50" y="40" width="170" height="110" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" rx="4" />
                <text x="135" y="95" textAnchor="middle" fill="#dbeafe" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['living_sofa'] === 'three_plus_poufs' ? 'كنبة ثلاثية + بوفات' : 'ركنة سينمائية عميقة'}
                </text>
                <rect x="280" y="40" width="30" height="140" fill="#422006" stroke="#b45309" strokeWidth="1.5" rx="3" />
                <text x="295" y="115" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold" transform="rotate(-90 295 115)" fontFamily="Cairo">بانوهات خشب وشاشة</text>
                
                <rect x="235" y="90" width="35" height="18" fill="#064e3b" rx="2" />
                <text x="252" y="102" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.20م</text>
              </g>
            )}

            {roomId === 'balcony' && (
              <g>
                {/* Traditional Oven */}
                <rect x="40" y="45" width="85" height="85" fill="#78350f" stroke="#ea580c" strokeWidth="2" rx="6" />
                <circle cx="82" cy="87" r="28" fill="#c2410c" stroke="#fbbf24" strokeWidth="2" />
                <text x="82" y="91" textAnchor="middle" fill="#fff7ed" fontSize="10" fontWeight="bold" fontFamily="Cairo">فرن بلدي 🥖</text>
                
                {/* Tabliya / Bistro Set */}
                <circle cx="260" cy="110" r="45" fill="#3f6212" stroke="#a3e635" strokeWidth="2" />
                <text x="260" y="114" textAnchor="middle" fill="#f7fee7" fontSize="10" fontWeight="bold" fontFamily="Cairo">طبلية روقان</text>
                
                <rect x="150" y="95" width="40" height="18" fill="#064e3b" rx="2" />
                <text x="170" y="107" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.05م</text>
              </g>
            )}

            {roomId === 'bathroom_main' && (
              <g>
                {/* Walk-in Shower */}
                <rect x="40" y="40" width="110" height="150" fill="#115e59" stroke="#2dd4bf" strokeWidth="2" rx="4" />
                <text x="95" y="115" textAnchor="middle" fill="#ccfbf1" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                  {selectedOptions['shower_setup'] === 'compact_soaking_tub' ? 'بانيو مدمج' : 'كابينة شاور 120سم'}
                </text>

                {/* Vanity Basin & Toilet */}
                <rect x="230" y="40" width="110" height="60" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" rx="3" />
                <text x="285" y="75" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="Cairo">حوض بوحدة تخزين</text>
                <rect x="250" y="130" width="60" height="60" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" rx="3" />
                <text x="280" y="165" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="Cairo">تواليت معلق</text>

                <rect x="165" y="105" width="38" height="18" fill="#064e3b" rx="2" />
                <text x="184" y="117" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">1.05م</text>
              </g>
            )}

            {/* Scale Marker */}
            <text x="35" y="232" fill="#78716c" fontSize="8" fontFamily="Cairo">
              * مقياس رسم تقريبي يوضح ممرات الحركة الصافية والمساحات الحرة
            </text>
          </svg>
        </div>
      </div>

      {/* Ask AI Consultant shortcut */}
      {onAskAiAboutCustomization && (
        <button
          onClick={() => {
            const summary = selectedFurnitureItems.map(i => `${i.name} (${i.dimensions})`).join('، ');
            onAskAiAboutCustomization(`لقد اخترت لـ [${room.arabicName}]: ${summary}. كيف ترى هذا التوزيع من حيث الاتساع ومسارات الحركة؟`);
          }}
          className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>استشر المهندس الذكي حول التوزيع المختار لـ {room.arabicName}</span>
        </button>
      )}

    </div>
  );
};
