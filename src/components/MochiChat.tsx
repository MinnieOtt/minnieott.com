import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, RotateCcw, Minimize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { text: 'Who is Minnie?', id: 'sugg-who-is-minnie' },
  { text: 'What is JMX Programming? 📘', id: 'sugg-jmx' },
  { text: 'Tell me about her Google career', id: 'sugg-google' },
  { text: 'Education & Patents 🎓', id: 'sugg-edu' },
];

// Helper to parse inline styles like **bold**, *italic*, `code`, and [text](url)
function parseInline(text: string): React.ReactNode[] {
  // Matches **bold**, *italic*, `code`, [text](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="bg-neutral-100 font-mono text-[11px] px-1.5 py-0.5 rounded text-[#3333FF] font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3333FF] hover:underline font-semibold"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
}

// Helper to render basic markdown paragraphs, lists, and headers
function renderMarkdown(text: string, isModel: boolean): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  
  const flushList = (key: string | number) => {
    if (!currentList) return null;
    const listKey = `list-${key}`;
    const listType = currentList.type;
    const items = currentList.items;
    currentList = null;
    
    if (listType === 'ul') {
      return (
        <ul key={listKey} className="list-disc pl-4 my-2 space-y-1.5 text-[13px]">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={listKey} className="list-decimal pl-4 my-2 space-y-1.5 text-[13px]">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentList) {
        const listEl = flushList(i);
        if (listEl) elements.push(listEl);
      }
      continue;
    }
    
    // Check if line is a bullet item (starts with - or * or • or +)
    const isBullet = trimmed.match(/^[-*•+]\s+(.*)/);
    // Check if line is a sub-bullet starting with spaces then - or *
    const isIndentBullet = line.match(/^\s+[-*•+]\s+(.*)/);
    
    if (isBullet || isIndentBullet) {
      const content = isBullet ? isBullet[1] : (isIndentBullet ? isIndentBullet[1] : '');
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(content);
      } else {
        if (currentList) {
          const listEl = flushList(i);
          if (listEl) elements.push(listEl);
        }
        currentList = { type: 'ul', items: [content] };
      }
      continue;
    }
    
    // Check if line is a numbered item
    const isNumbered = trimmed.match(/^\d+\.\s+(.*)/);
    if (isNumbered) {
      const content = isNumbered[1];
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(content);
      } else {
        if (currentList) {
          const listEl = flushList(i);
          if (listEl) elements.push(listEl);
        }
        currentList = { type: 'ol', items: [content] };
      }
      continue;
    }
    
    // If not a list item, flush any existing list
    if (currentList) {
      const listEl = flushList(i);
      if (listEl) elements.push(listEl);
    }
    
    // Check for headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={i} className={`font-display font-bold text-xs mt-3 mb-1.5 leading-snug ${isModel ? 'text-gray-900' : 'text-white'}`}>
          {parseInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={i} className={`font-display font-bold text-sm mt-4 mb-2 leading-snug ${isModel ? 'text-gray-900' : 'text-white'}`}>
          {parseInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={i} className={`font-display font-bold text-base mt-4 mb-2 leading-snug ${isModel ? 'text-gray-900' : 'text-white'}`}>
          {parseInline(trimmed.slice(2))}
        </h2>
      );
    } else {
      // Normal paragraph line
      elements.push(
        <p key={i} className="text-[13px] leading-relaxed mb-2 last:mb-0">
          {parseInline(line)}
        </p>
      );
    }
  }
  
  if (currentList) {
    const listEl = flushList('final');
    if (listEl) elements.push(listEl);
  }
  
  return <div className="space-y-1">{elements}</div>;
}

export default function MochiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages from localStorage if available, else load welcome message
  useEffect(() => {
    const saved = localStorage.getItem('mochi_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        loadWelcomeMessage();
      }
    } else {
      loadWelcomeMessage();
    }
  }, []);

  // Save messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mochi_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const loadWelcomeMessage = () => {
    const welcome: ChatMessage = {
      id: 'welcome-msg',
      role: 'model',
      text: "Hi there! 🥞 I'm Mochi, Minnie's pancake-loving AI companion. I can answer any questions you have about Minnie's software engineering background, leadership experience, her publication *JMX Programming*, or anything else! Ask me anything.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
  };

  const handleResetChat = () => {
    localStorage.removeItem('mochi_chat_history');
    loadWelcomeMessage();
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare simplified history for API endpoint
      const payload = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/mochi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: payload }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || "Oh dear, my batter got a bit mixed up! 🥞 Can you try asking again?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error('Mochi Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: "I had a small issue flapping over that response! 🥞 Please make sure the server is fully started or try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Notification effect if chat is closed and messages are loaded (simulated greeting nudge)
  useEffect(() => {
    if (!isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  return (
    <div id="mochi-chatbot-wrapper" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <motion.button
        id="mochi-chat-toggle-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg relative ${
          isOpen ? 'bg-gray-800 text-white' : 'bg-[#3333FF] text-white'
        } transition-colors duration-300`}
        aria-label="Toggle chat companion"
      >
        {isOpen ? (
          <Minimize2 id="mochi-toggle-icon-close" className="w-6 h-6" />
        ) : (
          <div id="mochi-avatar-container" className="relative w-full h-full flex items-center justify-center">
            <img
              id="mochi-btn-avatar"
              src="/mochi-pancake-ott.png"
              alt="Mochi"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-inner"
              referrerPolicy="no-referrer"
            />
            {hasNewMessage && (
              <span
                id="mochi-notif-dot"
                className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"
              />
            )}
          </div>
        )}
      </motion.button>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mochi-chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-3xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden accent-glow"
          >
            {/* Header */}
            <div
              id="mochi-chat-header"
              className="bg-gray-950 text-white p-4 flex items-center justify-between border-b border-gray-850 shrink-0"
            >
              <div id="mochi-header-profile" className="flex items-center gap-3">
                <div id="mochi-header-avatar-ring" className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/20">
                  <img
                    id="mochi-header-avatar"
                    src="/mochi-pancake-ott.png"
                    alt="Mochi Mascot"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    id="mochi-online-status"
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-950 rounded-full"
                  />
                </div>
                <div id="mochi-header-texts" className="flex flex-col text-left">
                  <span id="mochi-header-name" className="font-display font-black text-sm tracking-wide flex items-center gap-1.5 text-white">
                    Mochi AI <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </span>
                  <span id="mochi-header-sub" className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                    Minnie's Digital Companion
                  </span>
                </div>
              </div>

              <div id="mochi-header-actions" className="flex items-center gap-1">
                <button
                  id="mochi-reset-btn"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="mochi-close-panel-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div
              id="mochi-messages-box"
              className="flex-1 p-4 overflow-y-auto bg-neutral-50/40 flex flex-col gap-4 text-left"
            >
              {messages.map((msg) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={msg.id}
                    id={`mochi-msg-row-${msg.id}`}
                    className={`flex ${isModel ? 'justify-start' : 'justify-end'} items-end gap-2.5`}
                  >
                    {isModel && (
                      <div id={`mochi-avatar-wrap-${msg.id}`} className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-100 border border-gray-200">
                        <img
                          id={`mochi-msg-avatar-${msg.id}`}
                          src="/mochi-pancake-ott.png"
                          alt="Mochi"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div id={`mochi-msg-bubble-container-${msg.id}`} className="flex flex-col max-w-[78%] gap-0.5">
                      <div
                        id={`mochi-msg-bubble-${msg.id}`}
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          isModel
                            ? 'bg-white text-gray-850 border border-gray-100 rounded-bl-xs shadow-3xs'
                            : 'bg-[#3333FF] text-white rounded-br-xs'
                        }`}
                      >
                        {renderMarkdown(msg.text, isModel)}
                      </div>
                      <span
                        id={`mochi-msg-time-${msg.id}`}
                        className={`text-[9px] text-gray-400 font-mono tracking-wide px-1 ${
                          isModel ? 'text-left' : 'text-right'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div id="mochi-typing-row" className="flex justify-start items-end gap-2.5">
                  <div id="mochi-typing-avatar-wrap" className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-100 border border-gray-200">
                    <img
                      id="mochi-typing-avatar"
                      src="/mochi-pancake-ott.png"
                      alt="Mochi"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div id="mochi-typing-bubble" className="bg-white text-gray-850 border border-gray-100 rounded-2xl rounded-bl-xs px-4 py-3 shadow-3xs flex items-center gap-1.5 h-9 shrink-0">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions/Helper Chips */}
            {messages.length <= 1 && !isLoading && (
              <div id="mochi-suggestions-bar" className="px-4 py-2 bg-neutral-50/40 border-t border-gray-50 flex flex-wrap gap-1.5 justify-start shrink-0">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.text}
                    id={sug.id}
                    onClick={() => handleSendMessage(sug.text)}
                    className="text-[11px] font-sans font-medium bg-white text-gray-600 hover:text-[#3333FF] hover:border-[#3333FF] border border-gray-200 rounded-full px-2.5 py-1 transition-all cursor-pointer shadow-3xs"
                  >
                    {sug.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              id="mochi-input-form"
              onSubmit={handleSubmit}
              className="p-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
            >
              <input
                id="mochi-chat-input-field"
                type="text"
                placeholder="Ask about Minnie's skills, JMX..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-neutral-50 border border-gray-200 focus:border-[#3333FF] focus:outline-hidden text-sm rounded-xl px-3.5 py-2 transition-all disabled:opacity-50"
              />
              <button
                id="mochi-chat-send-btn"
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-[#3333FF] hover:bg-[#1A1AFF] text-white rounded-xl disabled:opacity-40 disabled:hover:bg-[#3333FF] transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
