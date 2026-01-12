import React, { useState } from 'react';
import { Tutor } from '../types';

interface HomeViewProps {
  user: any;
  tutors: Tutor[];
  onTutorClick: (tutor: Tutor) => void;
  onSearchClick: (category?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ user, tutors, onTutorClick, onSearchClick }) => {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight">你好，{user?.name || '用户'} 👋</h2>
          </div>
          <button
            onClick={() => setHasUnread(false)}
            className="relative p-2 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-700 dark:text-white">notifications</span>
            {hasUnread && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            )}
          </button>
        </div>
        <div className="relative group cursor-pointer" onClick={() => onSearchClick()}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            readOnly
            className="block w-full pl-10 pr-12 py-3.5 bg-surface-light dark:bg-surface-dark border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
            placeholder="搜索“微积分”或“钢琴”..."
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button className="p-1.5 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            </button>
          </div>
        </div>
      </header>

      {/* Banners */}
      <section className="mt-4 overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 snap-x snap-mandatory">
          <div className="snap-center shrink-0 w-80 h-44 rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9owUjlN__iO2pwYJSF3FGzRPkhUSZOz161oZQOV28sEjLcMaavyqfsM7XLEvAVozWP8PvmpGQK23rvJVrrEJNcIZmQxZudTSesHAtqtlLBkxi_kb1PjVv6n2p1NiV-yGBg8GYsMxX2rCV08ZJXXhC7lKbd0-4097zuI6Iz_bzVT-x7_RsFIj11simPqqf4pNO_aIuwJ98Eb0y_OaFsZFYg9vrCzyH7KnZqnHFM0kt_mnifhqD4D5QGQ8IeXPUe9GWk49YI0vV68Oy')" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center p-6 text-white max-w-[70%]">
              <span className="inline-block px-2 py-1 bg-primary text-xs font-bold rounded-md mb-2 w-fit">优惠</span>
              <h3 className="text-xl font-bold mb-1">开学季特惠</h3>
              <p className="text-sm text-slate-200 mb-3">本月前3节课享受8折优惠</p>
            </div>
          </div>
          <div className="snap-center shrink-0 w-80 h-44 rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZ7u--sPO9UYZomHJHz9LeK8Ta74CVxKMKeDehCJLOzHfwFAKVdL7FLWkA6OQGy0QZ0fKSfRHofIDNI9s_y23xNFrAZL3BmOFaVrtY3pURmt81EkvK2k2Yh4eS-nDYN7X3Fg_-RSMaTT92JVYfzM3ro54OUIxqMOSzLem0DmaziwGE4Oq6rZTNlyRzMhTeM2x06dUWpCODr2ybh60Dr5EGg39c6xf8490pUwOuknAVcmGus70G7cl07YIC3D-xPwmXzboCzy4t2TUd')" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center p-6 text-white max-w-[70%]">
              <span className="inline-block px-2 py-1 bg-purple-500 text-xs font-bold rounded-md mb-2 w-fit">最新</span>
              <h3 className="text-xl font-bold mb-1">掌握一项技能</h3>
              <p className="text-sm text-slate-200 mb-3">探索音乐、艺术和编程导师。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">按科目浏览</h3>
          <button className="text-sm font-medium text-primary hover:text-blue-400">查看全部</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: 'calculate', label: '数学', color: 'blue', value: 'Math' },
            { icon: 'menu_book', label: '英语', color: 'orange', value: 'English' },
            { icon: 'science', label: '科学', color: 'emerald', value: 'Science' },
            { icon: 'piano', label: '音乐', color: 'purple', value: 'Music' },
            { icon: 'palette', label: '美术', color: 'pink', value: 'Art' },
            { icon: 'code', label: '编程', color: 'cyan', value: 'Coding' },
            { icon: 'language', label: '语言', color: 'indigo', value: 'Language' },
            { icon: 'grid_view', label: '更多', color: 'slate', value: '' },
          ].map((cat, idx) => (
            <button key={idx} onClick={() => onSearchClick(cat.value)} className="flex flex-col items-center gap-2 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
                  ${cat.color === 'slate'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-600 group-hover:text-white'
                  : `bg-${cat.color}-100 dark:bg-${cat.color}-900/30 text-${cat.color}-600 dark:text-${cat.color}-400 group-hover:bg-${cat.color}-500 group-hover:text-white`
                }`}>
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommended Tutors */}
      <section className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">推荐老师</h3>
          <button onClick={() => onSearchClick()} className="text-sm font-medium text-primary hover:text-blue-400">查看全部</button>
        </div>
        <div className="flex flex-col gap-4">
          {tutors.map(tutor => (
            <div key={tutor.id} onClick={() => onTutorClick(tutor)} className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800/50 cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img alt={tutor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 bg-slate-200"
                    src={tutor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.name}&backgroundColor=${tutor.gender === 'female' ? 'ffdfbf' : 'c0aede'}`} />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base truncate flex items-center gap-1">
                        {tutor.name}
                        {tutor.verified && <span className="material-symbols-outlined text-primary text-[16px] filled">verified</span>}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{tutor.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-primary">¥{tutor.price}</span>
                      <span className="block text-xs text-slate-400 font-medium">/小时</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 mb-3">
                    <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
                    <span className="text-sm font-bold">{tutor.rating}</span>
                    <span className="text-sm text-slate-400">({tutor.reviewCount} 条评价)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.tags.map((tag, i) => (
                      <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
                        ${tag.includes('上门') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : tag.includes('在线') ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {tag.includes('上门') ? 'home_pin' : 'videocam'}
                        </span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};