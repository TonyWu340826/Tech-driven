import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const getIconClass = (view: ViewState) => {
    // If the view matches the tab, or if it's a detail view belonging to that tab tree
    let isActive = currentView === view;
    
    // Handle nested states for Home tab
    if (view === 'HOME' && currentView === 'TUTOR_DETAIL') isActive = true;
    
    // Handle nested states for Messages tab
    if (view === 'MESSAGES' && currentView === 'CHAT_DETAIL') isActive = true;

    return isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200';
  };
  
  const getFillStyle = (view: ViewState) => {
     let isActive = currentView === view;
     if (view === 'HOME' && currentView === 'TUTOR_DETAIL') isActive = true;
     if (view === 'MESSAGES' && currentView === 'CHAT_DETAIL') isActive = true;

     return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-2 z-50">
      <div className="flex justify-around items-center h-16 pb-2">
        <button 
          onClick={() => onNavigate('HOME')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${getIconClass('HOME')}`}
        >
          <span className="material-symbols-outlined" style={getFillStyle('HOME')}>home</span>
          <span className="text-[10px] font-medium">首页</span>
        </button>
        
        <button 
          onClick={() => onNavigate('DISCOVERY')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${getIconClass('DISCOVERY')}`}
        >
           <span className="material-symbols-outlined" style={getFillStyle('DISCOVERY')}>search</span>
           <span className="text-[10px] font-medium">搜索</span>
        </button>
        
        <button 
          onClick={() => onNavigate('SCHEDULE')}
           className={`flex flex-col items-center gap-1 w-16 transition-colors ${getIconClass('SCHEDULE')}`}
        >
           <span className="material-symbols-outlined" style={getFillStyle('SCHEDULE')}>calendar_month</span>
           <span className="text-[10px] font-medium">课表</span>
        </button>
        
        <button 
          onClick={() => onNavigate('MESSAGES')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${getIconClass('MESSAGES')}`}
        >
          <div className="relative">
            <span className="material-symbols-outlined" style={getFillStyle('MESSAGES')}>chat_bubble</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
          </div>
          <span className="text-[10px] font-medium">消息</span>
        </button>

        <button 
          onClick={() => onNavigate('PROFILE')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${getIconClass('PROFILE')}`}
        >
          <span className="material-symbols-outlined" style={getFillStyle('PROFILE')}>person</span>
          <span className="text-[10px] font-medium">个人中心</span>
        </button>
      </div>
    </nav>
  );
};