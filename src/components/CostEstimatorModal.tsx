import React, { useState } from 'react';
import { COST_ESTIMATION_DATA } from '../data/apartmentData';
import { CostItem } from '../types';
import { 
  X, 
  Calculator, 
  Coins, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<CostItem[]>(COST_ESTIMATION_DATA);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, newPrice: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const p = Math.max(0, newPrice);
        return { ...item, unitPrice: p, total: p * item.quantity };
      }
      return item;
    }));
  };

  const handleReset = () => {
    setItems(COST_ESTIMATION_DATA);
  };

  const totalCost = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-950 p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">
                حاسبة المقايسة التقديرية لبنود التعديل والتشطيب
              </h2>
              <p className="text-xs text-stone-400">
                حصر بنود التكسير، تمديدات السباكة، الكهرباء، المحارة، السيراميك والمطبخ (جنيه مصري)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Highlight Bar */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900 to-amber-950/30 px-6 py-4 border-b border-stone-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs text-stone-400 block">إجمالي المقايسة التقديرية لكامل التعديلات:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {totalCost.toLocaleString('ar-EG')}
              </span>
              <span className="text-xs text-stone-300 font-bold">جنيه مصري تقريباً</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط الأسعار
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة المقايسة
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-bold pb-2">
                <th className="py-2 px-2">البند والأعمال المطلوبة</th>
                <th className="py-2 px-2 text-center">الوحدة</th>
                <th className="py-2 px-2 text-center">الكمية</th>
                <th className="py-2 px-2 text-center">سعر الوحدة (ج.م)</th>
                <th className="py-2 px-2 text-left">الإجمالي (ج.م)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="py-3 px-2">
                    <div className="font-bold text-stone-200">{item.item}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{item.notes}</div>
                    <span className="inline-block mt-1 text-[10px] bg-stone-800 text-amber-400 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-medium text-stone-300">
                    {item.unit}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-stone-200">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-stone-950 border border-stone-700 rounded text-center font-mono text-xs text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="py-3 px-2 text-left font-mono font-bold text-emerald-400 text-sm">
                    {item.total.toLocaleString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            الأسعار تقريبية لمتوسط خامات السوق المصري بجودة عالية ممتازة
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-lg transition-all"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
