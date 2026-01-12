import React from 'react';
import { Tutor } from '../types';

interface FavoritesViewProps {
  tutors: Tutor[];
  onBack: () => void;
  onTutorClick: (tutor: Tutor) => void;
  onRemove: (tutor: Tutor) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ tutors, onBack, onTutorClick, onRemove }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-20">
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">我的收藏</h2>
      </div>

      <div className="p-4 space-y-4">
        {tutors.length > 0 ? (
            tutors.map(tutor => (
                 <div key={tutor.id} onClick={() => onTutorClick(tutor)} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 cursor-pointer active:scale-[0.98] transition-all relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(tutor); }}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined filled">favorite</span>
                    </button>
                    <div className="flex gap-4 items-start">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl h-16 w-16 shrink-0" style={{backgroundImage: `url('${tutor.image}')`}}></div>
                        <div className="flex flex-1 flex-col justify-center min-w-0 pr-8">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight truncate">{tutor.name}</h3>
                            <p className="text-primary text-sm font-medium mt-0.5">{tutor.title}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-yellow-500 text-[16px] filled">star</span>
                                <span className="text-yellow-700 dark:text-yellow-400 text-xs font-bold">{tutor.rating}</span>
                                <span className="text-slate-400 dark:text-slate-500 text-xs">({tutor.reviewCount})</span>
                            </div>
                        </div>
                    </div>
                 </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center pt-24 text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-600">favorite_border</span>
                <p>暂无收藏的老师</p>
                <button onClick={onBack} className="mt-4 text-primary font-medium">去浏览</button>
            </div>
        )}
      </div>
    </div>
  );
};