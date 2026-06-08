import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquareHeart, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';

interface AssistantChatProps {
  language?: 'en' | 'hi' | 'ta' | 'mr';
  onLanguageChange?: (lang: 'en' | 'hi' | 'ta' | 'mr') => void;
}

const LOCALIZED_WELCOME = {
  en: "Hey there! 👋 I'm your MedFind health buddy. Think of me as a close friend or family doctor who helps you figure out government benefits, hospital schemes, and treatment budgets.\n\nNo boring rules or scary clinical walls of text—I promise! How are you holding up today? What's on your mind? We can chat in English, हिंदी, தமிழ், or मराठी!",
  hi: "नमस्ते दोस्त! 👋 मैं आपका मेडफाइंड साथी हूँ। मुझे एक करीबी पारिवारिक डॉक्टर या मददगार दोस्त समझें जो आपको स्वास्थ्य योजनाओं और इलाज के खर्चों को आसान शब्दों में समझाएगा।\n\nकोई मुश्किल और उबाऊ वैज्ञानिक शब्द नहीं, यह मेरा वादा है! आप आज कैसा महसूस कर रहे हैं? क्या आप चाहते हैं कि मैं आपके लिए कैंसर सहायता, किडनी डायलिसिस के खर्च या सरकारी योजनाओं की जानकारी खोजूं?",
  ta: "வணக்கம் நண்பா! 👋 நான் உங்க மெட்ஃபைண்ட் மொபைல் தோழன். ஒரு நெருங்கிய குடும்ப டாக்டர் போல அல்லது அன்பு நண்பனைப் போல அரசு வழங்கும் மருத்துவக் காப்பீடு மற்றும் சலுகைகளை மிக எளிமையாக விளக்க நான் இருக்கேன்.\n\nகடினமான வார்த்தைகள் இல்லாத சுலபமான விளக்கம் தருவேன்! இன்னைக்கு உங்களுக்கு என்ன உதவி வேணும்? புற்றுநோய் உதவித்தொகை, டயாலிசிஸ் செலவுகள் அல்லது தமிழக அரசின் இலவச அட்டை பற்றி பார்க்கலாமா?",
  mr: "नमस्कार मित्रा! 👋 मी तुझा मेडफाइंड डॉक्टर सहकारी मित्र आहे. आपल्याला सरकारी आरोग्य योजना आणि मोफत उपचारांची सर्व माहिती अगदी साध्या, सोप्या शब्दात सांगायला मी आलो आहे.\n\nकोणताही क्लिष्ट सरकारी किंवा वैद्यकीय शब्द न वापरता अतिशय सोप्या भाषेत समजून घेऊ! आज तुला काय मदत हवी आहे दोस्त? कॅन्सर उपचार, किडनी डायलिसिस किंवा इतर योजनांची माहिती शोधायची का?"
};

const LOCALIZED_SUGGESTIONS = {
  en: [
    "Breast cancer support in Chennai",
    "PMJAY dialysis hospital slots",
    "How does Maharashtra MJPJAY help?"
  ],
  hi: [
    "चेन्नई में ब्रेस्ट कैंसर सहायता",
    "PMJAY डायलिसिस अस्पताल स्लॉट",
    "महाराष्ट्र MJPJAY योजना क्या है?"
  ],
  ta: [
    "சென்னையில் மார்பக புற்றுநோய் உதவி",
    "PMJAY டயாலிசிஸ் மருத்துவமனை",
    "மகாராஷ்டிரா MJPJAY என்றால் என்ன?"
  ],
  mr: [
    "चेन्नईमध्ये ब्रेस्ट कॅन्सर मदत",
    "PMJAY डायलिसिस हॉस्पिटल",
    "महाराष्ट्र MJPJAY योजना काय आहे?"
  ]
};

const LOCALIZED_CHIPS_LABEL = {
  en: "Welfare suggestions:",
  hi: "कल्याणकारी सुझाव विषय:",
  ta: "உங்களுக்கு உதவக்கூடிய தலைப்புகள்:",
  mr: "मदतीसाठी सुचवलेले विषय:"
};

const LOCALIZED_INPUT_PLACEHOLDER = {
  en: "Typing a message to your healthcare buddy...",
  hi: "अपने स्वास्थ्य साथी को संदेश लिखें...",
  ta: "உங்க தோழனிடம் ஏதேனும் கேளுங்கள்...",
  mr: "आपल्या डॉक्टर मित्राला संदेश लिहा..."
};

const LOCALIZED_EVALUATING = {
  en: "Talking with my resources, wait a bit buddy...",
  hi: "कल्याण संसाधन से जानकारी जुटा रहा हूँ दोस्त...",
  ta: "உதவித் திட்டங்களைச் சரிபார்க்கிறேன் நண்பா...",
  mr: "योजनांची माहिती गोळा करत आहे मित्रा..."
};

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' }
] as const;

export default function AssistantChat({ language = 'en', onLanguageChange }: AssistantChatProps) {
  const [localLang, setLocalLang] = useState<'en' | 'hi' | 'ta' | 'mr'>(language);

  // Sync state with parent if used
  const activeLang = onLanguageChange ? language : localLang;
  const setLang = (newLang: 'en' | 'hi' | 'ta' | 'mr') => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setLocalLang(newLang);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Automatically load / reset welcome message based on active language if no chats are sent yet
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: LOCALIZED_WELCOME[activeLang],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeLang]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language: activeLang })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response.");
      }

      if (data.success && data.message) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: data.message,
          citations: data.citations || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOfflineFallback: data.isOfflineFallback || false
        }]);
      } else {
        throw new Error("No answer generated.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Dynamic Conversational Friendly Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-850 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg flex items-center justify-center">
            <MessageSquareHeart className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>Your MedFind Buddy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            </h3>
            <span className="text-[8.5px] text-teal-400 font-extrabold uppercase tracking-wider block">
              {activeLang === 'hi' && 'हमेशा आपके साथ'}
              {activeLang === 'ta' && 'உங்களுக்காக என்றும்'}
              {activeLang === 'mr' && 'आपला डॉक्टर मित्र'}
              {activeLang === 'en' && 'Always here to support you'}
            </span>
          </div>
        </div>

        {/* User Friendly Language Selection buttons inside chat controller header */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLang(opt.code)}
              className={`px-2 py-1 rounded-lg text-[9.5px] font-black transition-all flex items-center gap-1 ${
                activeLang === opt.code
                  ? 'bg-teal-500 text-slate-950 shadow shadow-teal-500/10 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={`Switch language to ${opt.label}`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 select-text">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={m.id} 
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                isUser 
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                  : 'bg-slate-900 border-slate-800 text-teal-400'
              }`}>
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Bubble wrapper */}
              <div className="space-y-1 max-w-[90%]">
                <div className={`rounded-2xl p-3.5 text-[11px] leading-relaxed shadow-sm ${
                  isUser 
                    ? 'bg-cyan-500/10 border border-cyan-500/15 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-850 text-slate-300 rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {m.content}

                  {m.isOfflineFallback && (
                    <div className="mt-3 pt-2 border-t border-amber-500/10 text-[9px] text-amber-300/80 leading-snug flex items-start gap-1.5 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500 inline-block" />
                      <span>
                        {activeLang === 'hi' && <strong>सुरक्षित ऑफलाइन मैच:</strong>}
                        {activeLang === 'ta' && <strong>ஆஃப்லைன் உதவிக்குறிப்பு:</strong>}
                        {activeLang === 'mr' && <strong>ऑफलाइन सुरक्षित पर्याय:</strong>}
                        {activeLang === 'en' && <strong>Offline Cache Match:</strong>} Let-down by live API counts? Relax, I loaded verified governmental benefits from your offline card storage!
                      </span>
                    </div>
                  )}

                  {/* Grounded Citation links if present */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-slate-850 space-y-1.5">
                      <span className="text-[8px] font-black tracking-widest text-teal-400 uppercase block">Verified Sources to check:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map((cite, cIdx) => (
                          <a 
                            key={cIdx}
                            href={cite.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-950/80 hover:bg-slate-950 text-[9px] text-teal-400 hover:text-white border border-slate-800 rounded-md px-2 py-1 flex items-center gap-1 transition-colors truncate max-w-[170px]"
                          >
                            <ExternalLink className="h-2.5 w-2.5 shrink-0 text-teal-500" />
                            {cite.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className={`text-[8px] text-slate-500 block ${isUser ? 'text-right' : ''}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 flex items-center justify-center shrink-0">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
            </div>
            <div className="bg-slate-900 border border-slate-850 text-slate-400 rounded-2xl rounded-tl-none p-3.5 text-[9.5px] uppercase font-bold tracking-widest flex items-center gap-1.5 select-none text-teal-400 font-mono">
              {LOCALIZED_EVALUATING[activeLang]}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl flex items-start gap-2 text-[10.5px] text-red-400 max-w-[90%] mx-auto">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
            <div>
              <span className="font-bold block">Assistance Interrupted</span>
              {error}
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Localized Suggestion Chips */}
      {messages.length === 1 && !loading && (
        <div className="px-4 py-2 border-t border-slate-850/50 bg-slate-950/50 space-y-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            {LOCALIZED_CHIPS_LABEL[activeLang]}
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {LOCALIZED_SUGGESTIONS[activeLang].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggest(tag)}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-teal-400 border border-slate-850 hover:border-slate-800 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
              >
                💡 {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputMessage);
        }}
        className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2 shrink-0 w-full"
      >
        <input 
          type="text"
          placeholder={LOCALIZED_INPUT_PLACEHOLDER[activeLang]}
          value={inputMessage}
          disabled={loading}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-900 text-white placeholder-slate-500 border border-slate-800 focus:border-teal-500/60 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 disabled:text-slate-550 text-slate-950 rounded-xl px-4 flex items-center justify-center transition-all shadow-lg shadow-teal-500/10 focus:outline-none shrink-0 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
