import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineX, HiOutlinePaperAirplane, HiOutlineSparkles } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import { chatService } from '@/services/chatService';

export default function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là trợ lý ảo của PhoneStore. Bạn cần tư vấn điện thoại hay có câu hỏi gì không?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await chatService.sendMessage(userMsg);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ **Lỗi:** ${error.message || 'Không thể kết nối đến AI. Vui lòng thử lại.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[320px] h-[450px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-50 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <HiOutlineSparkles className="text-xl" />
          <h3 className="font-bold text-lg">AI Tư Vấn</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <HiOutlineX className="text-xl" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-blue-500">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-sm flex gap-2 items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về sản phẩm..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
            rows="1"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiOutlinePaperAirplane className="text-lg rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
