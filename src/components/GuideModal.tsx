import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Ruler, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-stone-950 p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">
                دليل إعادة توزيع الشقة والأبعاد الهندسية القياسية
              </h2>
              <p className="text-xs text-stone-400">
                شرح التغييرات المعمارية الذكية ومقاسات العفش الموصى بها لتجنب أخطاء الشراء
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-stone-300">
          
          {/* Summary Matrix */}
          <div>
            <h3 className="font-bold text-sm text-amber-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              جدول التحويل المعماري (الوضع الأصلي مقابل المقترح المطور)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-stone-950 text-stone-400 font-bold border-b border-stone-800">
                    <th className="p-2.5">الموقع بالرسم الأصلي</th>
                    <th className="p-2.5">الدور الجديد المقترح</th>
                    <th className="p-2.5">الأبعاد الصافية</th>
                    <th className="p-2.5">المحتويات والعفش المطلوب</th>
                    <th className="p-2.5">التهوية والصرف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">الصالة (Lounge)</td>
                    <td className="p-2.5 text-amber-400 font-bold">صالة استقبال + سفرة فاخرة</td>
                    <td className="p-2.5 font-mono">7.51×3.51 م (33.1 م²)</td>
                    <td className="p-2.5">سفرة 6-8 كراسي، نيش، بوفيه، أنتريه وشاشة، جزامة وكوفي كورنر</td>
                    <td className="p-2.5 text-stone-400">الواجهة الرئيسية</td>
                  </tr>

                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">غرفة الأطفال 1 (kids room 1)</td>
                    <td className="p-2.5 text-purple-400 font-bold">جناح نوم ماستر ملكي فندقي</td>
                    <td className="p-2.5 font-mono">5.30×3.10 م (19.0 م²)</td>
                    <td className="p-2.5">سرير كينج 180سم، شاشة، دريسنج كبير 2.8م، <strong className="text-purple-300">حمام ماستر خاص</strong></td>
                    <td className="p-2.5 text-stone-400">منور 1 (ملاصق مباشرة للصرف)</td>
                  </tr>

                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">غرفة البنات (girls room 1)</td>
                    <td className="p-2.5 text-emerald-400 font-bold">المطبخ الحديث الذكي</td>
                    <td className="p-2.5 font-mono">3.10×3.10 م (9.6 م²)</td>
                    <td className="p-2.5">ثلاجة، غسالة، بوتاجاز بلت-إن وشفاط، ميكروويف، خزائن ذكية، بار خدمة</td>
                    <td className="p-2.5 text-stone-400">منور 2 (طرد وتهوية كاملة)</td>
                  </tr>

                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">المطبخ القديم (Kitchen)</td>
                    <td className="p-2.5 text-sky-400 font-bold">غرفة المعيشة العائلية (Living)</td>
                    <td className="p-2.5 font-mono">3.10×3.50 م (10.8 م²)</td>
                    <td className="p-2.5">ركنة L-Shape مريحة، شاشة كبيرة 65 بوصة، مكتبة حائط وطاولة ضيافة</td>
                    <td className="p-2.5 text-stone-400">منور 1</td>
                  </tr>

                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">غرفة الماستر القديمة (Master)</td>
                    <td className="p-2.5 text-cyan-400 font-bold">غرفة نوم أطفال متكاملة</td>
                    <td className="p-2.5 font-mono">4.16×3.18 م (17.4 م²)</td>
                    <td className="p-2.5">سريرين 120سم، كومودينو وسطي، مكتب دراسة، دولاب كبير، <strong className="text-lime-400">البلكونة الخاصة</strong></td>
                    <td className="p-2.5 text-stone-400">البلكونة (إطلالة وشمس طبيعية)</td>
                  </tr>

                  <tr className="hover:bg-stone-800/30">
                    <td className="p-2.5 font-bold text-stone-200">الحمام (Bathroom)</td>
                    <td className="p-2.5 text-teal-400 font-bold">حمام رئيسي فندقي مودرن</td>
                    <td className="p-2.5 font-mono">2.38×1.19 م (3.2 م²)</td>
                    <td className="p-2.5">كابينة شاور زجاج سيكوريت أو جاكوزي، قاعدة معلقة بسيفون دفن، حوض ومراية ليد</td>
                    <td className="p-2.5 text-stone-400">منور 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Standard Furniture Dimensions Guide */}
          <div>
            <h3 className="font-bold text-sm text-amber-400 mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              المقاسات الهندسية القياسية لقطع العفش (Ergonomic Dimensions)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <h4 className="font-bold text-stone-200 text-amber-400">عفش الصالة والاستقبال:</h4>
                <ul className="space-y-1.5 text-stone-400">
                  <li>• <strong className="text-stone-200">طاولة السفرة:</strong> 180 سم × 90 سم (تتسع لـ 6-8 كراسي بكل أريحية).</li>
                  <li>• <strong className="text-stone-200">النيش المودرن:</strong> عرض 110-120 سم × عمق 40-45 سم (العمق الأقل يمنع إعاقة الحركة).</li>
                  <li>• <strong className="text-stone-200">البوفيه:</strong> عرض 180 سم × عمق 45 سم × ارتفاع 85 سم.</li>
                  <li>• <strong className="text-stone-200">جزامة المدخل:</strong> عرض 100 سم × عمق 35 سم مع رف تعليق مفاتيح.</li>
                  <li>• <strong className="text-stone-200">كنبة الأنتريه:</strong> عمق المقعد 85-90 سم مع طاولة وسطية 90×55 سم.</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <h4 className="font-bold text-stone-200 text-purple-400">عفش غرف النوم والمطبخ:</h4>
                <ul className="space-y-1.5 text-stone-400">
                  <li>• <strong className="text-stone-200">سرير الماستر:</strong> كينج 180 سم × 200 سم مع 2 كومودينو عرض 50 سم.</li>
                  <li>• <strong className="text-stone-200">دولاب الماستر:</strong> عرض 280 سم × عمق 60 سم بنظام درف جرار (Sliding Doors).</li>
                  <li>• <strong className="text-stone-200">سريري الأطفال:</strong> 120 سم × 195 سم لكل سرير مع ممر وسطي 70 سم.</li>
                  <li>• <strong className="text-stone-200">مكتب المذاكرة:</strong> 120-140 سم × 60 سم أمام النافذة والبلكونة.</li>
                  <li>• <strong className="text-stone-200">كاونتر المطبخ:</strong> عمق الرخام 60 سم والارتفاع 90 سم عن منسوب التشطيب.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Golden Rules for Renovation */}
          <div className="bg-gradient-to-br from-amber-500/10 via-stone-950 to-stone-950 p-4 rounded-xl border border-amber-500/20 space-y-2">
            <h4 className="font-bold text-stone-200 text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              نصائح ذهبية عند التنفيذ العملي:
            </h4>
            <p className="text-stone-300 leading-relaxed">
              1. <strong>الحمام الماستر:</strong> اطلب من السباك تركيب ماسورة صرف معلقة في منور 1 مع عزل الأرضية بطبقتين عزل أسمنتي كيميائي (سيكا توب سيل 107) لضمان عدم تسريب المياه مدى الحياة.
              <br />
              2. <strong>المطبخ الجديد:</strong> قم بتجهيز خط كهرباء 4 مم منفصل مباشرة من لوحة القواطع الرئيسية للفرن والميكرويف والغسالة لتجنب أي حمل زائد.
              <br />
              3. <strong>غرفة المعيشة:</strong> استغل مكان مواسير المطبخ القديمة لسدها جيداً واستبدالها بوحدة خشبية ديكورية تخفي أي أثر سابق.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md"
          >
            فهمت التفاصيل، شكراً!
          </button>
        </div>

      </div>
    </div>
  );
};
