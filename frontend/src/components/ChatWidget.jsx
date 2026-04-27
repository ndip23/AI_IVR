import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { 
  Send, Heart, User, Loader2, ThumbsUp, ThumbsDown, 
  Mic, MicOff, Volume2, VolumeX 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatWidget() {
  const [lang, setLang] = useState('en'); // 'en', 'fr', or 'pg' (Pidgin)
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Dictionary for Trilingual UI ---
  const t = {
    en: {
      greeting: "Hello Mama. I am your health assistant. Please tell me or type how you or your child are feeling today. I can give you first-aid advice.",
      placeholder: "Speak or type symptoms...",
      listening: "Listening to you...",
      loading: "Analyzing symptoms...",
      welcome: "Medical Support Live",
      you: "YOU",
      btn: "EN"
    },
    fr: {
      greeting: "Bonjour Maman. Je suis votre assistante santé. Dites-moi ou écrivez comment vous ou votre enfant vous sentez aujourd'hui.",
      placeholder: "Parlez ou écrivez les symptômes...",
      listening: "Je vous écoute...",
      loading: "Analyse des symptômes...",
      welcome: "Support Médical en Direct",
      you: "VOUS",
      btn: "FR"
    },
    pg: {
      greeting: "Mami, I greet you oh. I be your health assistant. Tell me how you or your pikin de feel today. I go tell you how for help am.",
      placeholder: "Talk or type your matter...",
      listening: "I de listen you...",
      loading: "I de check the matter...",
      welcome: "Direct Health Help",
      you: "YOU",
      btn: "PG"
    }
  };

  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: t[lang].greeting }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // ==========================================
  // 1. SPEECH-TO-TEXT (STT) 
  // ==========================================
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      // Setting language for STT
      if (lang === 'fr') recognitionRef.current.lang = 'fr-FR';
      else recognitionRef.current.lang = 'en-US'; // English works best for Pidgin STT

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0]).map(r => r.transcript).join('');
        setInput(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [lang]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success(lang === 'fr' ? "J'écoute..." : "I de listen...");
    }
  };

  // ==========================================
  // 2. TEXT-TO-SPEECH (TTS)
  // ==========================================
  const speakText = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice accent setting
    utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US'; 
    utterance.rate = 0.85; // Slower for clear medical guidance
    window.speechSynthesis.speak(utterance);
  };

  // ==========================================
  // 3. SEND MESSAGE
  // ==========================================
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: uuidv4(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Send message AND current language to backend
      const res = await axios.post('http://localhost:5000/api/chat', { 
        message: userMsg,
        language: lang 
      });

      const botAnswer = res.data.response;
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: botAnswer }]);
      speakText(botAnswer);
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    // Reset conversation with the new language greeting
    setMessages([{ id: uuidv4(), role: 'assistant', content: t[newLang].greeting }]);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] border border-teal-100 mx-auto">
      
      {/* HEADER */}
      <div className="bg-teal-700 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-inner animate-pulse">
            <Heart size={24} className="text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">MamaCare AI</h2>
            <p className="text-teal-200 text-[10px] font-bold uppercase tracking-widest">{t[lang].welcome}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TRILINGUAL SWITCHER */}
          <div className="bg-teal-800 p-1 rounded-xl flex items-center gap-1 border border-teal-600 shadow-inner">
            {['en', 'fr', 'pg'].map((l) => (
              <button 
                key={l}
                onClick={() => changeLanguage(l)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${lang === l ? 'bg-white text-teal-800 shadow-md' : 'text-teal-300 hover:text-white'}`}
              >
                {t[l].btn}
              </button>
            ))}
          </div>

          <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-teal-600 text-white'}`}>
            {isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
          </button>
        </div>
      </div>
      
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 bg-teal-50/20 flex flex-col gap-5 font-medium">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className="flex-shrink-0 mt-auto mb-1">
              {msg.role === 'user' ? 
                <div className="bg-teal-600 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[8px] border-2 border-white shadow-md">{t[lang].you}</div> : 
                <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-md border border-teal-100"><Heart size={18} className="text-rose-500 fill-rose-500"/></div>
              }
            </div>
            <div className={`p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-teal-100 rounded-bl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="self-start ml-11 text-[10px] font-black text-teal-600 animate-bounce uppercase tracking-tighter">{t[lang].loading}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-teal-50 flex gap-3 items-center">
        <button 
          type="button" 
          onClick={toggleListen}
          className={`p-4 rounded-full transition-all shadow-lg ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}
        >
          {isListening ? <MicOff size={24}/> : <Mic size={24}/>}
        </button>

        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={isListening ? t[lang].listening : t[lang].placeholder} 
          disabled={isLoading}
          className="flex-1 border-2 border-teal-50 bg-teal-50/50 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-[15px] transition-all" 
        />
        
        <button type="submit" disabled={isLoading || !input.trim()} className="bg-teal-700 text-white p-4 rounded-full shadow-xl hover:bg-teal-800 active:scale-90 transition-all">
          {isLoading ? <Loader2 className="animate-spin" size={24}/> : <Send size={24} />}
        </button>
      </form>
    </div>
  );
}