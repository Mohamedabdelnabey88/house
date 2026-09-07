import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Loader2,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  contextRoom?: string | null;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  'كيف يتم ربط صرف الحمام الماستر بمنور 1 دون تكسير خرسانة؟',
  'ما هو التوزيع الأفضل لقطع الصالة بين السفرة والأنتريه؟',
  'هل يفضل فتح بار أمريكي في المطبخ الجديد المطل على الممر؟',
  'أيهما أفضل في الحمام الرئيسي: كابينة الشاور أم الجاكوزي؟',
  'ما هي المقاسات القياسية لسرير ودولاب ومكتب غرفة الأطفال؟',
];

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  initialQuestion = '',
  contextRoom,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `أهلاً بك! أنا مستشارك المعماري والداخلي الذكي. أنا مطلع على المخطط الأصلي لشقتك وكافة الأبعاد والمحددات:
- الصالة (7.51م × 3.51م)
- غرفة الماستر الجديدة (غرفة الأطفال 1 سابقاً 5.30م × 3.10م) مع حمام خاص ودريسنج كبير
- المطبخ الجديد (مكان غرفة البنات 3.10م × 3.10م) مع منور 2
- غرفة المعيشة العائلية الجديدة (مكان المطبخ القديم 3.10م × 3.50م)
- غرفة الأطفال (الماستر القديمة 4.16م × 3.18م مع البلكونة)
- الحمام الرئيسي ومحددات منور 1 ومنور 2.

تفضل بأي استفسار تريده حول المقاسات، شبكة الصرف، توزيع العفش، أو بدائل الديكور!`,
      timestamp: 'الآن',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>(initialQuestion);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          contextRoom: contextRoom || 'كامل الشقة',
          currentMode: 'التصميم المقترح المطور',
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بخدمة المستشار المعماري');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: 'asst_' + Date.now(),
        sender: 'assistant',
        text: data.answer || 'تمت دراسة استفسارك المعماري بنجاح.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: 'عذراً، حدث خطأ أثناء معالجة السؤال. يمكنك المحاولة مجدداً أو اختيار أحد الأسئلة المقترحة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-100">
                  المهندس المعماري والاستشاري الذكي
                </h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-stone-400">
                إجابات معمارية وتنفيذية دقيقة مبنية على مقاسات شقتك ومحدداتها
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

        {/* Preset Questions Chips */}
        <div className="bg-stone-950/60 px-4 py-2.5 border-b border-stone-800/80 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] text-stone-400 font-bold shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            أسئلة شائعة:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-stone-800/80 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-stone-300 px-3 py-1.5 rounded-full border border-stone-700 whitespace-nowrap transition-all shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div>{m.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    m.sender === 'user' ? 'text-stone-800' : 'text-stone-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center shrink-0 border border-stone-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-stone-400 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>المهندس الذكي يحلل المخطط المعماري...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-stone-950 p-3 border-t border-stone-800 flex items-center gap-2">
          <input
            id="ai-consultant-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="اكتب سؤالك المعماري هنا (مثال: كيف أوزع مسار السباكة في الحمام؟)..."
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            id="ai-consultant-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
