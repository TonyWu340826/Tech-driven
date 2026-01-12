import React, { useState, useEffect } from 'react';
import { Tutor } from '../types';

interface TutorDetailViewProps {
  tutor: Tutor;
  isFavorite: boolean;
  onBack: () => void;
  onBook: (tutor: Tutor) => void;
  onToggleFavorite: (tutor: Tutor) => void;
}

export const TutorDetailView: React.FC<TutorDetailViewProps> = ({ tutor, isFavorite, onBack, onBook, onToggleFavorite }) => {
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeaderTitle(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} className="text-inherit flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className={`text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center transition-opacity duration-300 ${showHeaderTitle ? 'opacity-100' : 'opacity-0'}`}>
          {tutor.name}
        </h2>
        <div className="flex w-10 items-center justify-end">
          <button
            onClick={() => onToggleFavorite(tutor)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className={`material-symbols-outlined ${isFavorite ? 'text-red-500 filled' : 'text-slate-900 dark:text-white'}`} style={{ fontSize: '24px' }}>favorite</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center pt-2 px-4">
        <div className="relative group cursor-pointer">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 shadow-xl ring-4 ring-surface-light dark:ring-surface-dark" style={{ backgroundImage: `url('${tutor.image}')` }}></div>
          {tutor.verified && (
            <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border-4 border-background-light dark:border-background-dark flex items-center justify-center" title="Verified Tutor">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-center">{tutor.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">{tutor.title} • 博士在读</p>
          <div className="flex items-center gap-1.5 mt-1 bg-surface-light dark:bg-surface-dark py-1 px-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-amber-400 filled" style={{ fontSize: '18px' }}>star</span>
            <span className="text-sm font-bold">{tutor.rating}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({tutor.reviewCount} 条评价)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-4 justify-center flex-wrap">
        {['代数', '微积分', 'SAT 备考', '几何'].map((tag) => (
          <div key={tag} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 dark:bg-surface-dark border border-primary/20 pl-4 pr-4">
            <p className="text-primary dark:text-primary text-xs font-semibold uppercase tracking-wide">{tag}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-3">收费标准</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-primary">videocam</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
              <span className="text-sm font-bold">在线授课</span>
            </div>
            <div>
              <span className="text-2xl font-bold">¥{tutor.price}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ 小时</span>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-primary/50 dark:border-primary/50 ring-1 ring-primary/20 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-primary">home_pin</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">directions_car</span>
              <span className="text-sm font-bold">上门辅导</span>
            </div>
            <div>
              <span className="text-2xl font-bold">¥{tutor.price + 50}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ 小时</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2">个人简介</h3>
        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed text-justify">
          {tutor.bio || '暂无简介。'}
        </p>
        <button className="text-primary font-medium text-sm mt-2 flex items-center gap-1">
          阅读更多 <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      </div>

      {tutor.certifications && (
        <div className="px-4 py-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-3">资质认证</h3>
          <div className="flex flex-col gap-3">
            {tutor.certifications.map(cert => (
              <div key={cert.id} className="flex gap-4 items-start bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="bg-primary/10 text-primary rounded-lg h-12 w-12 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">{cert.icon}</span>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-base">{cert.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tutor.reviews && (
        <div className="py-4">
          <div className="flex items-center justify-between px-4 pb-3">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">评价 ({tutor.reviewCount})</h3>
            <button className="text-primary text-sm font-medium">查看全部</button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar snap-x snap-mandatory">
            {tutor.reviews.map(review => (
              <div key={review.id} className="snap-center shrink-0 w-[280px] bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${review.avatar}')` }}></div>
                  <div>
                    <p className="font-bold text-sm">{review.author}</p>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.floor(review.rating) ? 'filled' : ''}`}>
                          {i < Math.floor(review.rating) ? 'star' : (i < review.rating ? 'star_half' : 'star')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  "{review.content}"
                </p>
                <p className="text-xs text-slate-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-6"></div>
      <div className="fixed bottom-0 left-0 w-full bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 pb-8 flex items-center justify-between gap-4 z-50">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">起价</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[#111418] dark:text-white">¥{tutor.price}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/小时</span>
          </div>
        </div>
        <button onClick={() => onBook(tutor)} className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2">
          立即预约
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};