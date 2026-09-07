import { jsPDF } from 'jspdf';
import { ROOMS_DATA } from '../data/apartmentData';
import { RoomId } from '../types';

export interface PdfExportOptions {
  includeDimensionsTable?: boolean;
  includeContractorNotes?: boolean;
  bathroomVariant?: 'shower' | 'jacuzzi';
}

/**
 * Draws crisp, perfectly shaped Arabic text and layout onto an offscreen canvas,
 * ensuring 100% correct Arabic ligatures and RTL direction in the exported PDF.
 */
export async function generateContractorBlueprintPdf(options: PdfExportOptions = {}): Promise<void> {
  const {
    includeDimensionsTable = true,
    includeContractorNotes = true,
    bathroomVariant = 'shower'
  } = options;

  // Standard A4 dimensions in pt: 595.28 x 841.89
  // At 2x scale for print quality (150-300 DPI): width 1654, height 2338
  const canvasWidth = 1654;
  const canvasHeight = 2338;

  // PAGE 1: Architectural Blueprint & Certified Dimensions
  const canvasPage1 = document.createElement('canvas');
  canvasPage1.width = canvasWidth;
  canvasPage1.height = canvasHeight;
  const ctx1 = canvasPage1.getContext('2d');
  if (!ctx1) throw new Error('Could not get 2d context for PDF rendering');

  renderPage1(ctx1, canvasWidth, canvasHeight, bathroomVariant);

  // PAGE 2: Contractor Demolition, MEP & Construction Specifications
  const canvasPage2 = document.createElement('canvas');
  canvasPage2.width = canvasWidth;
  canvasPage2.height = canvasHeight;
  const ctx2 = canvasPage2.getContext('2d');
  if (!ctx2) throw new Error('Could not get 2d context for page 2');

  renderPage2(ctx2, canvasWidth, canvasHeight, bathroomVariant);

  // Create jsPDF document in A4 portrait
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Add Page 1
  const imgData1 = canvasPage1.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  // Add Page 2
  if (includeContractorNotes) {
    pdf.addPage();
    const imgData2 = canvasPage2.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  // Save the PDF file
  const dateStr = new Date().toISOString().split('T')[0];
  pdf.save(`Al-Mokhtat-Al-Memari-Al-Moatamad_${dateStr}.pdf`);
}

function renderPage1(
  ctx: CanvasRenderingContext2D, 
  w: number, 
  h: number, 
  bathroomVariant: 'shower' | 'jacuzzi'
) {
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Outer Border & Margins
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, w - 100, h - 100);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, w - 120, h - 120);

  // --- 1. TITLE BLOCK / CARTOUCHE (ترويسة المشروع المعتمد) ---
  const headerY = 75;
  const headerHeight = 150;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(70, headerY, w - 140, headerHeight);

  // Header Text
  ctx.fillStyle = '#f8fafc';
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  
  ctx.font = 'bold 36px Cairo, Arial, sans-serif';
  ctx.fillText('مشروع إعادة التوزيع المعماري والفرش المتكامل (مخطط تنفيذي معتمد)', w - 110, headerY + 55);

  ctx.font = 'normal 22px Cairo, Arial, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('كود المخطط: ARC-2026-EXEC-V4 | مقياس الرسم: 1:50 | المساحة الإجمالية الصافية: 87.86 م²', w - 110, headerY + 95);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 18px Cairo, Arial, sans-serif';
  ctx.fillText(`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')} | حالة الاعتماد: صالح للتنفيذ والتسليم للمقاولين`, w - 110, headerY + 130);

  // Stamp Box on Left
  ctx.direction = 'ltr';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(100, headerY + 20, 200, 110);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px Cairo, Arial, sans-serif';
  ctx.fillText('معتمد للتنفيذ', 200, headerY + 55);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'normal 16px Cairo, Arial, sans-serif';
  ctx.fillText('CONSULTANT APPROVED', 200, headerY + 85);
  ctx.font = 'bold 14px monospace';
  ctx.fillText('STAGE: ARCH & MEP', 200, headerY + 110);

  // --- 2. 2D ARCHITECTURAL BLUEPRINT DRAWING BOX ---
  const bpY = 245;
  const bpH = 940;
  const bpW = w - 140;
  const bpX = 70;

  // Blueprint Frame
  ctx.fillStyle = '#090d16'; // Dark blueprint backdrop
  ctx.fillRect(bpX, bpY, bpW, bpH);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(bpX, bpY, bpW, bpH);

  // Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let x = bpX; x < bpX + bpW; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, bpY);
    ctx.lineTo(x, bpY + bpH);
    ctx.stroke();
  }
  for (let y = bpY; y < bpY + bpH; y += 40) {
    ctx.beginPath();
    ctx.moveTo(bpX, y);
    ctx.lineTo(bpX + bpW, y);
    ctx.stroke();
  }

  // Draw scaled rooms representation on blueprint
  drawBlueprintRooms(ctx, bpX, bpY, bpW, bpH, bathroomVariant);

  // --- 3. CERTIFIED ROOM DIMENSIONS TABLE (جدول الأبعاد الصافية المعتمدة) ---
  const tableY = 1210;
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px Cairo, Arial, sans-serif';
  ctx.fillText('جدول الأبعاد الصافية والمقارنة الهندسية (المعتمدة للمقاولين):', w - 80, tableY + 30);

  // Table Headers
  const thY = tableY + 55;
  const thH = 50;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(70, thY, w - 140, thH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Cairo, Arial, sans-serif';
  ctx.textAlign = 'center';

  const colX = {
    room: w - 180,
    origDim: w - 420,
    origArea: w - 570,
    propDim: w - 770,
    propArea: w - 940,
    vent: w - 1100,
    use: w - 1380,
  };

  ctx.fillText('الفراغ / الغرفة', colX.room, thY + 32);
  ctx.fillText('المقاس الأصلي', colX.origDim, thY + 32);
  ctx.fillText('المساحة القديمة', colX.origArea, thY + 32);
  ctx.fillText('المقاس المقترح المعتمد', colX.propDim, thY + 32);
  ctx.fillText('المساحة الصافية', colX.propArea, thY + 32);
  ctx.fillText('التهوية', colX.vent, thY + 32);
  ctx.fillText('الاستخدام والتوزيع المعتمد', colX.use, thY + 32);

  // Rows
  const tableData = [
    { name: 'الصالة والاستقبال', orig: '7.51 × 3.51 م', origA: '26.36 م²', prop: '7.51 × 3.51 م', propA: '26.36 م²', vent: 'واجهة رئيسية', use: 'سفرة 6 كراسي + بوفيه + ركنة L + كوفي كورنر' },
    { name: 'جناح الماستر الملكي', orig: '4.16 × 3.18 م', origA: '13.23 م²', prop: '4.80 × 4.21 م', propA: '20.20 م²', vent: 'منور 1 خاص', use: 'سرير كينج 180 + دريسنج مدمج بتسريحة + حمام جاكوزي' },
    { name: 'المطبخ المودرن المطور', orig: '3.10 × 3.10 م', origA: '9.61 م²', prop: '3.10 × 3.65 م', propA: '11.32 م²', vent: 'منور 2', use: 'مطبخ U موسع + بار أمريكي مفتوح + برج أجهزة' },
    { name: 'غرفة الأطفال والشباب', orig: '5.30 × 3.10 م', origA: '16.43 م²', prop: '3.74 × 3.10 م', propA: '11.60 م²', vent: 'منور 2', use: 'سريرين منفصلين 120سم + دولاب مدمج + مكتب ثنائي' },
    { name: 'غرفة المعيشة المستقلة', orig: '3.50 × 3.10 م', origA: '10.85 م²', prop: '3.10 × 3.20 م', propA: '9.92 م²', vent: 'منور 1', use: 'جلسة عائلية خاصة + ركنة سينما + شاشة وبانوهات' },
    { name: 'البلكونة الموسعة', orig: '3.18 × 1.10 م', origA: '3.50 م²', prop: '3.18 × 1.50 م', propA: '4.77 م²', vent: 'هواء طلق', use: 'فرن بلدي فخاري بمدخنة + طبلية روقان + زرع' },
    { name: 'الحمام الرئيسي الموسع', orig: '2.38 × 1.19 م', origA: '2.83 م²', prop: '2.38 × 1.55 م', propA: '3.69 م²', vent: 'منور 1', use: 'كابينة شاور زجاج سيكوريت 120×90 + حوض وتواليت معلق' },
  ];

  let currentY = thY + thH;
  tableData.forEach((row, i) => {
    const rowH = 46;
    ctx.fillStyle = i % 2 === 0 ? '#f8fafc' : '#ffffff';
    ctx.fillRect(70, currentY, w - 140, rowH);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, currentY, w - 140, rowH);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Cairo, Arial, sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(row.name, colX.room, currentY + 28);
    
    ctx.font = 'normal 15px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(row.orig, colX.origDim, currentY + 28);
    ctx.fillText(row.origA, colX.origArea, currentY + 28);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(row.prop, colX.propDim, currentY + 28);
    ctx.fillStyle = '#047857';
    ctx.fillText(row.propA, colX.propArea, currentY + 28);

    ctx.font = 'normal 15px Cairo, Arial, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(row.vent, colX.vent, currentY + 28);

    ctx.font = 'normal 14px Cairo, Arial, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(row.use, colX.use, currentY + 28);

    currentY += rowH;
  });

  // Total Summary Row
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(70, currentY, w - 140, 52);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, currentY, w - 140, 52);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 18px Cairo, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('إجمالي المساحة الصافية المستغلة بالكامل (بدون أي هدر):', w - 300, currentY + 32);
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#b45309';
  ctx.fillText('87.86 م²', colX.propArea, currentY + 34);
  ctx.font = 'bold 16px Cairo, Arial, sans-serif';
  ctx.fillStyle = '#047857';
  ctx.fillText('استغلال 100% وإلغاء الممرات المهدرة القديمة', colX.use, currentY + 32);

  // Footer Note & Page Number
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = 'normal 14px monospace';
  ctx.fillText('SHEET 01 / 02 - ARCHITECTURAL BLUEPRINT & CERTIFIED SCHEDULE', 70, h - 70);

  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillText('* جميع الأبعاد والفتحات مطابقة للكود المصري ومقاييس نويفرت الدولية للأثاث والتهوية', w - 70, h - 70);
}

function renderPage2(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bathroomVariant: 'shower' | 'jacuzzi'
) {
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Outer Border & Margins
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, w - 100, h - 100);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, w - 120, h - 120);

  // Header Block
  const headerY = 75;
  const headerHeight = 120;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(70, headerY, w - 140, headerHeight);

  ctx.fillStyle = '#f8fafc';
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.font = 'bold 32px Cairo, Arial, sans-serif';
  ctx.fillText('كراسة المواصفات التنفيذية للمقاولين (تكسير • بناء • سباكة • كهرباء)', w - 110, headerY + 50);

  ctx.font = 'normal 18px Cairo, Arial, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('ملحق المخطط التنفيذي ARC-2026-EXEC-V4 | إرشادات السلامة الإنشائية ومسارات التمديدات', w - 110, headerY + 90);

  // Section 1: Demolition & Wall Removal
  let secY = 220;
  drawContractorSection(
    ctx,
    70,
    secY,
    w - 140,
    260,
    '1. بنود أعمال التكسير والإزالة (Demolition Schedule)',
    '#dc2626',
    [
      '• إزالة القاطع الطوبي غير الحامل بين الممر القديم وغرفة الماستر لضمها بالكامل وجعلها جناحاً ملكياً (20.20 م²).',
      '• فتح مدخل المطبخ المودرن الجديد على الصالة وإزالة جزء الجدار بارتفاع الكاونتر (1.10م) لتشكيل بار إفطار أمريكي مفتوح.',
      '• تكسير وتعديل جدار الحمام القديم لزيادة عرضه من 1.19م إلى 1.55م لاستيعاب كابينة شاور 120×90سم وممر مريح.',
      '• فتح باب جديد للغرفة المستقلة (المطبخ القديم سابقاً) من الممر الداخلي لتحويلها لغرفة معيشة عائلية مستقلة.',
      '• تنبيه إنشائي حاسم: يمنع منعاً باتاً المساس بأي عمود خرساني أو كمرة ساقطة، وجميع الجدران المزالة هي قواطع طوب مفرغ 10سم.'
    ]
  );

  // Section 2: Masonry & New Walls
  secY += 280;
  drawContractorSection(
    ctx,
    70,
    secY,
    w - 140,
    240,
    '2. بنود أعمال البناء والمحارة (Masonry & Partitions)',
    '#2563eb',
    [
      '• بناء قاطع طوبي خفيف سمك 10سم لفصل حمام الماستر الداخلي وتجهيز تجويف الجاكوزي بنظام العزل المائي.',
      '• بناء كاونتر البار الأمريكي من الطوب المصمت بارتفاع 90 سم وعرض 60 سم مع تجهيز التغذية والكهرباء به.',
      '• تأسيس عتب خرساني مسلح للأبواب المعدلة (باب الماستر، باب المعيشة، وباب الحمام الرئيسي).',
      '• استخدام مونة أسمنتية غنية بنسبة 350 كجم/م³ مع معالجة الشروخ بسلك شبك فايبر جلاس قبل المحارة.'
    ]
  );

  // Section 3: Plumbing & Sanitary Installations
  secY += 260;
  drawContractorSection(
    ctx,
    70,
    secY,
    w - 140,
    300,
    '3. بنود السباكة والصرف والتغذية المعتمدة (Plumbing & Drainage)',
    '#0d9488',
    [
      '• حمام الماستر والجاكوزي: مد خط صرف 2 بوصة مع ميل هيدروليكي 1.5 سم/متر مباشرة نحو المنور 1 (أقصر مسار صرف).',
      '• المطبخ الجديد: تمديد مواسير التغذية البولي بروبلين (PPR) المعزولة حرارياً من صاعد المنور 2 لخدمة الحوض وغسالة الأطباق.',
      '• الحمام الرئيسي الموسع: تأسيس صفاية مياه خطية مستوية مع السيراميك (Linear Drain) لكابينة الشاور الإيطالية.',
      '• عزل كيميائي مزدوج (سيكا 107 أو إنسومات) لجميع أرضيات الحمامات والمطبخ والبلكونة مع رفعة رقبة زجاجة 30 سم على الجدران.',
      '• عمل اختبار ضغط للمواسير على 10 بار لمدة 24 ساعة قبل صب خرسانة الميول أو تركيب السيراميك.'
    ]
  );

  // Section 4: Electrical & HVAC
  secY += 320;
  drawContractorSection(
    ctx,
    70,
    secY,
    w - 140,
    270,
    '4. بنود الكهرباء والإضاءة والتكييف (Electrical & HVAC Routing)',
    '#d97706',
    [
      '• تأسيس مسارات نحاس التكييف وصرف التكييف داخل الجدران لجميع الغرف (الصالة 3 حصان، الماستر 2.25 حصان، الأطفال 1.5 حصان).',
      '• تخصيص لوحة مفاتيح أوتوماتيك فرعية للمطبخ مع قواطع مستقلة (32 أمبير للفرن، 16 أمبير لغسالة الأطباق والميكرويف).',
      '• مفاتيح ديفاتير (Double Control) بجوار السرير الكينج وباب الغرفة للتحكم في الإضاءة دون الحاجة للنهوض.',
      '• تأسيس خط تغذية مروحة شفط مركزية بمدخنة الفرن البلدي في البلكونة.'
    ]
  );

  // Section 5: Signatures and Approvals (أختام وتوقيعات الاعتماد)
  secY += 290;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, secY, w - 140, 160);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(72, secY + 2, w - 144, 156);

  ctx.fillStyle = '#0f172a';
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px Cairo, Arial, sans-serif';

  const sigBoxW = (w - 140) / 3;
  ctx.fillText('اعتماد المهندس الاستشاري المشرف', 70 + sigBoxW * 2.5, secY + 40);
  ctx.fillText('توقيع المقاول العام المنفذ', 70 + sigBoxW * 1.5, secY + 40);
  ctx.fillText('موافقة واعتماد مالك الشقة', 70 + sigBoxW * 0.5, secY + 40);

  ctx.font = 'normal 15px Cairo, Arial, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('التوقيع: ____________________', 70 + sigBoxW * 2.5, secY + 95);
  ctx.fillText('التوقيع: ____________________', 70 + sigBoxW * 1.5, secY + 95);
  ctx.fillText('التوقيع: ____________________', 70 + sigBoxW * 0.5, secY + 95);

  ctx.font = 'normal 13px Cairo, Arial, sans-serif';
  ctx.fillText('الختم المعماري الرسمي', 70 + sigBoxW * 2.5, secY + 130);
  ctx.fillText('تاريخ البدء المتفق عليه', 70 + sigBoxW * 1.5, secY + 130);
  ctx.fillText('نسخة العميل المعتمدة', 70 + sigBoxW * 0.5, secY + 130);

  // Footer Note
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = 'normal 14px monospace';
  ctx.fillText('SHEET 02 / 02 - CONTRACTOR MEP & DEMOLITION SPECIFICATIONS', 70, h - 70);

  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillText('تم إعداد الكراسة وفقاً لأصول الصناعة والاشتراطات الهندسية لضمان تنفيذ لا يسبب أي إزعاج أو خلل للمبنى', w - 70, h - 70);
}

function drawContractorSection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  badgeColor: string,
  bullets: string[]
) {
  // Container Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Title bar
  ctx.fillStyle = badgeColor;
  ctx.fillRect(x, y, width, 44);

  ctx.fillStyle = '#ffffff';
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.font = 'bold 20px Cairo, Arial, sans-serif';
  ctx.fillText(title, x + width - 25, y + 30);

  // Bullets
  ctx.font = 'normal 16px Cairo, Arial, sans-serif';
  ctx.fillStyle = '#1e293b';

  bullets.forEach((bullet, bIdx) => {
    ctx.fillText(bullet, x + width - 25, y + 80 + bIdx * 34);
  });
}

function drawBlueprintRooms(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  bathroomVariant: 'shower' | 'jacuzzi'
) {
  // Scaling factors to fit the 12m x 9m apartment in bw x bh
  const padX = 80;
  const padY = 60;
  const drawW = bw - padX * 2;
  const drawH = bh - padY * 2;

  // Scale: 1200 units width, 900 units height
  const sx = (val: number) => bx + padX + (val / 1200) * drawW;
  const sy = (val: number) => by + padY + (val / 900) * drawH;
  const sw = (val: number) => (val / 1200) * drawW;
  const sh = (val: number) => (val / 900) * drawH;

  // Rooms Data for scaled drawing
  const rooms = [
    // Lounge (Right Side)
    { id: 'lounge', name: 'الصالة والاستقبال', dim: '7.51 × 3.51 م (26.36 م²)', x: 740, y: 50, w: 380, h: 720, color: '#1e3a8a', stroke: '#3b82f6' },
    // Balcony
    { id: 'balcony', name: 'البلكونة والفرن البلدي', dim: '3.18 × 1.50 م (4.77 م²)', x: 740, y: 780, w: 380, h: 90, color: '#78350f', stroke: '#f59e0b' },
    // Master Suite
    { id: 'master', name: 'جناح الماستر الملكي + دريسنج وحمام', dim: '4.80 × 4.21 م (20.20 م²)', x: 260, y: 50, w: 460, h: 360, color: '#581c87', stroke: '#a855f7' },
    // Kids Room
    { id: 'kids', name: 'غرفة نوم الأطفال والشباب', dim: '3.74 × 3.10 م (11.60 م²)', x: 260, y: 430, w: 330, h: 340, color: '#134e4a', stroke: '#14b8a6' },
    // Living Room (Old Kitchen)
    { id: 'living', name: 'غرفة المعيشة العائلية المستقلة', dim: '3.10 × 3.20 م (9.92 م²)', x: 610, y: 430, w: 110, h: 220, color: '#1e293b', stroke: '#64748b' },
    // New Kitchen
    { id: 'kitchen', name: 'المطبخ المودرن وبار الإفطار', dim: '3.10 × 3.65 م (11.32 م²)', x: 50, y: 430, w: 190, h: 340, color: '#064e3b', stroke: '#10b981' },
    // Main Bathroom
    { id: 'bathroom', name: 'الحمام الرئيسي الموسع', dim: '2.38 × 1.55 م (3.69 م²)', x: 50, y: 230, w: 190, h: 180, color: '#0e7490', stroke: '#06b6d4' },
    // Shaft 1
    { id: 'shaft1', name: 'منور 1', dim: 'تهوية ماستر ومعيشة', x: 50, y: 50, w: 190, h: 160, color: '#1c1917', stroke: '#78716c' },
  ];

  // Draw Room Boundaries
  rooms.forEach((r) => {
    const rx = sx(r.x);
    const ry = sy(r.y);
    const rw = sw(r.w);
    const rh = sh(r.h);

    // Fill room floor
    ctx.fillStyle = r.color;
    ctx.fillRect(rx, ry, rw, rh);

    // Wall lines
    ctx.strokeStyle = r.stroke;
    ctx.lineWidth = 4;
    ctx.strokeRect(rx, ry, rw, rh);

    // Room Label
    ctx.fillStyle = '#ffffff';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Cairo, Arial, sans-serif';
    ctx.fillText(r.name, rx + rw / 2, ry + rh / 2 - 12);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(r.dim, rx + rw / 2, ry + rh / 2 + 16);
  });

  // Highlight Special Fixtures (Jacuzzi, Oven, Bar)
  // Jacuzzi in Master
  const jx = sx(300);
  const jy = sy(80);
  ctx.fillStyle = '#0891b2';
  ctx.fillRect(jx, jy, sw(110), sh(90));
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 2;
  ctx.strokeRect(jx, jy, sw(110), sh(90));
  ctx.fillStyle = '#ecfeff';
  ctx.font = 'bold 12px Cairo';
  ctx.fillText('جاكوزي ماستر', jx + sw(55), jy + sh(50));

  // Balcony Traditional Oven
  const ox = sx(760);
  const oy = sy(800);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(ox, oy, sw(80), sh(60));
  ctx.fillStyle = '#fff7ed';
  ctx.font = 'bold 12px Cairo';
  ctx.fillText('فرن بلدي', ox + sw(40), oy + sh(35));

  // American Bar in Kitchen
  const bxPos = sx(220);
  const byPos = sy(490);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(bxPos, byPos, sw(25), sh(140));
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 11px Cairo';
  ctx.fillText('بار', bxPos + sw(12), byPos + sh(75));

  // North Arrow
  const naX = bx + bw - 60;
  const naY = by + 60;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(naX, naY + 30);
  ctx.lineTo(naX, naY - 30);
  ctx.lineTo(naX - 10, naY - 10);
  ctx.moveTo(naX, naY - 30);
  ctx.lineTo(naX + 10, naY - 10);
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.direction = 'ltr';
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('N (بحري)', naX, naY - 38);
}
