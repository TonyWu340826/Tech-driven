import React from 'react';
import { Conversation } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ conversations, onConversationClick }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 font-display">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">消息</h2>
        <div className="flex gap-2">
           <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-[24px]">edit_square</span>
          </button>
        </div>
      </div>

      {/* Online Now (Optional Section) */}
      <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
         <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-3 uppercase tracking-wide">当前在线</p>
         <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {conversations.filter(c => c.isOnline).map(c => (
                 <div key={c.id} onClick={() => onConversationClick(c)} className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-surface-dark" style={{backgroundImage: `url('${c.tutorImage}')`}}></div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-16 truncate text-center">{c.tutorName.split(' ')[0]}</span>
                 </div>
            ))}
             {/* Fake extra online users for visual */}
             <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0 opacity-50">
                 <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400">add</span>
                 </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">更多</span>
             </div>
         </div>
      </div>

      {/* Conversation List */}
      <div className="flex flex-col">
        {conversations.map(conversation => (
          <div 
            key={conversation.id} 
            onClick={() => onConversationClick(conversation)}
            className="flex items-center gap-4 px-4 py-3 hover:bg-white dark:hover:bg-surface-dark/50 active:bg-gray-100 dark:active:bg-surface-dark transition-colors cursor-pointer"
          >
            <div className="relative shrink-0">
              <img alt={conversation.tutorName} className="w-14 h-14 rounded-full object-cover bg-gray-200" src={conversation.tutorImage} />
              {conversation.isOnline && (
                 <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{conversation.tutorName}</h3>
                <span className={`text-xs font-medium ${conversation.unreadCount > 0 ? 'text-primary' : 'text-slate-400'}`}>{conversation.lastMessageTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-4 ${conversation.unreadCount > 0 ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-gray-400'}`}>
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-white text-[10px] font-bold rounded-full shadow-sm">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};