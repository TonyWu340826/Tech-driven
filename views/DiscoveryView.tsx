import React, { useState, useEffect, useMemo } from 'react';
import { Tutor } from '../types';

interface DiscoveryViewProps {
  tutors: Tutor[];
  initialCategory?: string;
  onBack: () => void;
  onTutorClick: (tutor: Tutor) => void;
}

type FilterType = 'SUBJECT' | 'PRICE' | 'TYPE' | 'RATING' | null;

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ tutors, initialCategory, onBack, onTutorClick }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [filters, setFilters] = useState({
    subject: initialCategory || 'All',
    price: 'All',
    type: 'All',
    rating: 'All',
    search: ''
  });

  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, subject: initialCategory }));
    }
  }, [initialCategory]);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleFilterSelect = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = tutor.name.toLowerCase().includes(searchLower);
        const subjectMatch = tutor.subject.toLowerCase().includes(searchLower);
        if (!nameMatch && !subjectMatch) return false;
      }
      
      // Subject
      if (filters.subject !== 'All') {
          // Normalize check
          const tutorSub = tutor.subject.toLowerCase();
          const filterSub = filters.subject.toLowerCase();
          const tagMatch = tutor.tags.some(t => t.toLowerCase().includes(filterSub));
          
          if (!tutorSub.includes(filterSub) && !tagMatch) {
             return false;
          }
      }
      
      // Price
      if (filters.price !== 'All') {
        if (filters.price === '< 200' && tutor.price >= 200) return false;
        if (filters.price === '200 - 300' && (tutor.price < 200 || tutor.price > 300)) return false;
        if (filters.price === '> 300' && tutor.price <= 300) return false;
      }
      
      // Type
      if (filters.type !== 'All') {
          const isOnline = tutor.distance === '在线' || tutor.tags?.some(t => t.includes('在线') || t.includes('Online'));
          if (filters.type === 'Online' && !isOnline) return false;
          if (filters.type === 'In-Person' && isOnline) return false;
      }
      
      // Rating
      if (filters.rating !== 'All') {
        const minRating = parseFloat(filters.rating);
        if (tutor.rating < minRating) return false;
      }

      return true;
    });
  }, [tutors, filters]);

  const getDropdownOptions = () => {
    if (!activeFilter) return null;

    let options: { label: string; value: string }[] = [];
    let currentKey: keyof typeof filters = 'subject';

    switch (activeFilter) {
      case 'SUBJECT':
        currentKey = 'subject';
        options = [
          { label: '全部', value: 'All' },
          { label: '数学', value: 'Math' },
          { label: '英语', value: 'English' },
          { label: '科学', value: 'Science' },
          { label: '西班牙语', value: 'Spanish' },
          { label: '音乐', value: 'Music' }
        ];
        break;
      case 'PRICE':
        currentKey = 'price';
        options = [
          { label: '全部', value: 'All' },
          { label: '¥200 以下', value: '< 200' },
          { label: '¥200 - ¥300', value: '200 - 300' },
          { label: '¥300 以上', value: '> 300' }
        ];
        break;
      case 'TYPE':
        currentKey = 'type';
        options = [
          { label: '全部', value: 'All' },
          { label: '在线', value: 'Online' },
          { label: '线下', value: 'In-Person' }
        ];
        break;
      case 'RATING':
        currentKey = 'rating';
        options = [
          { label: '全部', value: 'All' },
          { label: '4.5 分以上', value: '4.5' },
          { label: '4.8 分以上', value: '4.8' },
          { label: '5.0 满分', value: '5.0' }
        ];
        break;
    }

    return { options, currentKey };
  };

  const dropdownData = getDropdownOptions();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 pb-2">
        <div className="flex items-center px-4 py-2 justify-between">
            <button onClick={onBack} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors">
                 <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">找老师</h2>
            <div className="flex w-10 items-center justify-end"></div>
        </div>
        <div className="px-4 py-2">
            <div className="flex w-full items-center rounded-xl h-12 shadow-sm bg-white dark:bg-surface-dark">
                <div className="text-slate-400 dark:text-[#92a4c9] flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined text-[24px]">search</span>
                </div>
                <input 
                    className="flex w-full min-w-0 flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-4 text-base font-normal leading-normal" 
                    placeholder="搜索科目或姓名..." 
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                />
            </div>
        </div>
        
        {/* Filter Bar */}
        <div className="relative z-40">
            <div className="flex gap-3 px-4 py-2 flex-wrap">
                <button 
                    onClick={() => setFilters({ subject: 'All', price: 'All', type: 'All', rating: 'All', search: '' })}
                    className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-3 shadow-sm transition-all
                        ${Object.values(filters).every(v => v === 'All' || v === '') 
                            ? 'bg-primary text-white shadow-primary/20' 
                            : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-300'}`}
                >
                    <p className="text-sm font-medium leading-normal">全部</p>
                </button>
                
                {[
                    { key: 'SUBJECT', label: '科目', current: filters.subject },
                    { key: 'PRICE', label: '价格', current: filters.price },
                    { key: 'TYPE', label: '类型', current: filters.type },
                    { key: 'RATING', label: '评分', current: filters.rating }
                ].map((btn) => (
                    <div key={btn.key} className="relative">
                         <button 
                            onClick={() => toggleFilter(btn.key as FilterType)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-3 transition-colors border
                                ${activeFilter === btn.key 
                                    ? 'bg-primary text-white border-primary' 
                                    : btn.current !== 'All'
                                        ? 'bg-primary/10 text-primary border-primary/20'
                                        : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300'
                                }`}
                        >
                            <p className="text-sm font-medium leading-normal">
                                {btn.current !== 'All' && btn.key === 'SUBJECT' ? btn.current : btn.label}
                            </p>
                            <span className="material-symbols-outlined text-[20px]">
                                {activeFilter === btn.key ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                            </span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Dropdown Overlay - Rendered outside of the button loop but inside the relative container */}
            {activeFilter && dropdownData && (
              <>
                 <div className="fixed inset-0 z-0" onClick={() => setActiveFilter(null)}></div>
                 <div className="absolute top-full left-4 mt-2 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 min-w-[200px] z-50">
                    {dropdownData.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleFilterSelect(dropdownData.currentKey, opt.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex justify-between items-center
                          ${filters[dropdownData.currentKey] === opt.value 
                            ? 'text-primary bg-primary/5' 
                            : 'text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                      >
                        {opt.label}
                        {filters[dropdownData.currentKey] === opt.value && <span className="material-symbols-outlined text-[18px]">check</span>}
                      </button>
                    ))}
                 </div>
              </>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {filteredTutors.length > 0 ? (
            filteredTutors.map(tutor => (
                 <div key={tutor.id} onClick={() => onTutorClick(tutor)} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex gap-4 items-start">
                        <div className="relative shrink-0">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl h-[72px] w-[72px]" style={{backgroundImage: `url('${tutor.image}')`}}></div>
                            <div className={`absolute -bottom-2 -right-2 rounded-full border-2 border-white dark:border-surface-dark p-0.5 ${
                                tutor.subject === 'Math' ? 'bg-green-500' : tutor.subject === 'English' ? 'bg-blue-500' : tutor.subject === 'Spanish' ? 'bg-purple-500' : 'bg-pink-500'
                            }`}>
                                 <span className="material-symbols-outlined text-[14px] text-white">
                                    {tutor.subject === 'Math' ? 'videocam' : tutor.subject === 'English' ? 'school' : tutor.subject === 'Spanish' ? 'translate' : 'piano'}
                                 </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight truncate">{tutor.name}</h3>
                                    <p className="text-primary text-sm font-medium mt-0.5">{tutor.title}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-400/10 dark:bg-yellow-400/20 px-1.5 py-0.5 rounded-md">
                                    <span className="material-symbols-outlined text-yellow-500 text-[16px] filled">star</span>
                                    <span className="text-yellow-700 dark:text-yellow-400 text-xs font-bold">{tutor.rating}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs">({tutor.reviewCount})</span>
                                </div>
                            </div>
                            <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal leading-relaxed line-clamp-2 mt-2">
                                {tutor.bio || '暂无简介'}
                            </p>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700/50"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-900 dark:text-white font-bold text-lg">¥{tutor.price}<span className="text-slate-500 dark:text-slate-400 text-sm font-normal">/小时</span></span>
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                                 <span className="material-symbols-outlined text-[16px]">{tutor.distance?.includes('在线') ? 'videocam' : 'location_on'}</span>
                                 <span>{tutor.distance?.includes('在线') ? '仅限在线' : `距离 ${tutor.distance}`}</span>
                            </div>
                        </div>
                        <button className={`${tutor.distance?.includes('在线') ? 'bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 border border-primary/20' : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'} text-sm font-bold py-2 px-5 rounded-lg transition-colors`}>
                            {tutor.distance?.includes('在线') ? '查看' : '预约'}
                        </button>
                    </div>
                 </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <p>没有找到符合条件的老师</p>
                <button 
                  onClick={() => setFilters({ subject: 'All', price: 'All', type: 'All', rating: 'All', search: '' })}
                  className="mt-4 text-primary font-medium text-sm hover:underline"
                >
                  清除筛选条件
                </button>
            </div>
        )}
        {/* Spacer for scroll */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};