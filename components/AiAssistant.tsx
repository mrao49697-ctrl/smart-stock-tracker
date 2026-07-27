'use client';

import { useChat } from '@ai-sdk/react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ content: input, role: 'user' });
    setInput('');
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">StockSathi AI</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-card">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-foreground opacity-70">
                <Bot className="w-12 h-12 mb-2 text-primary" />
                <p>Hi! I'm your AI assistant.</p>
                <p className="text-sm mt-1">Ask me about your inventory, sales, or store management.</p>
              </div>
            )}
            
            {messages.map(m => (
              <div 
                key={m.id} 
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  m.role === 'user' 
                    ? 'bg-primary text-primary-foreground self-end rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-800 text-foreground self-start rounded-bl-none'
                }`}
              >
                {m.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-gray-100 dark:bg-gray-800 text-foreground self-start rounded-xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-2">
              <input
                className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-foreground"
                value={input}
                placeholder="Ask something..."
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
