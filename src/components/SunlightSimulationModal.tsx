import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  Wind, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCw, 
  X, 
  CheckCircle2, 
  Eye, 
  Layers,
  ThermometerSun,
  Flame,
  Maximize2
} from 'lucide-react';
import { ROOMS_DATA } from '../data/apartmentData';
import { RoomId } from '../types';

interface SunlightSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId: RoomId | null;
  onSelectRoom: (roomId: RoomId) => void;
}

interface RoomSunlightMetric {
  roomId: RoomId;
  name: string;
  source: 'بلكونة وواجهة' | 'منور 1' | 'منور 2';
  baseLux: number;
  lux: number;
  comfort: string;
  ventilation: string;
  color: string;
}

export const SunlightSimulationModal: React.FC<SunlightSimulationModalProps> = ({
  isOpen,
  onClose,
  selectedRoomId,
  onSelectRoom,
}) => {
  // Time of day in decimal hours (6.0 = 6:00 AM, 12.0 = 12:00 PM, 18.5 = 6:30 PM, etc.)
  const [timeHour, setTimeHour] = useState<number>(10.5); // 10:30 AM default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showRays, setShowRays] = useState<boolean>(true);
  const [facadeOrientation, setFacadeOrientation] = useState<number>(45); // 45 deg = North-East (بحري شرقي)

  const animationFrameRef = useRef<number | null>(null);

  // Auto-play sun movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeHour((prev) => {
        const next = prev + 0.05 * playbackSpeed;
        return next > 20 ? 6 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  // Format time display (e.g. "10:30 ص")
  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    const period = hours >= 12 ? 'م' : 'ص';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Sun mathematics: Azimuth and Elevation
  // 6:00 = Azimuth ~90 (East), Elevation ~5°
  // 12:00 = Azimuth ~180 (South), Elevation ~75°
  // 18:00 = Azimuth ~270 (West), Elevation ~10°
  const sunProgress = Math.max(0, Math.min(1, (timeHour - 6) / 12)); // 0 at 6am, 1 at 6pm
  const isNight = timeHour < 6 || timeHour > 18.5;
  const sunElevation = isNight ? 0 : Math.sin(sunProgress * Math.PI) * 78; // in degrees
  const sunAzimuth = 75 + sunProgress * 190; // in degrees

  // Calculate sun color & intensity based on elevation & time
  const getSunVisuals = () => {
    if (isNight) {
      return {
        skyBg: '#050814',
        sunColor: '#94a3b8',
        ambientIntensity: 0.15,
        beamColor: 'rgba(148, 163, 184, 0.08)',
        glowColor: 'rgba(56, 189, 248, 0.05)',
        statusText: 'إضاءة قمرية وليلية هادئة',
        tempC: '22°C'
      };
    }
    if (timeHour < 8 || timeHour > 17) {
      // Golden hour
      return {
        skyBg: '#1e110a',
        sunColor: '#f97316',
        ambientIntensity: 0.65,
        beamColor: 'rgba(249, 115, 22, 0.35)',
        glowColor: 'rgba(251, 146, 60, 0.25)',
        statusText: 'الساعة الذهبية (أشعة مائلة دافئة)',
        tempC: '25°C'
      };
    }
    if (timeHour >= 11 && timeHour <= 14) {
      // Noon bright
      return {
        skyBg: '#0f172a',
        sunColor: '#fbbf24',
        ambientIntensity: 1.0,
        beamColor: 'rgba(251, 191, 36, 0.50)',
        glowColor: 'rgba(254, 240, 138, 0.35)',
        statusText: 'ذروة الإشعاع الشمسي (إضاءة نهارية غامرة)',
        tempC: '31°C'
      };
    }
    // Mid morning or afternoon
    return {
      skyBg: '#0c1527',
      sunColor: '#fde047',
      ambientIntensity: 0.85,
      beamColor: 'rgba(253, 224, 71, 0.40)',
      glowColor: 'rgba(254, 249, 195, 0.25)',
      statusText: 'إضاءة طبيعية واضحة ومريحة',
      tempC: '28°C'
    };
  };

  const visuals = getSunVisuals();

  // Dynamic Room Illumination Calculations
  // Balcony faces North-East (towards ~45 deg). Direct rays penetrate most when sun is in East to South (morning).
  const balconyFactor = isNight ? 0.08 : Math.max(0.2, Math.cos((sunAzimuth - 120) * (Math.PI / 180)) * (sunElevation / 75) + 0.35);
  // Shafts receive top-down zenith light primarily when elevation is high (11am to 2pm)
  const shaftFactor = isNight ? 0.05 : Math.max(0.15, Math.pow(Math.sin((sunProgress) * Math.PI), 1.5));

  const roomMetrics: RoomSunlightMetric[] = [
    {
      roomId: 'lounge',
      name: 'الصالة والاستقبال',
      source: 'بلكونة وواجهة',
      baseLux: 950,
      lux: Math.round(isNight ? 45 : 950 * balconyFactor),
      comfort: isNight ? 'إضاءة استرخاء' : balconyFactor > 0.7 ? 'إضاءة نهارية ممتازة للأنشطة والضيافة' : 'إضاءة طبيعية متشتتة مريحة',
      ventilation: 'تيار هواء بحري متجدد 100%',
      color: '#3b82f6'
    },
    {
      roomId: 'balcony',
      name: 'البلكونة والفرن البلدي',
      source: 'بلكونة وواجهة',
      baseLux: 1400,
      lux: Math.round(isNight ? 60 : 1400 * balconyFactor),
      comfort: isNight ? 'أجواء سمر ليلية' : 'إضاءة شمس مباشرة وفيتامين D وتشميس خبيز',
      ventilation: 'هواء طلق مباشر',
      color: '#f59e0b'
    },
    {
      roomId: 'master_suite',
      name: 'جناح الماستر الملكي',
      source: 'منور 1',
      baseLux: 520,
      lux: Math.round(isNight ? 30 : 520 * shaftFactor),
      comfort: isNight ? 'ظلام نوم صحي عميق' : 'إضاءة هادئة غير مباشرة تمنع الحرارة والوهج',
      ventilation: 'تيار سحب طبيعي عبر منور 1',
      color: '#a855f7'
    },
    {
      roomId: 'kitchen_new',
      name: 'المطبخ المودرن المطور',
      source: 'منور 2',
      baseLux: 680,
      lux: Math.round(isNight ? 35 : 680 * (shaftFactor * 0.7 + balconyFactor * 0.4)),
      comfort: isNight ? 'إضاءة ليد مخفية' : 'إضاءة واضحة ومريحة لكاونترات الطهي والبار',
      ventilation: 'سحب روائح فوري على منور 2',
      color: '#10b981'
    },
    {
      roomId: 'kids_room',
      name: 'غرفة نوم الأطفال والشباب',
      source: 'منور 2',
      baseLux: 550,
      lux: Math.round(isNight ? 25 : 550 * shaftFactor),
      comfort: isNight ? 'هدوء وسكون' : 'إضاءة مناسبة للمذاكرة بدون وهج عاكس على الشاشات',
      ventilation: 'تهوية طبيعية صامتة',
      color: '#14b8a6'
    },
    {
      roomId: 'kitchen_old',
      name: 'غرفة المعيشة المستقلة',
      source: 'منور 1',
      baseLux: 480,
      lux: Math.round(isNight ? 30 : 480 * shaftFactor),
      comfort: isNight ? 'سينما منزلية راقية' : 'إضاءة دافئة معزولة عن ضوضاء الشارع',
      ventilation: 'تجديد هواء مستمر عبر منور 1',
      color: '#64748b'
    },
    {
      roomId: 'bathroom_main',
      name: 'الحمام الرئيسي الموسع',
      source: 'منور 1',
      baseLux: 350,
      lux: Math.round(isNight ? 20 : 350 * shaftFactor),
      comfort: isNight ? 'إضاءة ليلية دافئة' : 'إضاءة تهوية طبيعية تمنع الرطوبة وتكاثر البكتيريا',
      ventilation: 'سحب بخار كابينة الشاور عبر منور 1',
      color: '#06b6d4'
    }
  ];

  // Quick Time Presets
  const timePresets = [
    { label: 'شروق باكر', time: 6.5, icon: Sun, desc: '6:30 ص' },
    { label: 'ضحى مشرق', time: 9.5, icon: Sun, desc: '9:30 ص' },
    { label: 'الظهيرة والذروة', time: 12.0, icon: Flame, desc: '12:00 ظ' },
    { label: 'العصر الرائق', time: 15.5, icon: Sun, desc: '3:30 م' },
    { label: 'الغروب الذهبي', time: 18.0, icon: ThermometerSun, desc: '6:00 م' },
    { label: 'الليل الهادئ', time: 21.0, icon: Moon, desc: '9:00 م' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-stone-950/90 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-100">
                  محاكي حركة الشمس والضوء الطبيعي والتهوية
                </h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  واجهة بحرية + مناور تهوية
                </span>
              </div>
              <p className="text-xs text-stone-400">
                تتبع مسار زاوية الشمس اليومية وحساب شدة الإضاءة (Lux) ومسارات الهواء الطبيعي في كل فراغ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-xl transition-all"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* Left / Center View: Visual Sunbeam & Floorplan Simulation (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col gap-4 border-b lg:border-b-0 lg:border-l border-stone-800">
            
            {/* Simulation Canvas Header Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-stone-950/70 p-2.5 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  اتجاه الواجهة:
                </span>
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  بحري شرقي (N-E 45°)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    showHeatmap 
                      ? 'bg-amber-500 text-stone-950' 
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>خريطة التوزيع الحراري (Heatmap)</span>
                </button>

                <button
                  onClick={() => setShowRays(!showRays)}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    showRays 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>حزم الأشعة</span>
                </button>
              </div>
            </div>

            {/* Simulated 2D Floorplan with Real-time Light Diffusion */}
            <div 
              className="relative w-full aspect-[4/3] rounded-2xl border border-stone-800 shadow-inner overflow-hidden transition-colors duration-700 flex items-center justify-center select-none"
              style={{ backgroundColor: visuals.skyBg }}
            >
              {/* Sun Graphic in Sky */}
              {!isNight && (
                <div 
                  className="absolute pointer-events-none transition-all duration-300 ease-out z-20 flex flex-col items-center"
                  style={{
                    left: `${Math.max(10, Math.min(88, sunProgress * 85 + 5))}%`,
                    top: `${Math.max(8, 75 - (sunElevation / 80) * 65)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: visuals.sunColor,
                      boxShadow: `0 0 35px ${visuals.sunColor}, 0 0 70px ${visuals.glowColor}`
                    }}
                  >
                    <Sun className="w-7 h-7 text-stone-950 animate-spin-slow" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-200 mt-1 font-bold bg-stone-950/80 px-1.5 py-0.5 rounded shadow">
                    {sunElevation.toFixed(0)}° ارتفاع
                  </span>
                </div>
              )}

              {/* Floorplan Vector Overlay */}
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full p-4 relative z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Radial Gradients for Balcony Sunlight Penentration */}
                  <radialGradient id="balconyBeamGrad" cx="90%" cy="85%" r="85%">
                    <stop offset="0%" stopColor={visuals.sunColor} stopOpacity={isNight ? "0.08" : "0.55"} />
                    <stop offset="60%" stopColor={visuals.sunColor} stopOpacity={isNight ? "0.03" : "0.20"} />
                    <stop offset="100%" stopColor={visuals.sunColor} stopOpacity="0" />
                  </radialGradient>

                  {/* Shaft 1 & Shaft 2 Skylight Cones */}
                  <radialGradient id="shaft1Grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={isNight ? "0.08" : (shaftFactor * 0.6).toFixed(2)} />
                    <stop offset="70%" stopColor="#38bdf8" stopOpacity={isNight ? "0.02" : (shaftFactor * 0.2).toFixed(2)} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="shaft2Grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={isNight ? "0.08" : (shaftFactor * 0.6).toFixed(2)} />
                    <stop offset="70%" stopColor="#34d399" stopOpacity={isNight ? "0.02" : (shaftFactor * 0.2).toFixed(2)} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </radialGradient>

                  {/* Heatmap Filters */}
                  <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Apartment Floor Outer Fill */}
                <rect x="50" y="50" width="700" height="500" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="4" />

                {/* Light Heatmap Layer (Optional) */}
                {showHeatmap && (
                  <rect x="50" y="50" width="700" height="500" rx="12" fill="url(#heatGradient)" />
                )}

                {/* 1. Balcony (Right-Bottom Corner) - Direct Marine Facade */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('balcony')}
                >
                  <rect 
                    x="500" 
                    y="440" 
                    width="230" 
                    height="90" 
                    rx="6"
                    fill="#78350f" 
                    fillOpacity={isNight ? 0.3 : 0.6 + balconyFactor * 0.3} 
                    stroke="#f59e0b" 
                    strokeWidth="3"
                  />
                  {/* Glass Handrail / Opening */}
                  <line x1="500" y1="530" x2="730" y2="530" stroke="#38bdf8" strokeWidth="6" strokeDasharray="10 5" />
                  <text x="615" y="485" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                    البلكونة والفرن البلدي
                  </text>
                  <text x="615" y="505" fill="#fde68a" fontSize="11" textAnchor="middle">
                    {roomMetrics.find(r => r.roomId === 'balcony')?.lux} Lux • تشميس مباشر
                  </text>
                </g>

                {/* 2. Lounge & Dining (Right Side 500..730, y 70..440) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('lounge')}
                >
                  <rect 
                    x="500" 
                    y="70" 
                    width="230" 
                    height="360" 
                    rx="6"
                    fill="#1e3a8a" 
                    fillOpacity={isNight ? 0.3 : 0.4 + balconyFactor * 0.4} 
                    stroke="#3b82f6" 
                    strokeWidth="3"
                  />
                  {/* Sun penetration overlay from Balcony */}
                  <polygon 
                    points="500,440 730,440 680,180 540,180" 
                    fill="url(#balconyBeamGrad)" 
                  />
                  <text x="615" y="240" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
                    الصالة والاستقبال
                  </text>
                  <text x="615" y="265" fill="#93c5fd" fontSize="12" textAnchor="middle">
                    7.51 × 3.51 م ({roomMetrics.find(r => r.roomId === 'lounge')?.lux} Lux)
                  </text>
                  <text x="615" y="285" fill="#e2e8f0" fontSize="11" textAnchor="middle">
                    إضاءة بحرية نهارية ممتدة
                  </text>
                </g>

                {/* 3. Master Suite (Top-Middle 210..480, y 70..270) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('master_suite')}
                >
                  <rect 
                    x="210" 
                    y="70" 
                    width="270" 
                    height="200" 
                    rx="6"
                    fill="#581c87" 
                    fillOpacity={isNight ? 0.3 : 0.4 + shaftFactor * 0.3} 
                    stroke="#a855f7" 
                    strokeWidth="3"
                  />
                  {/* Jacuzzi area with skylight diffuser */}
                  <rect x="220" y="80" width="80" height="70" rx="4" fill="#0891b2" fillOpacity="0.7" stroke="#67e8f9" strokeWidth="2" />
                  <text x="260" y="120" fill="#ecfeff" fontSize="10" fontWeight="bold" textAnchor="middle">جاكوزي</text>

                  <text x="365" y="160" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">
                    جناح الماستر الملكي
                  </text>
                  <text x="365" y="185" fill="#d8b4fe" fontSize="11" textAnchor="middle">
                    {roomMetrics.find(r => r.roomId === 'master_suite')?.lux} Lux (منور 1 - هدوء تام)
                  </text>
                </g>

                {/* 4. Shaft 1 (Top-Left 70..190, y 70..170) */}
                <g>
                  <rect x="70" y="70" width="120" height="100" rx="4" fill="#1c1917" stroke="#78716c" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Skylight diffusion circle */}
                  <circle cx="130" cy="120" r="45" fill="url(#shaft1Grad)" />
                  <text x="130" y="115" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">منور 1</text>
                  <text x="130" y="135" fill="#a8a29e" fontSize="9" textAnchor="middle">صاعد تهوية</text>
                </g>

                {/* 5. Main Bathroom (Left 70..190, y 185..280) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('bathroom_main')}
                >
                  <rect 
                    x="70" 
                    y="185" 
                    width="120" 
                    height="95" 
                    rx="4"
                    fill="#0e7490" 
                    fillOpacity={isNight ? 0.3 : 0.4 + shaftFactor * 0.3} 
                    stroke="#06b6d4" 
                    strokeWidth="2"
                  />
                  <text x="130" y="230" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">حمام رئيسي</text>
                  <text x="130" y="250" fill="#67e8f9" fontSize="10" textAnchor="middle">
                    {roomMetrics.find(r => r.roomId === 'bathroom_main')?.lux} Lux
                  </text>
                </g>

                {/* 6. Kids Bedroom (Middle-Bottom 210..370, y 290..530) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('kids_room')}
                >
                  <rect 
                    x="210" 
                    y="290" 
                    width="180" 
                    height="240" 
                    rx="6"
                    fill="#134e4a" 
                    fillOpacity={isNight ? 0.3 : 0.4 + shaftFactor * 0.3} 
                    stroke="#14b8a6" 
                    strokeWidth="3"
                  />
                  <text x="300" y="400" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                    غرفة الأطفال
                  </text>
                  <text x="300" y="425" fill="#5eead4" fontSize="11" textAnchor="middle">
                    {roomMetrics.find(r => r.roomId === 'kids_room')?.lux} Lux (منور 2)
                  </text>
                </g>

                {/* 7. New Kitchen & Bar (Left-Bottom 70..190, y 300..530) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('kitchen_new')}
                >
                  <rect 
                    x="70" 
                    y="300" 
                    width="120" 
                    height="230" 
                    rx="6"
                    fill="#064e3b" 
                    fillOpacity={isNight ? 0.3 : 0.45 + shaftFactor * 0.35} 
                    stroke="#10b981" 
                    strokeWidth="3"
                  />
                  {/* American Bar highlight */}
                  <rect x="180" y="340" width="15" height="120" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                  <text x="130" y="405" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    المطبخ والبار
                  </text>
                  <text x="130" y="430" fill="#6ee7b7" fontSize="11" textAnchor="middle">
                    {roomMetrics.find(r => r.roomId === 'kitchen_new')?.lux} Lux
                  </text>
                </g>

                {/* 8. Shaft 2 (Between Kitchen & Kids 190..210, y 300..380) */}
                <g>
                  <rect x="190" y="300" width="20" height="80" fill="#1c1917" stroke="#78716c" strokeWidth="1" />
                  <circle cx="200" cy="340" r="25" fill="url(#shaft2Grad)" />
                </g>

                {/* 9. Family Living Room (Middle 410..480, y 290..530) */}
                <g 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectRoom('kitchen_old')}
                >
                  <rect 
                    x="410" 
                    y="290" 
                    width="70" 
                    height="240" 
                    rx="4"
                    fill="#1e293b" 
                    fillOpacity={isNight ? 0.3 : 0.4 + shaftFactor * 0.25} 
                    stroke="#64748b" 
                    strokeWidth="2"
                  />
                  <text x="445" y="405" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 445 405)">
                    معيشة عائلية ({roomMetrics.find(r => r.roomId === 'kitchen_old')?.lux} Lux)
                  </text>
                </g>

                {/* Sunrays Projection Lines */}
                {showRays && !isNight && (
                  <g opacity="0.65" stroke={visuals.sunColor} strokeWidth="1.5" strokeDasharray="6 4">
                    <line x1="730" y1="530" x2="520" y2="280" />
                    <line x1="680" y1="530" x2="550" y2="350" />
                    <line x1="615" y1="530" x2="580" y2="420" />
                    <line x1="130" y1="70" x2="130" y2="170" stroke="#38bdf8" />
                    <line x1="200" y1="300" x2="200" y2="380" stroke="#34d399" />
                  </g>
                )}

                {/* North Arrow & Marine Breeze Vector */}
                <g transform="translate(730, 90)">
                  <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                  <line x1="0" y1="14" x2="0" y2="-14" stroke="#ef4444" strokeWidth="2.5" />
                  <polygon points="0,-18 -5,-10 5,-10" fill="#ef4444" />
                  <text x="0" y="-22" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">بحري (N)</text>
                  <path d="M-12,5 Q0,0 12,5" stroke="#38bdf8" strokeWidth="2" fill="none" />
                </g>
              </svg>
            </div>

            {/* Current Atmospheric & Sun Status Bar */}
            <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: visuals.sunColor }} />
                <span className="font-bold text-stone-200">{visuals.statusText}</span>
              </div>
              <div className="flex items-center gap-4 text-stone-400">
                <span>زاوية السمت: <strong className="text-stone-200 font-mono">{sunAzimuth.toFixed(0)}°</strong></span>
                <span>درجة الحرارة التقديرية: <strong className="text-amber-400 font-mono">{visuals.tempC}</strong></span>
              </div>
            </div>

          </div>

          {/* Right Column: Time Controls, Playback & Room Lux Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col gap-5 overflow-y-auto">
            
            {/* 1. Time Slider & 24h Playback Controls */}
            <div className="bg-stone-950/90 border border-stone-800 p-4 rounded-2xl flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  الوقت وساعة النهار:
                </span>
                <span className="text-xl font-bold font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner">
                  {formatTime(timeHour)}
                </span>
              </div>

              {/* Slider */}
              <input
                id="sunlight-time-slider"
                type="range"
                min="6"
                max="21"
                step="0.1"
                value={timeHour}
                onChange={(e) => {
                  setTimeHour(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-amber-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
              />

              {/* Play / Pause & Speed Bar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  id="play-sunlight-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isPlaying 
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20' 
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'إيقاف المحاكاة' : 'تشغيل دورة اليوم التلقائية'}</span>
                </button>

                <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 text-[11px]">
                  {[1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        playbackSpeed === spd ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Quick Daytime Presets */}
            <div className="grid grid-cols-3 gap-2">
              {timePresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = Math.abs(timeHour - preset.time) < 0.8;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTimeHour(preset.time);
                      setIsPlaying(false);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-mono opacity-80">{preset.desc}</span>
                    </div>
                    <span className="text-xs font-bold text-stone-200">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Detailed Room Illumination Breakdown */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>توزيع شدة الضوء الطبيعي (Lux):</span>
                <span className="text-[11px] text-stone-500 font-normal">المعيار المثالي: 300 - 1000 Lux</span>
              </h3>

              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {roomMetrics.map((rm) => {
                  const isRoomSelected = selectedRoomId === rm.roomId;
                  return (
                    <div
                      key={rm.roomId}
                      onClick={() => onSelectRoom(rm.roomId)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isRoomSelected
                          ? 'bg-stone-800/90 border-amber-500 shadow-md'
                          : 'bg-stone-950/70 border-stone-800/80 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rm.color }} />
                          <span className="text-xs font-bold text-stone-200">{rm.name}</span>
                          <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                            {rm.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                          <span>{rm.lux}</span>
                          <span className="text-[10px] text-stone-500">Lux</span>
                        </div>
                      </div>

                      {/* Lux meter bar */}
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                        <div 
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (rm.lux / 1200) * 100)}%`,
                            backgroundColor: rm.lux > 700 ? '#f59e0b' : rm.lux > 300 ? '#10b981' : '#64748b'
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>{rm.comfort}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Wind className="w-3 h-3" />
                          {rm.ventilation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architectural Engineering Insight */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs flex items-start gap-2.5 text-amber-200/90">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>التحليل المعماري للتوجيه:</strong> توزيع الواجهة البحرية (البلكونة والصالة) يحقق أقصى استفادة من الهواء البحري المتجدد والإضاءة الصباحية بدون اكتساب حراري مفرط، بينما تعمل المناور (منور 1 ومنور 2) كمداخن هواء طبيعية (Thermal Chimney) تسحب الرطوبة من الحمامات والمطبخ بسلاسة.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
