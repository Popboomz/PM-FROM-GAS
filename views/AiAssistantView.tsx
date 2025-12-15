
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, FileText, Wrench } from 'lucide-react';
import { Button } from '../components/Button';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hi! I'm Mechanic Mike. What seems to be the trouble with your phone today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    { label: "Diagnose Water Damage", icon: AlertTriangle, prompt: "What is the standard checklist for diagnosing an iPhone with salt water damage?" },
    { label: "Quote: Screen + Battery", icon: FileText, prompt: "Draft a friendly SMS quote for an iPhone 13 Pro Screen (OLED) and Battery replacement including discount." },
    { label: "FaceID Errors", icon: Wrench, prompt: "Explain how to fix 'Move iPhone a little lower' FaceID error on iPhone 11 series." },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-end space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
              {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400 text-sm ml-10">
            <Loader2 size={16} className="animate-spin" />
            <span>Mechanic Mike is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Scroll View */}
      <div className="px-4 pb-2 flex space-x-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="flex items-center space-x-1 whitespace-nowrap bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg border border-blue-100 active:scale-95 transition-transform"
          >
            <qp.icon size={12} />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-2 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm outline-none"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
