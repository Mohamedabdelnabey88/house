import React, { useState } from 'react';
import { RoomId } from '../types';
import { ROOMS_DATA } from '../data/apartmentData';
import { 
  RotateCw, 
  RotateCcw, 
  Sun, 
  Moon, 
  Maximize2, 
  Box, 
  Sparkles,
  Layers
} from 'lucide-react';

interface Isometric3DViewProps {
  selectedRoomId: RoomId | null;
  onSelectRoom: (roomId: RoomId) => void;
  bathroomVariant: 'shower' | 'jacuzzi';
}

export const Isometric3DView: React.FC<Isometric3DViewProps> = ({
  selectedRoomId,
  onSelectRoom,
  bathroomVariant,
}) => {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [wallCutawayHeight, setWallCutawayHeight] = useState<number>(45);

  const rotateLeft = () => setRotationAngle(prev => (prev - 45 + 360) % 360);
  const rotateRight = () => setRotationAngle(prev => (prev + 45) % 360);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
      
      {/* 3D Viewport Controls */}
      <div className="bg-stone-900/90 backdrop-blur border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="text-stone-300 font-bold flex items-center gap-1.5">
            <Box className="w-4 h-4 text-amber-400" />
            منظور ثلاثي الأبعاد تفاعلي (Isometric 3D)
          </span>
          <span className="text-stone-500 hidden sm:inline">| رؤية مجسمة لتوزيع الغرف والعفش</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rotation buttons */}
          <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              id="rotate-left-3d-btn"
              onClick={rotateLeft}
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded transition-all"
              title="تدوير لليسار 45 درجة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-stone-300 px-2">{rotationAngle}°</span>
            <button
              id="rotate-right-3d-btn"
              onClick={rotateRight}
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded transition-all"
              title="تدوير لليمين 45 درجة"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Day / Night Lighting */}
          <button
            id="toggle-3d-light-btn"
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              isNightMode
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title="تبديل الإضاءة الليلية / النهارية"
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isNightMode ? 'إضاءة ليلية دافئة' : 'إضاءة نهارية طبيعية'}</span>
          </button>
        </div>
      </div>

      {/* 3D Render Canvas */}
      <div className={`flex-1 w-full h-full overflow-auto flex items-center justify-center p-6 select-none transition-colors duration-500 ${
        isNightMode ? 'bg-[#080b14]' : 'bg-[#0f172a]'
      }`}>
        <div 
          className="relative w-[760px] h-[780px] transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${rotationAngle * 0.1}deg) scale(0.95)` }}
        >
          <svg 
            id="isometric-apartment-svg"
            viewBox="0 0 1000 1000" 
            className="w-full h-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Isometric Linear Gradients */}
              <linearGradient id="wallGradientTop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isNightMode ? "#1e293b" : "#475569"} />
                <stop offset="100%" stopColor={isNightMode ? "#0f172a" : "#334155"} />
              </linearGradient>

              <linearGradient id="wallGradientSide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNightMode ? "#0f172a" : "#334155"} />
                <stop offset="100%" stopColor={isNightMode ? "#020617" : "#1e293b"} />
              </linearGradient>

              <linearGradient id="parquetIso" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isNightMode ? "#332216" : "#451a03"} />
                <stop offset="100%" stopColor={isNightMode ? "#1f150d" : "#2d1303"} />
              </linearGradient>

              <linearGradient id="tileIso" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isNightMode ? "#1e293b" : "#334155"} />
                <stop offset="100%" stopColor={isNightMode ? "#0f172a" : "#1e293b"} />
              </linearGradient>

              <filter id="isoShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="10" dy="18" stdDeviation="12" floodColor="#000" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Base Foundation Slab Shadow */}
            <path
              d="M 500 120 L 880 340 L 880 390 L 500 610 L 120 390 L 120 340 Z"
              fill="#020617"
              opacity="0.8"
            />

            {/* Base Isometric Concrete Foundation */}
            <path
              d="M 500 110 L 880 330 L 500 550 L 120 330 Z"
              fill={isNightMode ? "#090d16" : "#1e293b"}
              stroke="#334155"
              strokeWidth="2"
              filter="url(#isoShadow)"
            />

            {/* Isometric Room Floors */}

            {/* 1. LOUNGE FLOOR (Front Lower area) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('lounge')}
            >
              <polygon 
                points="500,430 840,620 500,810 160,620" 
                fill={selectedRoomId === 'lounge' ? 'rgba(245, 158, 11, 0.4)' : 'url(#tileIso)'}
                stroke={selectedRoomId === 'lounge' ? '#f59e0b' : '#475569'}
                strokeWidth="2"
                className="transition-colors group-hover:fill-amber-500/20"
              />
              {/* 3D Dining Table */}
              <g transform="translate(620, 600)">
                <polygon points="0,0 80,45 0,90 -80,45" fill="#92400e" stroke="#d97706" strokeWidth="1.5" />
                <polygon points="-80,45 0,90 0,105 -80,60" fill="#78350f" />
                <polygon points="0,90 80,45 80,60 0,105" fill="#451a03" />
                <text x="0" y="50" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold" fontFamily="Cairo">سفرة 6 كراسي</text>
              </g>
              {/* 3D Salon Sofa */}
              <g transform="translate(360, 610)">
                <polygon points="0,0 90,50 0,100 -90,50" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <polygon points="-90,50 0,100 0,120 -90,70" fill="#172554" />
                <polygon points="0,100 90,50 90,70 0,120" fill="#0f172a" />
                <text x="0" y="55" textAnchor="middle" fill="#dbeafe" fontSize="10" fontWeight="bold" fontFamily="Cairo">أنتريه وشاشة</text>
              </g>
              <text x="500" y="740" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="Cairo">
                الصالة والاستقبال (7.51×3.51 م)
              </text>
            </g>

            {/* 2. NEW LIVING ROOM FLOOR (Right Middle - Old Kitchen) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('kitchen_old')}
            >
              <polygon 
                points="500,280 750,420 620,500 380,360" 
                fill={selectedRoomId === 'kitchen_old' ? 'rgba(59, 130, 246, 0.4)' : 'url(#parquetIso)'}
                stroke={selectedRoomId === 'kitchen_old' ? '#3b82f6' : '#475569'}
                strokeWidth="2"
                className="transition-colors group-hover:fill-blue-500/20"
              />
              {/* 3D L-Shape Sectional */}
              <g transform="translate(560, 390)">
                <polygon points="0,0 60,35 30,55 -30,20" fill="#2563eb" stroke="#93c5fd" />
                <text x="15" y="30" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="Cairo">ركنة L</text>
              </g>
              <text x="560" y="450" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                غرفة المعيشة الجديدة
              </text>
            </g>

            {/* 3. NEW KITCHEN FLOOR (Left Middle - Expanded into Kids Room) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('kitchen_new')}
            >
              <polygon 
                points="240,340 480,480 340,570 110,430" 
                fill={selectedRoomId === 'kitchen_new' ? 'rgba(16, 185, 129, 0.4)' : 'url(#tileIso)'}
                stroke={selectedRoomId === 'kitchen_new' ? '#10b981' : '#475569'}
                strokeWidth="2"
                className="transition-colors group-hover:fill-emerald-500/20"
              />
              {/* Kitchen U-shape counters & American bar 3D blocks */}
              <g transform="translate(240, 440)">
                <polygon points="-45,-25 35,20 0,45 -80,0" fill="#047857" stroke="#34d399" />
                <polygon points="10,25 50,45 35,55 -5,35" fill="#4338ca" stroke="#a78bfa" />
                <text x="-25" y="10" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="Cairo">المطبخ الموسع</text>
                <text x="25" y="42" textAnchor="middle" fill="#e0e7ff" fontSize="8" fontWeight="bold" fontFamily="Cairo">بار أمريكي</text>
              </g>
              <text x="260" y="520" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                المطبخ الذكي الموسع (11.32 م²)
              </text>
            </g>

            {/* 4. MASTER BEDROOM SUITE FLOOR (Top Right - Royal Suite with Dressing, Vanity & Jacuzzi) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('master_suite')}
            >
              <polygon 
                points="500,100 800,260 670,360 380,180" 
                fill={selectedRoomId === 'master_suite' ? 'rgba(139, 92, 246, 0.4)' : 'url(#parquetIso)'}
                stroke={selectedRoomId === 'master_suite' ? '#8b5cf6' : '#475569'}
                strokeWidth="2"
                className="transition-colors group-hover:fill-purple-500/20"
              />
              {/* 3D King Bed Block */}
              <g transform="translate(610, 210)">
                <polygon points="0,0 60,35 0,70 -60,35" fill="#6d28d9" stroke="#c084fc" strokeWidth="1.5" />
                <polygon points="-60,35 0,70 0,85 -60,50" fill="#581c87" />
                <polygon points="0,70 60,35 60,50 0,85" fill="#3b0764" />
                {/* 3D Pillows */}
                <polygon points="-30,18 0,35 -15,44 -45,27" fill="#f5f3ff" />
                <polygon points="10,40 40,23 25,14 -5,31" fill="#f5f3ff" />
                <text x="0" y="55" textAnchor="middle" fill="#ede9fe" fontSize="9" fontWeight="bold" fontFamily="Cairo">كينج 180سم</text>
              </g>

              {/* 3D Dressing & Vanity Block */}
              <g transform="translate(480, 230)">
                <polygon points="0,0 35,20 15,32 -20,12" fill="#4a044e" stroke="#f472b6" strokeWidth="1" />
                <text x="5" y="18" textAnchor="middle" fill="#fdf2f8" fontSize="8" fontFamily="Cairo">تسريحة + دريسنج</text>
              </g>

              {/* 3D Master En-Suite Jacuzzi Spa */}
              <g transform="translate(540, 275)">
                <polygon points="0,0 55,30 0,60 -55,30" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="1.5" />
                <polygon points="-55,30 0,60 0,72 -55,42" fill="#0e7490" />
                <polygon points="0,60 55,30 55,42 0,72" fill="#155e75" />
                <ellipse cx="0" cy="30" rx="35" ry="18" fill="#0891b2" stroke="#67e8f9" strokeWidth="1" />
                <text x="0" y="34" textAnchor="middle" fill="#ecfeff" fontSize="9" fontWeight="bold" fontFamily="Cairo">جاكوزي الماستر ♨️</text>
              </g>

              <text x="630" y="140" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="bold" fontFamily="Cairo">
                جناح الماستر الملكي الفسيح (20.20 م²)
              </text>
            </g>

            {/* 5. KIDS BEDROOM FLOOR (Top Left - Originally Master) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('kids_room')}
            >
              <polygon 
                points="220,240 480,100 370,170 120,310" 
                fill={selectedRoomId === 'kids_room' ? 'rgba(6, 182, 212, 0.4)' : 'url(#parquetIso)'}
                stroke={selectedRoomId === 'kids_room' ? '#06b6d4' : '#475569'}
                strokeWidth="2"
                className="transition-colors group-hover:fill-cyan-500/20"
              />
              {/* 3D 2 Beds */}
              <g transform="translate(300, 160)">
                <polygon points="0,0 35,20 0,40 -35,20" fill="#083344" stroke="#06b6d4" />
                <polygon points="40,22 75,42 40,62 5,42" fill="#083344" stroke="#06b6d4" />
                <text x="0" y="25" textAnchor="middle" fill="#cffafe" fontSize="8" fontFamily="Cairo">سرير 1</text>
                <text x="40" y="47" textAnchor="middle" fill="#cffafe" fontSize="8" fontFamily="Cairo">سرير 2</text>
              </g>
              <text x="230" y="265" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                غرفة نوم الأطفال (11.60 م²)
              </text>
            </g>

            {/* 6. EXPANDED BALCONY FLOOR (Top - Expanded with Traditional Brick Oven) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('balcony')}
            >
              <polygon 
                points="340,40 500,100 400,160 240,90" 
                fill="rgba(132, 204, 22, 0.35)" 
                stroke="#84cc16" 
                strokeWidth="2" 
              />
              {/* 3D Traditional Oven with Chimney */}
              <g transform="translate(320, 80)">
                <polygon points="0,0 28,15 0,30 -28,15" fill="#78350f" stroke="#ea580c" strokeWidth="1.5" />
                <polygon points="-28,15 0,30 0,42 -28,27" fill="#451a03" />
                <polygon points="0,30 28,15 28,27 0,42" fill="#9a3412" />
                <circle cx="0" cy="15" r="9" fill="#c2410c" />
                <circle cx="0" cy="15" r="5" fill="#fbbf24" />
                {/* Chimney */}
                <polygon points="12,-5 20,-1 20,6 12,2" fill="#334155" stroke="#64748b" />
                <text x="0" y="55" textAnchor="middle" fill="#ffedd5" fontSize="8" fontWeight="bold" fontFamily="Cairo">فرن بلدي 🥖</text>
              </g>
              {/* Outdoor table & green plants */}
              <g transform="translate(420, 120)">
                <circle cx="0" cy="0" r="10" fill="#3f6212" stroke="#bef264" />
                <text x="0" y="18" textAnchor="middle" fill="#ecfccb" fontSize="7" fontFamily="Cairo">جلسة روقان</text>
              </g>
              <text x="360" y="30" textAnchor="middle" fill="#bef264" fontSize="11" fontWeight="bold" fontFamily="Cairo">
                البلكونة الموسعة (4.77 م²)
              </text>
            </g>

            {/* 7. EXPANDED MAIN BATHROOM 3D (Center Right - Expanded into Living Room) */}
            <g 
              className="cursor-pointer group"
              onClick={() => onSelectRoom('bathroom_main')}
            >
              <polygon 
                points="470,300 590,370 510,420 390,350" 
                fill={selectedRoomId === 'bathroom_main' ? 'rgba(20, 184, 166, 0.5)' : 'url(#tileIso)'}
                stroke="#14b8a6" 
                strokeWidth="2" 
              />
              {/* 3D Walk-in Italian Shower Cabin */}
              <g transform="translate(450, 340)">
                <polygon points="0,0 35,18 0,36 -35,18" fill="rgba(20, 184, 166, 0.4)" stroke="#2dd4bf" strokeWidth="1.5" />
                <text x="0" y="22" textAnchor="middle" fill="#ccfbf1" fontSize="8" fontWeight="bold" fontFamily="Cairo">كابينة شاور 120سم</text>
              </g>
              <text x="500" y="405" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="bold" fontFamily="Cairo">
                الحمام الرئيسي الموسع (3.69 م²)
              </text>
            </g>

            {/* Extruded Isometric Walls (3D Perimeter Walls) */}
            {/* Outer Left Wall */}
            <polygon points="120,330 160,620 160,575 120,285" fill="url(#wallGradientSide)" stroke="#64748b" strokeWidth="1" />
            {/* Outer Right Wall */}
            <polygon points="880,330 840,620 840,575 880,285" fill="url(#wallGradientTop)" stroke="#64748b" strokeWidth="1" />
            {/* Front Wall with Cutaway */}
            <polygon points="160,620 500,810 500,765 160,575" fill="url(#wallGradientSide)" stroke="#64748b" strokeWidth="1" />
            <polygon points="500,810 840,620 840,575 500,765" fill="url(#wallGradientTop)" stroke="#64748b" strokeWidth="1" />

            {/* Ambient Room Lighting Glow when Night Mode active */}
            {isNightMode && (
              <g id="night-ambient-glow">
                <circle cx="620" cy="600" r="70" fill="url(#isoShadow)" opacity="0.3" />
                <circle cx="620" cy="600" r="45" fill="#f59e0b" opacity="0.15" />
                <circle cx="600" cy="220" r="50" fill="#8b5cf6" opacity="0.18" />
                <circle cx="560" cy="390" r="45" fill="#3b82f6" opacity="0.15" />
              </g>
            )}

          </svg>
        </div>
      </div>

      {/* 3D Footer Tips */}
      <div className="bg-stone-900/95 border-t border-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          التوزيع يضمن أقصى انسيابية وتهوية كاملة على المنورين والبلكونة
        </span>
        <span className="text-stone-400">
          استخدم أزرار التدوير أو الإضاءة لمعاينة الشقة في كافة الأوقات
        </span>
      </div>

    </div>
  );
};
