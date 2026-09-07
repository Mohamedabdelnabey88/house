import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Architectural & Interior Consultant Endpoint
app.post("/api/ai-consultant", async (req, res) => {
  try {
    const { question, contextRoom, currentMode } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "السؤال مطلوب." });
    }

    const ai = getAiClient();
    if (!ai) {
      // Graceful fallback if no API key is provided
      return res.json({
        answer: `بصفتي المستشار المعماري للشقة:
بناءً على طلبك والتعديلات المعمارية المقترحة:
1. **غرفة الماستر الجديدة (غرفة الأطفال 1 سابقاً - 5.30م × 3.10م)**: المساحة كافية جداً (أكثر من 16.4م²) لإضافة حمام ماستر خاص (1.50م × 1.60م) ملاصق لمنور 1 لسهولة ربط مواسير الصرف والتغذية مع عمود الصرف الرئيسي دون الحاجة لتكسير خرسانة الأرضيات. كما يتبقى 3.70م × 3.10م تكفي سريراً كينج 180 سم مع دريسنج روم / دولاب ضخم بعرض 2.80م وشاشة معلقة.
2. **المطبخ الجديد (غرفة البنات سابقاً - 3.10م × 3.10م)**: يوفر تهوية ممتازة على منور 2، ويمكن تجهيزه بثلاجة، غسالة، بوتاجاز ببلت-إن وميكروويف مع مسار حركة مثلث ذهبي وبار خدمة مطل على الصالة.
3. **غرفة المعيشة الجديدة (المطبخ القديم سابقاً - 3.10م × 3.50م)**: ركنة مودرن L-Shape وشاشة 65 بوصة مع إضاءة دافئة وتهوية على منور 1.
4. **غرفة الأطفال (الماستر سابقاً - 4.16م × 3.18م)**: سريرين 120 سم مع كومودينو وسطي ومكتب دراسة ودولاب وإطلالة مباشرة على البلكونة.
5. **الصالة (7.51م × 3.51م)**: تقسيم سلس لمنطقة استقبال (صالون/أنتريه + شاشة) ومنطقة سفرة (طاولة سفرة + نيش + بوفيه) ومدخل أنيق بجزامة وكوفي كورنر.`,
        isOfflineFallback: true,
      });
    }

    const systemPrompt = `أنت مهندس معماري واستشاري تصميم داخلي وديكور محترف متخصص في إعادة توزيع وتقسيم الشقق السكنية في مصر والعالم العربي.
الشقة المحددة لدى العميل تحتوي على المعطيات والمحددات الهندسية الدقيقة التالية:
1. الصالة Lounge: 7.51 م × 3.51 م (المطلوب فيها: سفرة، نيش، جزامة، كوفي كورنر، أنتريه أمامه شاشة، بوفيه).
2. المطبخ القديم (Kitchen سابقاً): 3.10 م × 3.50 م -> تم تحويله إلى غرفة معيشة عائلية (ليفينج روم) بها ركنة L-Shape وشاشة تلفزيون، ويطل على منور 1.
3. الحمام الرئيسي: 2.38 م × 1.19 م (مساحة 3.27 م² تقريباً) يطل على منور 1 -> المطلوب: كابينة شاور زجاجية إيطالية، حوض مع وحدة موبيليا، قاعدة تواليت معلقة، مع دراسة خيار الجاكوزي بمساحة حركة مريحة.
4. غرفة البنات القديمة (girls room سابقاً): 3.10 م × 3.10 م -> تم تحويلها للمطبخ المودرن الجديد بكامل أجهزته (ثلاجة، غسالة، بوتاجاز ببلت إن، ميكرويف، خزائن ذكية على أعلى مستوى) مع شباك على منور 2.
5. غرفة الأطفال 1 القديمة (kids room 1 سابقاً): 5.30 م × 3.10 م -> أصبحت الغرفة الماستر الرئيسية (Master Bedroom) الفندقية مع سرير كينج، شاشة، دريسنج دولاب كبير، وحمام ماستر خاص (En-suite) تم توظيفه جهة منور 1 لربط الصرف والتغذية مع عمود السباكة الرئيسي.
6. غرفة الماستر القديمة (master bedroom سابقاً): 4.16 م × 3.18 م -> أصبحت غرفة نوم الأطفال وتتكون من سريرين 120 سم، مكتب مذاكرة، دولاب كبير، كومودينو، ومعها البلكونة المحفوظة (3.14 م²).
7. المحددات الثابتة المعمارية التي لا يجوز المساس بها:
- البلكونة تفضل مكانها تماماً.
- منور 1 ومنور 2 يظلان في مكانهما.

أجب العميل بلهجة مهنية راقية، واضحة، باللغة العربية (مع مصطلحات الديكور الشائعة بالمصري مثل ركنة، نيش، جزامة، بوفيه، سيفون دفن، شاور بوكس، جبسوم بورد)، وقدم نصائح عملية دقيقة هندسياً من حيث المقاسات ومسارات الحركة وميول السباكة وتوزيع الإضاءة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nالسياق الحالي: الغرفة المحددة: ${contextRoom || "الشقة بالكامل"}. النمط: ${currentMode || "التصميم المقترح"}.\nسؤال العميل: ${question}`,
            },
          ],
        },
      ],
    });

    const reply = response.text || "تم تحليل الطلب المعماري بنجاح.";
    return res.json({ answer: reply });
  } catch (error: any) {
    console.error("AI Consultant error:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء معالجة الاستشارة المعمارية.",
      details: error?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Apartment Architect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
