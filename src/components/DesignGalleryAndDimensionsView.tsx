import React, { useState } from 'react';
import { RoomId } from '../types';
import { ROOMS_DATA } from '../data/apartmentData';
import { 
  Sparkles, 
  Ruler, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Eye, 
  ZoomIn, 
  Flame, 
  Bath, 
  Bed, 
  Utensils, 
  Tv, 
  Home, 
  Info,
  ChevronRight,
  Compass
} from 'lucide-react';

import apartmentRenderImg from '../assets/images/apartment_render_3d_1788768339180.jpg';
import masterSuiteRenderImg from '../assets/images/master_suite_render_1788768354278.jpg';

interface DesignGalleryAndDimensionsViewProps {
  selectedRoomId: RoomId | null;
  onSelectRoom: (roomId: RoomId) => void;
}

interface HotspotPin {
  id: RoomId;
  label: string;
  dim: string;
  top: string; // percentage
  left: string; // percentage
  badgeColor: string;
  icon: React.ReactNode;
}

const APARTMENT_HOTSPOTS: HotspotPin[] = [
  {
    id: 'lounge',
    label: 'الصالة والاستقبال',
    dim: '7.51 × 3.51 م (26.36 م²)',
    top: '70%',
    left: '50%',
    badgeColor: 'bg-amber-500 text-stone-950',
    icon: <Home className="w-3.5 h-3.5" />,
  },
  {
    id: 'kitchen_new',
    label: 'المطبخ المودرن والبار الأمريكي',
    dim: '3.10 × 3.65 م (11.32 م²)',
    top: '48%',
    left: '28%',
    badgeColor: 'bg-emerald-500 text-stone-950',
    icon: <Utensils className="w-3.5 h-3.5" />,
  },
  {
    id: 'kitchen_old',
    label: 'غرفة المعيشة العائلية المستقلة',
    dim: '3.10 × 3.20 م (9.92 م²)',
    top: '46%',
    left: '72%',
    badgeColor: 'bg-blue-500 text-stone-950',
    icon: <Tv className="w-3.5 h-3.5" />,
  },
  {
    id: 'master_suite',
    label: 'جناح الماستر الملكي + دريسنج وجاكوزي',
    dim: '4.80 × 4.21 م (20.20 م²)',
    top: '22%',
    left: '70%',
    badgeColor: 'bg-purple-500 text-stone-950',
    icon: <Bed className="w-3.5 h-3.5" />,
  },
  {
    id: 'kids_room',
    label: 'غرفة الأطفال (سريرين ومكتب)',
    dim: '3.74 × 3.10 م (11.60 م²)',
    top: '24%',
    left: '26%',
    badgeColor: 'bg-cyan-500 text-stone-950',
    icon: <Bed className="w-3.5 h-3.5" />,
  },
  {
    id: 'bathroom_main',
    label: 'الحمام الرئيسي الموسع (شاور إيطالي)',
    dim: '2.38 × 1.55 م (3.69 م²)',
    top: '38%',
    left: '52%',
    badgeColor: 'bg-teal-500 text-stone-950',
    icon: <Bath className="w-3.5 h-3.5" />,
  },
  {
    id: 'balcony',
    label: 'البلكونة الموسعة + فرن بلدي',
    dim: '3.18 × 1.50 م (4.77 م²)',
    top: '8%',
    left: '42%',
    badgeColor: 'bg-lime-500 text-stone-950',
    icon: <Flame className="w-3.5 h-3.5" />,
  },
];

export const DesignGalleryAndDimensionsView: React.FC<DesignGalleryAndDimensionsViewProps> = ({
  selectedRoomId,
  onSelectRoom,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'gallery' | 'dimensions_table'>('gallery');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  const images = [
    {
      id: 'full_cutaway',
      title: 'رندر معماري ثلاثي الأبعاد شامل لكافة الغرف والعفش (3D Floor Plan)',
      subtitle: 'مسقط مجسم يوضح الصالة، المطبخ المفتوح، المعيشة، جناح الماستر بالدريسنج والجاكوزي، غرفة الأطفال، والبلكونة بالفرن البلدي',
      src: apartmentRenderImg,
      badge: 'المنظور الشامل للشقة',
    },
    {
      id: 'master_suite_detail',
      title: 'رندر جناح الماستر الملكي (دريسنج روم + تسريحة مضيئة + جاكوزي خاص)',
      subtitle: 'تفصيل فندقي فاخر يُبرز الدريسنج المدمج مع تسريحة الميك-أب والجاكوزي المائي الاسترخائي بإطلالة زجاجية راقية',
      src: masterSuiteRenderImg,
      badge: 'جناح الماستر الفاخر',
    },
  ];

  const currentImage = images[activeImageIndex];

  // Room dimensions comparison calculation
  const roomsList = Object.values(ROOMS_DATA);
  const totalOriginalArea = roomsList.reduce((acc, r) => acc + r.dimensionsOriginal.area, 0);
  const totalProposedArea = roomsList.reduce((acc, r) => acc + r.dimensionsProposed.area, 0);

  return (
    <div className="w-full h-full flex flex-col bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden text-stone-100">
      
      {/* Top View Mode & Gallery Switcher */}
      <div className="bg-stone-950/90 backdrop-blur border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              معرض صور التصميم المعماري ثلاثي الأبعاد وجدول المساحات
            </h2>
            <p className="text-stone-400 text-[11px]">
              رؤية واقعية 3D للشقة بعد التوسعات وتوزيع العفش، مع بيان المقاسات الصافية بالملليمتر
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher: Gallery vs Table */}
        <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            id="subtab-gallery-btn"
            onClick={() => setActiveSubTab('gallery')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'gallery'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>صور الرندر ثلاثية الأبعاد (3D Renders)</span>
          </button>
          <button
            id="subtab-dimensions-btn"
            onClick={() => setActiveSubTab('dimensions_table')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'dimensions_table'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-emerald-400" />
            <span>جدول الأبعاد والمساحات الصافية</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeSubTab === 'gallery' ? (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {/* Active Image Stage */}
          <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 shadow-inner group">
            
            {/* Image display */}
            <div className="relative w-full aspect-[16/9] max-h-[500px] flex items-center justify-center overflow-hidden bg-black">
              <img
                src={currentImage.src}
                alt={currentImage.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 select-none ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Hotspot Pins (Only on Full Cutaway View) */}
              {activeImageIndex === 0 && showHotspots && !isZoomed && (
                <div className="absolute inset-0 pointer-events-none">
                  {APARTMENT_HOTSPOTS.map((pin) => {
                    const isSelected = selectedRoomId === pin.id;
                    return (
                      <div
                        key={pin.id}
                        style={{ top: pin.top, left: pin.left }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-110"
                      >
                        <button
                          id={`hotspot-pin-${pin.id}`}
                          onClick={() => onSelectRoom(pin.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xl backdrop-blur-md border transition-all ${
                            isSelected
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950 scale-105'
                              : ''
                          } ${pin.badgeColor}`}
                          title={`${pin.label} - انقر لمعاينة التفاصيل`}
                        >
                          {pin.icon}
                          <span className="whitespace-nowrap">{pin.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Floating controls over image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-stone-900/80 backdrop-blur text-amber-300 border border-stone-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                  {currentImage.badge}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {activeImageIndex === 0 && (
                  <button
                    onClick={() => setShowHotspots(!showHotspots)}
                    className="bg-stone-900/90 backdrop-blur hover:bg-stone-800 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showHotspots ? 'إخفاء شارات الغرف' : 'إظهار شارات الغرف والمقاسات'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="bg-stone-900/90 backdrop-blur hover:bg-stone-800 text-stone-200 border border-stone-700 p-1.5 rounded-lg text-xs transition-all shadow-lg"
                  title="تكبير / تصغير الصورة"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Image Captions & Description */}
            <div className="p-3 bg-stone-900/90 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <h3 className="font-bold text-stone-200 text-sm">{currentImage.title}</h3>
                <p className="text-stone-400 mt-0.5">{currentImage.subtitle}</p>
              </div>
              <span className="text-[11px] text-amber-400 font-mono shrink-0">
                (انقر فوق الصورة للتكبير أو استكشف شارات الغرف التفاعلية)
              </span>
            </div>

          </div>

          {/* Thumbnails Gallery Selector */}
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setActiveImageIndex(idx);
                  setIsZoomed(false);
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                  activeImageIndex === idx
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/80'
                }`}
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-700 bg-black">
                  <img
                    src={img.src}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    activeImageIndex === idx ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {img.badge}
                  </span>
                  <h4 className="font-bold text-xs text-stone-200 truncate mt-1">
                    {img.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 truncate">
                    {img.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* Dimensions & Spaces Breakdown View */
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
          
          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                المساحة الصافية الإجمالية
              </span>
              <p className="text-lg font-bold text-amber-400 mt-1 font-mono">
                {totalProposedArea.toFixed(2)} م²
              </p>
              <span className="text-[10px] text-stone-400">
                استغلال كامل لكافة الأركان دون أي هدر في المساحات
              </span>
            </div>

            <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                الوظائف المكتسبة الجديدة
              </span>
              <p className="text-sm font-bold text-emerald-300 mt-1">
                دريسنج + تسريحة + جاكوزي + فرن بلدي + بار أمريكي
              </p>
              <span className="text-[10px] text-stone-400">
                تحويل الشقة من 3 غرف تقليدية إلى جناح فندقي فاخر
              </span>
            </div>

            <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800">
              <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                معايير الاتساع والشعور بالراحة
              </span>
              <p className="text-sm font-bold text-sky-300 mt-1">
                ممرات حركة فسيحة (≥ 1.00 إلى 1.30 م)
              </p>
              <span className="text-[10px] text-stone-400">
                إلغاء أي شعور بالضيق أو التكدس في أي زاوية
              </span>
            </div>
          </div>

          {/* Detailed Dimensions Comparison Table */}
          <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/60">
            <div className="bg-stone-900 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
              <span className="font-bold text-stone-200 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-400" />
                جدول مقارنة الأبعاد الصافية والمساحات (الوضع الأصلي مقابل المقترح المعدل)
              </span>
              <span className="text-[11px] text-stone-400">
                اضغط على أي غرفة للتحديد والتركيز
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-stone-950/90 text-stone-400 border-b border-stone-800 text-[11px]">
                    <th className="p-3 font-semibold">الغرفة / الفراغ</th>
                    <th className="p-3 font-semibold">المقاس الأصلي (م)</th>
                    <th className="p-3 font-semibold">المساحة الأصلية</th>
                    <th className="p-3 font-semibold text-amber-400">المقاس المقترح (م)</th>
                    <th className="p-3 font-semibold text-amber-400">المساحة المقترحة</th>
                    <th className="p-3 font-semibold">مصدر التهوية</th>
                    <th className="p-3 font-semibold">أبرز المحتويات والعفش المطلوب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {roomsList.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <tr
                        key={room.id}
                        id={`dim-row-${room.id}`}
                        onClick={() => onSelectRoom(room.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-stone-100 font-medium'
                            : 'hover:bg-stone-800/50 text-stone-300'
                        }`}
                      >
                        <td className="p-3 flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: room.colorTheme }}
                          />
                          <div>
                            <span className="font-bold">{room.arabicName}</span>
                            <span className="text-[10px] text-stone-400 block font-mono">
                              ({room.originalName})
                            </span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-400">
                          {room.dimensionsOriginal.length} × {room.dimensionsOriginal.width}
                        </td>
                        <td className="p-3 font-mono text-stone-400">
                          {room.dimensionsOriginal.area.toFixed(2)} م²
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-300">
                          {room.dimensionsProposed.length} × {room.dimensionsProposed.width}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {room.dimensionsProposed.area.toFixed(2)} م²
                        </td>
                        <td className="p-3">
                          <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px]">
                            {room.ventilationSource}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-stone-300 max-w-xs">
                          {room.furniture.map(f => f.arabicName.split(' ')[0]).join('، ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architectural Notes & Circulation Assurance */}
          <div className="bg-stone-950/90 border border-stone-800 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-stone-200 flex items-center gap-2 text-xs text-amber-400">
              <Info className="w-4 h-4" />
              قواعد التصميم لضمان عدم الشعور بالضيق ("مش عاوز احس اني مخنوق في الشقة"):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-stone-300">
              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                <strong className="text-stone-100 block mb-1">1. الانفتاح البصري (Open Flow):</strong>
                الصالة ممتدة بطول 7.51م مع بار المطبخ الأمريكي المنخفض بارتفاع 1.05م يمنح العين أفقاً بصرياً ممتداً لأكثر من 10 أمتار دون جدران حاجزة.
              </div>
              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                <strong className="text-stone-100 block mb-1">2. الإضاءة الطبيعية والتهوية المتقاطعة:</strong>
                كل غرفة تملك فتحة تهوية مباشرة (الصالة والبلكونة على الواجهة، المطبخ وغرفة الأطفال على منور 2، جناح الماستر والحمام الرئيسي على منور 1).
              </div>
              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                <strong className="text-stone-100 block mb-1">3. ممرات حركة فندقية مريحة:</strong>
                تم تخصيص ممر لا يقل عن 1.00 إلى 1.20م حول سرير الكينج، طاولة السفرة، كابينة الشاور، والجاكوزي لتسهيل الحركة بكل سلاسة.
              </div>
              <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                <strong className="text-stone-100 block mb-1">4. تخزين ذكي داخلي (Floor-to-Ceiling):</strong>
                دواليب الدريسنج وخزائن المطبخ ممتدة للسقف لاستيعاب كافة الأغراض دون أي كراكيب ظاهرة تعيق راحة العين.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Footer hint */}
      <div className="bg-stone-950/95 border-t border-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          يمكنك النقر فوق شارات الغرف في الصورة أو في جدول المقاسات لتفقد تفاصيل كل غرفة
        </span>
        <span className="text-[11px] text-stone-400">
          تم تحديث المقاسات بما يتطابق 100% مع طلبات التوسعة والفرش
        </span>
      </div>

    </div>
  );
};
