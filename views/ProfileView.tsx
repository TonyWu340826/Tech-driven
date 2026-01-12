import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { userService } from '../src/services/api';

interface ProfileViewProps {
  user: any;
  onNavigate: (view: ViewState) => void;
  favoritesCount: number;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onNavigate, favoritesCount, onLogout }) => {
  const [isDark, setIsDark] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    // Check initial state from html class
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    // Fetch user balance
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await userService.getBalance();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleStatClick = (label: string) => {
    if (label === 'Tutors') {
      onNavigate('FAVORITES');
    } else if (label === 'Hours') {
      onNavigate('COMPLETED_CLASSES');
    } else if (label === 'Balance') {
      onNavigate('ACCOUNT_LOGS');
    } else {
      alert(`Clicked ${label}`);
    }
  };

  const handleUpgradeClick = () => {
    alert("Redirecting to upgrade page...");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 font-display">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">个人中心</h2>
        <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-white">settings</span>
        </button>
      </div>

      {/* User Card */}
      <div className="px-4 py-6 flex flex-col items-center">
        <div className="relative mb-3 cursor-pointer" onClick={() => onNavigate('PERSONAL_INFO')}>
          <div className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-lg bg-slate-200"
            style={{ backgroundImage: user?.avatar ? `url('${user.avatar}')` : `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}&backgroundColor=${user?.gender === 'female' ? 'ffdfbf' : 'c0aede'}')` }}>
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white border-2 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || '用户'}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">成员账号 • {user?.email || '未登录'}</p>
      </div>

      {/* Stats / Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleStatClick('Hours')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-primary font-bold text-xl">12</span>
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">已上课时</span>
          </button>
          <button onClick={() => handleStatClick('Tutors')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-primary font-bold text-xl">{favoritesCount}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">关注老师</span>
          </button>
          <button onClick={() => handleStatClick('Balance')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-primary font-bold text-xl">¥{balance.toFixed(2)}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">钱包余额</span>
          </button>
        </div>
      </div>

      {/* Banner / Premium */}
      <div className="px-4 mb-6">
        <div
          onClick={handleUpgradeClick}
          className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-900 dark:to-slate-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full -mr-4 -mt-4 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-yellow-400 filled">workspace_premium</span>
              <span className="font-bold text-sm">TutorConnect Pro</span>
            </div>
            <p className="text-xs text-slate-300">升级会员享受免服务费与专属客服</p>
          </div>
          <button className="relative z-10 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">立即升级</button>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 flex flex-col gap-3">
        <button
          onClick={() => onNavigate('PERSONAL_INFO')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-blue-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">个人信息</span>
          <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
        </button>

        <button
          onClick={() => onNavigate('FAVORITES')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-pink-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">favorite</span>
          </div>
          <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">我的收藏</span>
          <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
        </button>

        <button
          onClick={() => onNavigate('MY_BOOKINGS')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-orange-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">event_note</span>
          </div>
          <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">我的预约</span>
          <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
        </button>

        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 cursor-pointer" onClick={toggleDarkMode}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">dark_mode</span>
          </div>
          <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">深色模式</span>
          <div
            className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-2 flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          退出登录
        </button>
      </div>

    </div>
  );
};