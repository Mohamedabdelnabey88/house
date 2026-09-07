import React, { useState } from 'react';
import { RoomId } from '../types';
import { ROOMS_DATA } from '../data/apartmentData';
import { FurnitureCustomizerStudio } from './FurnitureCustomizerStudio';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Maximize2, 
  Wind, 
  Zap, 
  Droplets, 
  Tv, 
  Ruler, 
  HelpCircle,
  ShieldCheck,
  SlidersHorizontal,
  Layers,
  FileText
} from 'lucide-react';

interface RoomDetailPanelProps {
  roomId: RoomId | null;
  onClose: () => void;
  onAskAiAboutRoom: (roomName: string) => void;
  bathroomVariant: 'shower' | 'jacuzzi';
  onToggleBathroomVariant: (variant: 'shower' | 'jacuzzi') => void;
}

export const RoomDetailPanel: React.FC<RoomDetailPanelProps> = ({
  roomId,
  onClose,
  onAskAiAboutRoom,
  bathroomVariant,
  onToggleBathroomVariant,
}) => {
  const [panelSubTab, setPanelSubTab] = useState<'customizer' | 'overview'>('customizer');

  if (!roomId) return null;
  const room = ROOMS_DATA[roomId];
  if (!room) return null;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-stone-200">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-stone-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: room.colorTheme }}
            />
            <h2 className="text-lg font-bold text-stone-100">
              {room.arabicName}
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            الاسم السابق بالرسم: <span className="text-amber-400 font-mono">{room.originalName}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dimensions & Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Ruler className="w-3 h-3 text-amber-400" />
            الأبعاد الصافية
          </span>
          <p className="text-sm font-bold text-stone-200 mt-1 font-mono">
            {room.dimensionsProposed.width} م × {room.dimensionsProposed.length} م
          </p>
        </div>

        <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-emerald-400" />
            المساحة الإجمالية
          </span>
          <p className="text-sm font-bold text-emerald-400 mt-1 font-mono">
            {room.dimensionsProposed.area} م²
          </p>
        </div>

        <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400" />
            مصدر التهوية
          </span>
          <p className="text-sm font-bold text-sky-300 mt-1">
            {room.ventilationSource}
          </p>
        </div>
      </div>

      {/* Sub-Tab Navigation: Customizer vs Overview */}
      <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
        <button
          onClick={() => setPanelSubTab('customizer')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            panelSubTab === 'customizer'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>تخصيص الأثاث والمقاسات وممرات الحركة</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            panelSubTab === 'customizer' ? 'bg-stone-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            ذكي
          </span>
        </button>

        <button
          onClick={() => setPanelSubTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            panelSubTab === 'overview'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>المواصفات الشاملة وقائمة التنفيذ</span>
        </button>
      </div>

      {/* TAB 1: Smart Furniture Customizer Studio */}
      {panelSubTab === 'customizer' && (
        <FurnitureCustomizerStudio
          roomId={room.id}
          onAskAiAboutCustomization={onAskAiAboutRoom}
        />
      )}

      {/* TAB 2: Standard Overview & Engineering Notes */}
      {panelSubTab === 'overview' && (
        <div className="flex flex-col gap-4">
          {/* Special Selector for Main Bathroom Variant */}
          {room.id === 'bathroom_main' && (
            <div className="bg-teal-950/30 border border-teal-500/30 p-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300">
                  خيارات تجهيز الحمام الرئيسي الموسع:
                </span>
                <span className="text-[11px] text-teal-400 font-mono">
                  الطول {room.dimensionsProposed.length} م × العرض {room.dimensionsProposed.width} م ({room.dimensionsProposed.area} م²)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleBathroomVariant('shower')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    bathroomVariant === 'shower'
                      ? 'bg-teal-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span>كابينة شاور إيطالية واسعة</span>
                  <span className="text-[10px] font-normal opacity-80">120×90سم زجاج سيكوريت + ممر رحب 1.00م</span>
                </button>
                <button
                  onClick={() => onToggleBathroomVariant('jacuzzi')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    bathroomVariant === 'jacuzzi'
                      ? 'bg-teal-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span>جاكوزي مساج استرخاء</span>
                  <span className="text-[10px] font-normal opacity-80">140×80سم مائي مريح (بالإضافة لجاكوزي الماستر)</span>
                </button>
              </div>
            </div>
          )}

          {/* Role & Concept Description */}
          <div className="bg-stone-950/40 p-3 rounded-xl border border-stone-800/60">
            <h3 className="text-xs font-bold text-amber-400 mb-1">
              الوصف والفلسفة المعمارية:
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Furniture & Elements Checklist (All requested user items) */}
          {room.furniture.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-200 mb-2 flex items-center justify-between">
                <span>قائمة العفش والمحتويات المطلوبة:</span>
                <span className="text-[11px] text-amber-400 font-normal">
                  {room.furniture.length} قطع مفصلة
                </span>
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {room.furniture.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-stone-950/70 border border-stone-800/80 p-2.5 rounded-xl hover:border-amber-500/40 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-stone-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item.arabicName}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-stone-400 leading-normal mr-5">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-[11px] bg-stone-900 text-amber-400 border border-stone-800 px-2 py-0.5 rounded-md">
                      {item.dimensions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architectural & Engineering Execution Notes */}
          <div className="space-y-2 border-t border-stone-800 pt-3">
            <h3 className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ملاحظات التنفيذ الهندسي والتأسيس:
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-400">
              {room.architecturalNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Air Conditioning & Lighting Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {room.acLocation && (
              <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-stone-400 flex items-center gap-1 text-[11px] font-medium">
                  <Wind className="w-3 h-3 text-sky-400" />
                  موقع التكييف المقترح
                </span>
                <p className="text-stone-200 mt-1 text-[11px]">
                  {room.acLocation}
                </p>
              </div>
            )}

            <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-stone-400 flex items-center gap-1 text-[11px] font-medium">
                <Zap className="w-3 h-3 text-amber-400" />
                خطة الإنارة والديكور
              </span>
              <p className="text-stone-300 mt-1 text-[11px] line-clamp-2">
                {room.lightingPlan[0] || 'سبوتات ليد + بيت نور مخفي'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ask AI Button */}
      <button
        id="ask-ai-room-btn"
        onClick={() => onAskAiAboutRoom(room.arabicName)}
        className="w-full mt-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
      >
        <Sparkles className="w-4 h-4" />
        استشر المهندس الذكي بخصوص {room.arabicName}
      </button>

    </div>
  );
};
