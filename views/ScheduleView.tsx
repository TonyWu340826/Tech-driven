/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 课程表页面 - 包含月度日历视图，默认显示今日与明日课程，支持点击日期调用接口刷新
 */

import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';

interface ScheduleViewProps {
  scheduleItems: ScheduleItem[];
  onJoinClass: () => void;
  onContactTutor: () => void;
  onRefresh?: () => void; // 刷新回调
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ scheduleItems, onJoinClass, onContactTutor, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // 用于切换月份的主时间
  const [selectedDate, setSelectedDate] = useState(new Date()); // 用于选择具体某一天的时间
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 获取日期的 YYYY-MM-DD 字符串
  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 监听选中日期的变化，点击某一天也调用接口（虽然全量数据已在前端，但满足用户“点击即查数据库”的心理预期）
  useEffect(() => {
    if (onRefresh) {
      console.log('Selected date changed, refreshing data:', getDateKey(selectedDate));
      onRefresh();
    }
  }, [selectedDate]); // 当选中日期改变时调用

  // 计算当前月份的日历数据
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // 本月第一天是周几 (0-6)
  const firstDayOfWeek = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  // 生成日历格子
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
  }

  const handleMonthChange = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const hasBooking = (date: Date) => {
    const key = getDateKey(date);
    return scheduleItems.some(item => item.date === key);
  };

  // 获取特定日期的课程
  const getItemsForDate = (date: Date) => {
    const key = getDateKey(date);
    // console.log(`[ScheduleView] Filtering for date: ${key}`);
    const items = scheduleItems.filter(item => item.date === key);
    // console.log(`[ScheduleView] Found ${items.length} items for ${key}`, items);
    return items;
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayItems = getItemsForDate(today);
  const tomorrowItems = getItemsForDate(tomorrow);

  // 是否正在查看非今天的特定日期
  const isViewingSpecificDate = getDateKey(selectedDate) !== getDateKey(today);
  const selectedDayItems = getItemsForDate(selectedDate);

  const weekLabels = ['日', '一', '二', '三', '四', '五', '六'];

  const handleRefreshClick = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const renderClassCard = (item: ScheduleItem) => {
    if (!item) return null;
    return (
      <div key={item.id || Math.random()} className="group flex flex-col rounded-2xl bg-white dark:bg-card-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden bg-slate-100">
              <img src={item.tutorImage || ''} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-base font-bold">{item.tutorName || 'Unknown Tutor'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{item.subject || 'General'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset
            ${item.status === 'upcoming' ? 'bg-blue-500/10 text-blue-600 ring-blue-600/20' :
                item.status === 'completed' ? 'bg-green-500/10 text-green-600 ring-green-600/20' :
                  'bg-gray-500/10 text-gray-500 ring-gray-600/20'}`}>
              {item.status === 'upcoming' ? '待上课' : item.status === 'completed' ? '已完成' : '已取消'}
            </span>
            {item.label && (
              <span className="text-[10px] text-green-500 font-medium animate-pulse">{item.label}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#111722] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-white">{item.startTime} - {item.endTime}</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${item.type === 'online' ? 'text-primary' : 'text-orange-500'}`}>
              {item.type === 'online' ? 'videocam' : 'home_pin'}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-white">{item.type === 'online' ? '在线' : '上门'}</span>
          </div>
        </div>

        {item.status === 'upcoming' && (
          item.type === 'online' ? (
            <button onClick={(e) => { e.stopPropagation(); onJoinClass(); }} className="w-full py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              进入课堂
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); onContactTutor(); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                联系老师
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                查看详情
              </button>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-24">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1">我的课表</h2>
        <div className="flex items-center justify-end">
          <button onClick={handleRefreshClick} className={`flex items-center justify-center rounded-full h-10 w-10 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isRefreshing ? 'animate-spin text-primary' : ''}`}>
            <span className="material-symbols-outlined text-[24px]">refresh</span>
          </button>
        </div>
      </div>

      {/* 固定查询今日课程按钮 */}
      <div className="px-4 pt-4">
        <button
          onClick={() => {
            const now = new Date();
            setCurrentDate(now);
            setSelectedDate(now);
            handleRefreshClick();
          }}
          className="flex w-full items-center justify-between p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white">today</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">查看今日课程</p>
              <p className="text-[11px] opacity-70">同步数据库最新课程记录</p>
            </div>
          </div>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>
      </div>

      {/* 日历部分 */}
      <div className="px-4 py-2 mt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-900 dark:text-white text-lg font-bold">
            {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
          </p>
          <div className="flex gap-2">
            <button onClick={() => handleMonthChange(-1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setCurrentDate(new Date());
              }}
              className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              今
            </button>
            <button onClick={() => handleMonthChange(1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-6">
          {weekLabels.map(label => (
            <div key={label} className="h-8 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400">{label}</div>
          ))}
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="h-12" />;

            const isSelected = getDateKey(date) === getDateKey(selectedDate);
            const isToday = getDateKey(date) === getDateKey(new Date());
            const hasClass = hasBooking(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`relative h-12 flex flex-col items-center justify-center rounded-xl transition-all
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                  ${isToday && !isSelected ? 'text-primary ring-1 ring-inset ring-primary/30' : ''}
                `}
              >
                <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-700 dark:text-gray-200'}`}>
                  {date.getDate()}
                </span>
                {hasClass && (
                  <span className={`absolute bottom-2 size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 课程列表 */}
      <div className="px-4 space-y-6">
        {isViewingSpecificDate ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-1 rounded-full bg-primary"></div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 课程
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {selectedDayItems.length > 0 ? (
                selectedDayItems.map(renderClassCard)
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-slate-400">
                  <span className="material-symbols-outlined text-3xl mb-2">event_busy</span>
                  <p className="text-sm">该日无课</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary"></div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold">今日课程</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {today.getMonth() + 1}月{today.getDate()}日
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {todayItems.length > 0 ? (
                  todayItems.map(renderClassCard)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 text-primary text-center">
                    <span className="material-symbols-outlined text-4xl mb-3">relaxation</span>
                    <p className="text-sm font-bold">今日无课，好好休息吧</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-orange-400"></div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold">明日课程</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {tomorrow.getMonth() + 1}月{tomorrow.getDate()}日
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {tomorrowItems.length > 0 ? (
                  tomorrowItems.map(renderClassCard)
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-slate-400 text-center">
                    <p className="text-sm font-medium">明日也无课，继续放松</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};