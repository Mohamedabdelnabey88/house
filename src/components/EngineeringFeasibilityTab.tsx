import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Droplets, 
  Wind, 
  Maximize2, 
  Layers, 
  FileText,
  Hammer
} from 'lucide-react';

export const EngineeringFeasibilityTab: React.FC = () => {
  return (
    <div className="space-y-6 text-stone-200">
      
      {/* Intro Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-100">
              تقرير الجدوى الهندسية والمعمارية لإعادة التوزيع
            </h2>
            <p className="text-xs text-stone-400">
              تحليل دقيق لإمكانية عمل الحمام الماستر، نقل المطبخ، الحفاظ على المناور والبلكونة
            </p>
          </div>
        </div>
      </div>

      {/* 1. MASTER BATHROOM FEASIBILITY (حمام الماستر الخاص) */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h3 className="text-base font-bold text-purple-300">
              جدوى عمل حمام ماستر خاص داخل غرفة الأطفال 1 (kids room 1)
            </h3>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ممكن هندسياً 100% وبأعلى كفاءة
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          سؤال العميل: <span className="text-amber-400 italic font-medium">"بص بقا الغرفة الماستر محتاجها تكون الغرفة الثانية اللي هي تسمي kids room 1 وسوف يتوفر بها غرفه نوم كامله بشاشه انا نفسي اوفر فيها حمام خاص لو يصلح بالاضافه ان الدولاب يكون كبير أيضا"</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5 text-amber-400">
              <Droplets className="w-4 h-4" />
              سر النجاح المعماري: عبقرية الملاصقة لـ (منور 1)
            </h4>
            <p className="text-stone-400 leading-relaxed">
              غرفة الأطفال 1 أبعادها (5.30 م × 3.10 م = أكثر من 16.4 م²). جدارها السفلي الأيمن ملاصق مباشرة لـ <strong className="text-stone-200">منور 1</strong> وللحمام الرئيسي القائم!
              هذا يعني أن ماسورة صرف قاعدة التواليت (4 بوصة) وماسورة الشاور (2 بوصة) تخرج مباشرة إلى عمود الصرف الرئيسي في منور 1 عبر الجدار الخارجي دون الحاجة لمد مواسير تحت بلاط الغرفة أو المساس بحديد الخرسانة.
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5 text-emerald-400">
              <Maximize2 className="w-4 h-4" />
              توزيع المساحات بدقة السنتيمتر
            </h4>
            <ul className="space-y-1 text-stone-400">
              <li>• مساحة الحمام الماستر المقتطعة: <span className="text-stone-200 font-mono">1.60 م × 1.40 م</span> (تكفي كابينة شاور 80×80 + قاعدة معلقة + حوض).</li>
              <li>• مساحة الدريسنج روم (الدولاب الكبير): <span className="text-stone-200 font-mono">2.80 م × 0.65 م</span> دريسنج كامل 6 درف جرار.</li>
              <li>• مساحة غرفة النوم المتبقية: <span className="text-stone-200 font-mono">3.70 م × 3.10 م</span> (11.5 م²) تتسع لسرير كينج 180×200 سم، كومودينوهات وشاشة معلقة.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. KITCHEN RELOCATION & LIVING ROOM (نقل المطبخ وعمل غرفة المعيشة) */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h3 className="text-base font-bold text-emerald-300">
              نقل المطبخ لغرفة البنات (girls room) وتحويل المطبخ القديم لغرفة معيشة
            </h3>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            قرار تصميمي استثنائي
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5 text-emerald-400">
              المطبخ الجديد (3.10 م × 3.10 م)
            </h4>
            <p className="text-stone-400 leading-relaxed">
              • يطل مباشرة على <strong className="text-stone-200">منور 2</strong>، مما يتيح عمل طرد مباشر لشفاط البوتاجاز الهرمي بقوة تفريغ 100%.
              <br />
              • تمديد خط تغذية مياه ساخن وبارد من أقرب صاعد وتصريف الحوض والغسالة على منور 2.
              <br />
              • موقع الغرفة قريب جداً من الصالة، مما يتيح خيار عمل كاونتر بار أمريكي مفتوح (Breakfast Bar) يربط المطبخ بالممر والصالة.
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h4 className="font-bold text-stone-200 flex items-center gap-1.5 text-sky-400">
              غرفة المعيشة الجديدة (مكان المطبخ القديم - 3.10 م × 3.50 م)
            </h4>
            <p className="text-stone-400 leading-relaxed">
              • إلغاء مخارج مياه المطبخ القديمة واستبدالها بنقاط كهرباء وشبكة إنترنت للشاشة والريسيفر.
              <br />
              • الغرفة تصبح معزولة وهادئة ودافئة للأسرة مع ركنة L-Shape كبيرة وشاشة 65 بوصة، مما يعطي الصالة (Lounge) طابعاً فندقياً راقياً نظيفاً لاستقبال الضيوف في أي وقت!
            </p>
          </div>
        </div>
      </div>

      {/* 3. BATHROOM: WALK-IN SHOWER VS JACUZZI */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h3 className="text-base font-bold text-teal-300">
              الحمام الرئيسي (2.38 م × 1.19 م): كابينة الشاور مقابل الجاكوزي
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          طلب العميل: <span className="text-amber-400 italic font-medium">"الحمام بقا محتاج يكون فيه كابينه شاور والحوض والقعدة واكيد مساحه تحرك ولو ينفع اعمل جاكوزي ماشي"</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-teal-950/30 border border-teal-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-300">الخيار (أ): كابينة الشاور الإيطالية (موصى به جداً)</h4>
              <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[10px] font-bold">أفضل مساحة حركة</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              • كابينة شاور زجاج سيكوريت 10 مم بعرض 120 سم × 80 سم في نهاية الحمام تحت شباك منور 1.
              <br />
              • يتبقى مسافة 158 سم مريحة جداً لتركيب قاعدة معلقة بسيفون دفن توفر 20 سم، وحوض ديكور بوحدة تخزين.
              <br />
              • النتيجة: حمام فندقي مريح الحركة، سهل التنظيف، وعصري للغاية.
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-300">الخيار (ب): تركيب جاكوزي مساج</h4>
              <span className="bg-stone-800 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">يتطلب تدقيق</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              • يمكن تركيب جاكوزي طولي قياس (140 سم × 70 سم) أو ركني مع زاوية الحمام.
              <br />
              • المتطلبات التنفيذية: كابل كهرباء معزول 3×4 مم مباشر من اللوحة مع قاطع حماية تفاضلي (RCD/ELCB) ضد الصدمات الكهربائية لموتور ضخ المياه، مع ماسورة تصريف سريعة 2 بوصة.
              <br />
              • الملاحظة: سيضيق مسافة الحركة أمام القعدة قليلاً مقارنة بالشاور بوكس.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PRESERVED CONSTRAINTS (المحددات الثابتة) */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h3 className="text-base font-bold text-amber-300">
            الالتزام الصارم بالمحددات الثابتة المعمارية
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-amber-400 font-bold block mb-1">🌿 البلكونة (3.14 م²)</span>
            <p className="text-stone-400">
              محفوظة في مكانها الأصلي تماماً أعلى غرفة الأطفال، توفر شمس الصباح وتهوية صحية للأبناء.
            </p>
          </div>

          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-amber-400 font-bold block mb-1">🏗️ منور 1 (ثابت بمكانه)</span>
            <p className="text-stone-400">
              تم استغلاله كشريان رئيسي لصرف الحمام الرئيسي والحمام الماستر الجديد وتهوية غرفة المعيشة.
            </p>
          </div>

          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-amber-400 font-bold block mb-1">💨 منور 2 (ثابت بمكانه)</span>
            <p className="text-stone-400">
              تم استغلاله كشريان لصرف وشفاط المطبخ المودرن الجديد وغسالة الملابس بأعلى كفاءة.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
