import React, { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from '../types';

interface ChatDetailViewProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatDetailView: React.FC<ChatDetailViewProps> = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: `new_${Date.now()}`,
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center gap-3 p-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-20">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="relative shrink-0">
             <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{backgroundImage: `url('${conversation.tutorImage}')`}}></div>
             {conversation.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate">{conversation.tutorName}</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">{conversation.isOnline ? '在线' : '离线'}</p>
        </div>
        <div className="flex gap-1">
             <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors text-primary">
                <span className="material-symbols-outlined text-[22px]">call</span>
            </button>
             <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors text-primary">
                <span className="material-symbols-outlined text-[22px]">videocam</span>
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] dark:bg-[#0b101a]">
         {/* Date Separator Example */}
        <div className="flex justify-center my-4">
            <span className="bg-gray-200 dark:bg-surface-dark text-slate-500 dark:text-gray-400 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Today</span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words
                  ${isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-gray-100 dark:border-gray-800 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 flex items-end gap-2 pb-safe">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
        </button>
        <div className="flex-1 bg-gray-100 dark:bg-surface-dark rounded-2xl flex items-center min-h-[44px] px-4 py-2">
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="发送消息..." 
                className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 max-h-24 resize-none"
            />
            <button className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
            </button>
        </div>
        {inputText.trim() ? (
             <button onClick={handleSend} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-blue-600 transition-colors">
                <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
            </button>
        ) : (
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
                <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
        )}
      </div>
    </div>
  );
};